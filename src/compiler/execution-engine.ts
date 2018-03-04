import { NumberValue } from "./runtime/values/number-value";
import { BaseValue, ValueKind, Constants } from "./runtime/values/base-value";
import { StringValue } from "./runtime/values/string-value";
import { Compilation } from "./compilation";
import {
    BaseInstruction,
    CallSubModuleInstruction,
    InstructionKind,
    JumpInstruction,
    StoreVariableInstruction,
    StoreArrayElementInstruction,
    StorePropertyInstruction,
    LoadVariableInstruction,
    LoadArrayElementInstruction,
    LoadPropertyInstruction,
    MethodCallInstruction,
    PushNumberInstruction,
    PushStringInstruction,
    AddInstruction,
    SubtractInstruction,
    MultiplyInstruction,
    DivideInstruction,
    ConditionalJumpInstruction,
    NegateInstruction
} from "./runtime/instructions";
import { SupportedLibraries } from "./runtime/supported-libraries";
import { Diagnostic, ErrorCode } from "./diagnostics";
import { ArrayValue } from "./runtime/values/array-value";
import { IOBuffer } from "./runtime/io-buffer";
import { PubSubPayloadChannel } from "./notifications";
import { Token, TokenKind } from "./syntax/nodes/tokens";
import { ModuleBinder } from "./binding/module-binder";

interface StackFrame {
    moduleName: string;
    instructionCounter: number;
}

export enum ExecutionMode {
    RunToEnd,
    Debug,
    NextStatement
}

export enum ExecutionState {
    Running,
    Paused,
    Terminated,
    BlockedOnNumberInput,
    BlockedOnStringInput,
    BlockedOnOutput
}

export class ExecutionEngine {
    private _currentLine: number = 0;
    private _memory: { [name: string]: BaseValue } = {};
    private _modules: { readonly [name: string]: ReadonlyArray<BaseInstruction> };

    private _exception?: Diagnostic;
    private _buffer: IOBuffer = new IOBuffer();

    public readonly evaluationStack: BaseValue[] = [];
    public readonly executionStack: StackFrame[] = [];
    public readonly libraries: SupportedLibraries = new SupportedLibraries();

    public state: ExecutionState = ExecutionState.Running;

    public readonly programTerminated: PubSubPayloadChannel<Diagnostic | undefined> = new PubSubPayloadChannel<Diagnostic | undefined>("programTerminated");

    public get memory(): { readonly [name: string]: BaseValue } {
        return this._memory;
    }

    public get modules(): { readonly [name: string]: ReadonlyArray<BaseInstruction> } {
        return this._modules;
    }

    public get exception(): Diagnostic | undefined {
        return this._exception;
    }

    public get buffer(): IOBuffer {
        return this._buffer;
    }

    public constructor(compilation: Compilation) {
        if (compilation.diagnostics.length) {
            throw new Error(`Cannot execute a compilation with errors`);
        }

        this._modules = compilation.emit();

        this.executionStack.push({
            moduleName: ModuleBinder.MainModuleName,
            instructionCounter: 0
        });
    }

    public terminate(exception?: Diagnostic): void {
        this.state = ExecutionState.Terminated;
        this._exception = exception;

        this.programTerminated.publish(exception);
    }

