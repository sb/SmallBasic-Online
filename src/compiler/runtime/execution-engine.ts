import { NumberValue } from "./values/number-value";
import { BaseValue, ValueKind } from "./values/base-value";
import { StringValue } from "./values/string-value";
import { Compilation } from "../compilation";
import {
    BaseInstruction,
    CallSubModuleInstruction,
    InstructionKind,
    JumpIfFalseInstruction,
    JumpInstruction,
    CallLibraryMethodInstruction,
    StatementStartInstruction,
    StoreVariableInstruction,
    StoreArrayInstruction,
    StorePropertyInstruction,
    LoadVariableInstruction,
    LoadArrayInstruction,
    LoadPropertyInstruction,
    MethodCallInstruction,
    PushNumberInstruction,
    PushStringInstruction,
    AddInstruction,
    SubtractInstruction,
    MultiplyInstruction,
    DivideInstruction
} from "../models/instructions";
import { FastStack } from "../utils/fast-stack";
import { SupportedLibraries } from "./supported-libraries";
import { Diagnostic, ErrorCode } from "../utils/diagnostics";
import { ArrayValue } from "./values/array-value";

interface StackFrame {
    moduleName: string;
    currentLine: number;

    instructionCounter: number;
}

const mainModuleName = "<Main>";

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
    BlockedOnStringInput
}

interface CommunicationContext {
    exception?: Diagnostic;
    ioBuffer?: BaseValue;
    state?: ExecutionState;
}

export class ExecutionEngine {
    private modules: { [name: string]: BaseInstruction[] };

    public readonly evaluationStack: FastStack<BaseValue> = new FastStack<BaseValue>();
    public readonly executionStack: FastStack<StackFrame> = new FastStack<StackFrame>();
    public readonly memory: { [name: string]: BaseValue } = {};

    public readonly context: CommunicationContext = {};

    public constructor(compilation: Compilation) {
        if (compilation.diagnostics.length) {
            throw `Cannot execute a compilation with errors`;
        }

        this.modules = compilation.subModules;
        this.modules[mainModuleName] = compilation.mainModule;

        this.executionStack.push({
            moduleName: mainModuleName,
            currentLine: 0,
            instructionCounter: 0
        });
    }

