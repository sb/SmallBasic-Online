import { BaseValue } from "./runtime/values/base-value";
import { Compilation } from "./compilation";
import { BaseInstruction } from "./emitting/instructions";
import { RuntimeLibraries } from "./runtime/libraries";
import { Diagnostic } from "./utils/diagnostics";
import { ArrayValue } from "./runtime/values/array-value";
import { PubSubPayloadChannel } from "./utils/notifications";
import { ModulesBinder } from "./binding/modules-binder";

export interface StackFrame {
    moduleName: string;
    instructionIndex: number;
}

export enum ExecutionMode {
    RunToEnd,
    Debug,
    NextStatement
}

export enum ExecutionState {
    Running,
    Paused,
    BlockedOnInput,
    Terminated
}

export class ExecutionEngine {
    private _libraries: RuntimeLibraries = new RuntimeLibraries();
    private _executionStack: StackFrame[] = [];
    private _evaluationStack: BaseValue[] = [];
    private _memory: ArrayValue = new ArrayValue();
    private _modules: { readonly [name: string]: ReadonlyArray<BaseInstruction> };

    private _exception?: Diagnostic;
    private _currentLine: number = 0;
    private _state: ExecutionState = ExecutionState.Running;

    public readonly programTerminated: PubSubPayloadChannel<Diagnostic | undefined> = new PubSubPayloadChannel<Diagnostic | undefined>("programTerminated");

    public get libraries(): RuntimeLibraries {
        return this._libraries;
    }

    public get executionStack(): ReadonlyArray<StackFrame> {
        return this._executionStack;
    }

    public get evaluationStack(): ReadonlyArray<BaseValue> {
        return this._evaluationStack;
    }

    public get memory(): ArrayValue {
        return this._memory;
    }

    public get modules(): { readonly [name: string]: ReadonlyArray<BaseInstruction> } {
        return this._modules;
    }

    public get exception(): Diagnostic | undefined {
        return this._exception;
    }

    public get state(): ExecutionState {
        return this._state;
    }

    public set state(newState: ExecutionState) {
        this._state = newState;
    }

    public constructor(compilation: Compilation) {
        if (compilation.diagnostics.length) {
            throw new Error(`Cannot execute a compilation with errors`);
        }

        this._modules = compilation.emit();

        this._executionStack.push({
            moduleName: ModulesBinder.MainModuleName,
            instructionIndex: 0
        });
    }

    public execute(mode: ExecutionMode): void {
        if (this._state === ExecutionState.Paused) {
            this._state = ExecutionState.Running;
        }

        while (true) {
            if (this._state === ExecutionState.Terminated) {
                return;
            }

            if (this._executionStack.length === 0) {
                this.terminate();
                return;
            }

            const frame = this._executionStack[this._executionStack.length - 1];
            if (frame.instructionIndex === this._modules[frame.moduleName].length) {
                this._executionStack.pop();
                continue;
            }

            const instruction = this._modules[frame.moduleName][frame.instructionIndex];
            if (instruction.sourceRange.start.line !== this._currentLine && mode === ExecutionMode.NextStatement) {
                this._currentLine = instruction.sourceRange.start.line;
                this._state = ExecutionState.Paused;
                return;
            }

            instruction.execute(this, mode, frame);

            switch (this.state) {
                case ExecutionState.Running:
                    break;
                case ExecutionState.Paused:
                case ExecutionState.Terminated:
                case ExecutionState.BlockedOnInput:
                    return;
                default:
                    throw new Error(`Unexpected execution state: '${ExecutionState[this.state]}'`);
            }
        }
    }

    public terminate(exception?: Diagnostic): void {
        this._state = ExecutionState.Terminated;
        this._exception = exception;
        this.programTerminated.publish(exception);
    }

    public popEvaluationStack(): BaseValue {
        const value = this._evaluationStack.pop();
        if (value) {
            return value;
        }

        throw new Error("Evaluation stack empty");
    }

    public pushEvaluationStack(value: BaseValue): void {
        this._evaluationStack.push(value);
    }

    public pushSubModule(name: string): void {
        if (this._modules[name]) {
            this._executionStack.push({
                moduleName: name,
                instructionIndex: 0
            });
        } else {
            throw new Error(`SubModule ${name} not found`);
        }
    }
}