    public execute(mode: ExecutionMode): void {
        if (this.state === ExecutionState.Paused) {
            this.state = ExecutionState.Running;
        }

        while (true) {
            if (this.state === ExecutionState.Terminated) {
                return;
            }

            if (this.executionStack.length === 0) {
                this.terminate();
                return;
            }

            const frame = this.executionStack[this.executionStack.length - 1];

            if (frame.instructionCounter === this._modules[frame.moduleName].length) {
                this.terminate();
                return;
            }

            const instruction = this._modules[frame.moduleName][frame.instructionCounter];

            if (instruction.sourceRange.line !== this._currentLine && mode === ExecutionMode.NextStatement) {
                this._currentLine = instruction.sourceRange.line;
                this.state = ExecutionState.Paused;
                return;
            }

            switch (instruction.kind) {
                case InstructionKind.Jump: {
                    frame.instructionCounter = (instruction as JumpInstruction).target;
                    break;
                }
                case InstructionKind.ConditionalJump: {
                    const value = this.evaluationStack.pop()!;
                    const jump = instruction as ConditionalJumpInstruction;
                    if (value.toBoolean()) {
                        if (jump.trueTarget) {
                            frame.instructionCounter = jump.trueTarget;
                        } else {
                            frame.instructionCounter++;
                        }
                    } else {
                        if (jump.falseTarget) {
                            frame.instructionCounter = jump.falseTarget;
                        } else {
                            frame.instructionCounter++;
                        }
                    }
                    break;
                }
                case InstructionKind.CallSubModule: {
                    this.executionStack.push({
                        instructionCounter: 0,
                        moduleName: (instruction as CallSubModuleInstruction).name
                    });
                    break;
                }
                case InstructionKind.StoreVariable: {
                    this._memory[(instruction as StoreVariableInstruction).name] = this.evaluationStack.pop()!;
                    frame.instructionCounter++;
                    break;
                }
                case InstructionKind.StoreArrayElement: {
                    const value = this.evaluationStack.pop()!;
                    const storeArray = instruction as StoreArrayElementInstruction;

                    let indices = storeArray.indices;
                    let current = this._memory;
                    let index = storeArray.name;

                    while (indices-- > 0) {
                        if (!current[index] || current[index].kind !== ValueKind.Array) {
                            current[index] = new ArrayValue();
                        }

                        current = (current[index] as ArrayValue).value;

                        const indexValue = this.evaluationStack.pop()!;
                        switch (indexValue.kind) {
                            case ValueKind.Number:
                            case ValueKind.String:
                                index = indexValue.toValueString();
                                break;
                            case ValueKind.Array:
                                this.terminate(new Diagnostic(ErrorCode.CannotUseAnArrayAsAnIndexToAnotherArray, storeArray.sourceRange));
                                return;
                            default:
                                throw new Error(`Unexpected value kind ${ValueKind[indexValue.kind]}`);
                        }
                    }

                    current[index] = value;
                    frame.instructionCounter++;
                    break;
                }
                case InstructionKind.StoreProperty: {
                    const storeProperty = instruction as StorePropertyInstruction;
                    this.libraries[storeProperty.library].properties[storeProperty.property].setter!(this, mode, instruction);
                    break;
                }
                case InstructionKind.LoadVariable: {
                    let value = this._memory[(instruction as LoadVariableInstruction).name];
                    if (!value) {
                        value = new StringValue("");
                    }

                    this.evaluationStack.push(value);
                    frame.instructionCounter++;
                    break;
                }
                case InstructionKind.LoadArrayElement: {
                    const loadArray = instruction as LoadArrayElementInstruction;

                    let indices = loadArray.indices;
                    let current = this._memory;
                    let index = loadArray.name;

                    while (indices-- > 0) {
                        if (!current[index] || current[index].kind !== ValueKind.Array) {
                            current[index] = new ArrayValue();
                        }

                        current = (current[index] as ArrayValue).value;

                        const indexValue = this.evaluationStack.pop()!;
                        switch (indexValue.kind) {
                            case ValueKind.Number:
                            case ValueKind.String:
                                index = indexValue.toValueString();
                                break;
                            case ValueKind.Array:
                                this.terminate(new Diagnostic(ErrorCode.CannotUseAnArrayAsAnIndexToAnotherArray, loadArray.sourceRange));
                                return;
                            default:
                                throw new Error(`Unexpected value kind ${ValueKind[indexValue.kind]}`);
                        }
                    }

                    if (!current[index]) {
                        current[index] = new StringValue("");
                    }

                    this.evaluationStack.push(current[index]);
                    frame.instructionCounter++;
                    break;
                }
                case InstructionKind.LoadProperty: {
                    const loadProperty = instruction as LoadPropertyInstruction;
                    this.libraries[loadProperty.library].properties[loadProperty.property].getter!(this, mode, instruction);
                    break;
                }
                case InstructionKind.MethodCall: {
                    const methodCall = instruction as MethodCallInstruction;
                    this.libraries[methodCall.library].methods[methodCall.method].execute(this, mode, instruction);
                    break;
                }
                case InstructionKind.Negate: {
                    const negation = instruction as NegateInstruction;
                    const value = this.evaluationStack.pop()!.tryConvertToNumber();
                    switch (value.kind) {
                        case ValueKind.Number:
                            this.evaluationStack.push(new NumberValue(-(value as NumberValue).value));
                            frame.instructionCounter++;
                            break;
                        case ValueKind.String:
                            this.terminate(new Diagnostic(ErrorCode.CannotUseOperatorWithAString, negation.sourceRange, Token.toDisplayString(TokenKind.Minus)));
                            break;
                        case ValueKind.Array:
                            this.terminate(new Diagnostic(ErrorCode.CannotUseOperatorWithAnArray, negation.sourceRange, Token.toDisplayString(TokenKind.Minus)));
                            break;
                        default:
                            throw new Error(`Unexpected value kind ${ValueKind[value.kind]}`);
                    }
                    break;
                }
                case InstructionKind.Equal: {
                    const rightHandSide = this.evaluationStack.pop()!;
                    const leftHandSide = this.evaluationStack.pop()!;
                    if (leftHandSide.isEqualTo(rightHandSide)) {
                        this.evaluationStack.push(new StringValue(Constants.True));
                    } else {
                        this.evaluationStack.push(new StringValue(Constants.False));
                    }
                    frame.instructionCounter++;
                    break;
                }
                case InstructionKind.LessThan: {
                    const rightHandSide = this.evaluationStack.pop()!;
                    const leftHandSide = this.evaluationStack.pop()!;
                    if (leftHandSide.isLessThan(rightHandSide)) {
                        this.evaluationStack.push(new StringValue(Constants.True));
                    } else {
                        this.evaluationStack.push(new StringValue(Constants.False));
                    }
                    frame.instructionCounter++;
                    break;
                }
                case InstructionKind.GreaterThan: {
                    const rightHandSide = this.evaluationStack.pop()!;
                    const leftHandSide = this.evaluationStack.pop()!;
                    if (leftHandSide.isGreaterThan(rightHandSide)) {
                        this.evaluationStack.push(new StringValue(Constants.True));
                    } else {
                        this.evaluationStack.push(new StringValue(Constants.False));
                    }
                    frame.instructionCounter++;
                    break;
                }
                case InstructionKind.LessThanOrEqual: {
                    const rightHandSide = this.evaluationStack.pop()!;
                    const leftHandSide = this.evaluationStack.pop()!;
                    if (leftHandSide.isLessThan(rightHandSide) || leftHandSide.isEqualTo(rightHandSide)) {
                        this.evaluationStack.push(new StringValue(Constants.True));
                    } else {
                        this.evaluationStack.push(new StringValue(Constants.False));
                    }
                    frame.instructionCounter++;
                    break;
                }
                case InstructionKind.GreaterThanOrEqual: {
                    const rightHandSide = this.evaluationStack.pop()!;
                    const leftHandSide = this.evaluationStack.pop()!;
                    if (leftHandSide.isGreaterThan(rightHandSide) || leftHandSide.isEqualTo(rightHandSide)) {
                        this.evaluationStack.push(new StringValue(Constants.True));
                    } else {
                        this.evaluationStack.push(new StringValue(Constants.False));
                    }
                    frame.instructionCounter++;
                    break;
                }
                case InstructionKind.Add: {
                    const rightHandSide = this.evaluationStack.pop()!;
                    const leftHandSide = this.evaluationStack.pop()!;
                    leftHandSide.add(rightHandSide, this, instruction as AddInstruction);
                    break;
                }
                case InstructionKind.Subtract: {
                    const rightHandSide = this.evaluationStack.pop()!;
                    const leftHandSide = this.evaluationStack.pop()!;
                    leftHandSide.subtract(rightHandSide, this, instruction as SubtractInstruction);
                    break;
                }
                case InstructionKind.Multiply: {
                    const rightHandSide = this.evaluationStack.pop()!;
                    const leftHandSide = this.evaluationStack.pop()!;
                    leftHandSide.multiply(rightHandSide, this, instruction as MultiplyInstruction);
                    break;
                }
                case InstructionKind.Divide: {
                    const rightHandSide = this.evaluationStack.pop()!;
                    const leftHandSide = this.evaluationStack.pop()!;
                    leftHandSide.divide(rightHandSide, this, instruction as DivideInstruction);
                    break;
                }
                case InstructionKind.PushNumber: {
                    this.evaluationStack.push(new NumberValue((instruction as PushNumberInstruction).value));
                    frame.instructionCounter++;
                    break;
                }
                case InstructionKind.PushString: {
                    this.evaluationStack.push(new StringValue((instruction as PushStringInstruction).value));
                    frame.instructionCounter++;
                    break;
                }
                default: {
                    throw new Error(`Unexpected instruction kind ${InstructionKind[instruction.kind]}`);
                }
            }

            // TODO: remove that cast below
            switch (<any>this.state) {
                case ExecutionState.BlockedOnNumberInput:
                case ExecutionState.BlockedOnStringInput:
                    if (!this._buffer.hasValue()) {
                        return;
                    }
                    break;
                case ExecutionState.BlockedOnOutput:
                    if (this._buffer.hasValue()) {
                        return;
                    }
                    break;
                case ExecutionState.Paused:
                    return;
            }
        }
    }

    public moveToNextInstruction(): void {
        this.executionStack[this.executionStack.length - 1].instructionCounter++;
    }
}