    public execute(mode: ExecutionMode): void {
        while (this.context.state !== ExecutionState.Terminated) {
            if (this.executionStack.count() === 0) {
                this.context.state = ExecutionState.Terminated;
                return;
            }

            const frame = this.executionStack.peek();
            const instruction = this.modules[frame.moduleName][frame.instructionCounter];

            switch (instruction.kind) {
                case InstructionKind.Jump: {
                    frame.instructionCounter = (instruction as JumpInstruction).target;
                    break;
                }
                case InstructionKind.JumpIfFalse: {
                    const value = this.evaluationStack.pop();
                    if (!value.toBoolean()) {
                        frame.instructionCounter = (instruction as JumpIfFalseInstruction).target;
                    } else {
                        frame.instructionCounter++;
                    }
                    break;
                }
                case InstructionKind.CallSubModule: {
                    this.executionStack.push({
                        currentLine: 0,
                        instructionCounter: 0,
                        moduleName: (instruction as CallSubModuleInstruction).name
                    });
                    break;
                }
                case InstructionKind.CallLibraryMethod: {
                    const callLibraryMethod = instruction as CallLibraryMethodInstruction;
                    SupportedLibraries[callLibraryMethod.library].methods[callLibraryMethod.method].execute(this, mode);
                    break;
                }
                case InstructionKind.StatementStart: {
                    if (this.context.state === ExecutionState.Paused) {
                        this.context.state = ExecutionState.Running;
                        frame.instructionCounter++;
                    } else {
                        frame.currentLine = (instruction as StatementStartInstruction).line;
                        if (mode === ExecutionMode.NextStatement) {
                            this.context.state = ExecutionState.Paused;
                        } else {
                            frame.instructionCounter++;
                        }
                    }
                    break;
                }
                case InstructionKind.StoreVariable: {
                    this.memory[(instruction as StoreVariableInstruction).name] = this.evaluationStack.pop();
                    frame.instructionCounter++;
                    break;
                }
                case InstructionKind.StoreArray: {
                    const value = this.evaluationStack.pop();
                    const storeArray = instruction as StoreArrayInstruction;

                    let indices = storeArray.indices;
                    let parent = this.memory;
                    let index = storeArray.name;

                    while (indices-- > 0) {
                        let current = parent[index] as ArrayValue;
                        if (!current || current.kind() !== ValueKind.Array) {
                            parent[index] = current = new ArrayValue();
                        }

                        const indexValue = this.evaluationStack.pop();
                        switch (indexValue.kind()) {
                            case ValueKind.Number:
                                index = (indexValue as NumberValue).value.toString();
                                break;
                            case ValueKind.String:
                                index = (indexValue as StringValue).value;
                                break;
                            case ValueKind.Array:
                                this.context.exception = new Diagnostic(ErrorCode.CannotUseAnArrayAsAnIndexToAnotherArray, storeArray.sourceRange);
                                this.context.state = ExecutionState.Terminated;
                                return;
                            default:
                                throw `Unexpected value kind ${ValueKind[indexValue.kind()]}`;
                        }

                        parent = current.value;
                    }

                    parent[index] = value;
                    frame.instructionCounter++;
                    break;
                }
                case InstructionKind.StoreProperty: {
                    const storeProperty = instruction as StorePropertyInstruction;
                    SupportedLibraries[storeProperty.library].properties[storeProperty.property].setter!(this, mode);
                    break;
                }
                case InstructionKind.LoadVariable: {
                    this.evaluationStack.push(this.memory[(instruction as LoadVariableInstruction).name]);
                    frame.instructionCounter++;
                    break;
                }
                case InstructionKind.LoadArray: {
                    const storeArray = instruction as LoadArrayInstruction;

                    let indices = storeArray.indices;
                    let parent = this.memory;
                    let index = storeArray.name;

                    while (indices-- > 0) {
                        let current = parent[index] as ArrayValue;
                        if (!current || current.kind() !== ValueKind.Array) {
                            parent[index] = current = new ArrayValue();
                        }

                        const indexValue = this.evaluationStack.pop();
                        switch (indexValue.kind()) {
                            case ValueKind.Number:
                                index = (indexValue as NumberValue).value.toString();
                                break;
                            case ValueKind.String:
                                index = (indexValue as StringValue).value;
                                break;
                            case ValueKind.Array:
                                this.context.exception = new Diagnostic(ErrorCode.CannotUseAnArrayAsAnIndexToAnotherArray, storeArray.sourceRange);
                                this.context.state = ExecutionState.Terminated;
                                return;
                            default:
                                throw `Unexpected value kind ${ValueKind[indexValue.kind()]}`;
                        }

                        parent = current.value;
                    }

                    this.evaluationStack.push(parent[index]);
                    frame.instructionCounter++;
                    break;
                }
                case InstructionKind.LoadProperty: {
                    const loadProperty = instruction as LoadPropertyInstruction;
                    SupportedLibraries[loadProperty.library].properties[loadProperty.property].getter!(this, mode);
                    break;
                }
                case InstructionKind.MethodCall: {
                    const methodCall = instruction as MethodCallInstruction;
                    SupportedLibraries[methodCall.library].methods[methodCall.method].execute(this, mode);
                    break;
                }
                case InstructionKind.Negate: {
                    const value = this.evaluationStack.pop() as NumberValue;
                    this.evaluationStack.push(new NumberValue(-value.value));
                    frame.instructionCounter++;
                    break;
                }
                case InstructionKind.Equal: {
                    const rightHandSide = this.evaluationStack.pop();
                    const leftHandSide = this.evaluationStack.pop();
                    leftHandSide.isEqualTo(rightHandSide, this);
                    break;
                }
                case InstructionKind.LessThan: {
                    const rightHandSide = this.evaluationStack.pop();
                    const leftHandSide = this.evaluationStack.pop();
                    leftHandSide.isLessThan(rightHandSide, this);
                    break;
                }
                case InstructionKind.Add: {
                    const rightHandSide = this.evaluationStack.pop();
                    const leftHandSide = this.evaluationStack.pop();
                    leftHandSide.add(rightHandSide, this, instruction as AddInstruction);
                    break;
                }
                case InstructionKind.Subtract: {
                    const rightHandSide = this.evaluationStack.pop();
                    const leftHandSide = this.evaluationStack.pop();
                    leftHandSide.subtract(rightHandSide, this, instruction as SubtractInstruction);
                    break;
                }
                case InstructionKind.Multiply: {
                    const rightHandSide = this.evaluationStack.pop();
                    const leftHandSide = this.evaluationStack.pop();
                    leftHandSide.multiply(rightHandSide, this, instruction as MultiplyInstruction);
                    break;
                }
                case InstructionKind.Divide: {
                    const rightHandSide = this.evaluationStack.pop();
                    const leftHandSide = this.evaluationStack.pop();
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
                case InstructionKind.Return: {
                    this.executionStack.pop();
                    if (this.executionStack.count() > 0) {
                        this.executionStack.peek().instructionCounter++;
                    }
                    break;
                }
                default: {
                    throw `Unexpected instruction kind ${InstructionKind[instruction.kind]}`;
                }
            }
        }
    }
}
