import { BaseValue } from "./runtime/values/base-value";
import { Compilation } from "./compilation";
import { BaseInstruction } from "./runtime/instructions";
import { SupportedLibraries } from "./runtime/supported-libraries";
import { Diagnostic } from "./diagnostics";
import { ArrayValue } from "./runtime/values/array-value";
import { PubSubPayloadChannel } from "./notifications";
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
    Terminated,
    BlockedOnNumberInput,
    BlockedOnStringInput,
    BlockedOnOutput
}

export class ExecutionEngine {
    private _executionStack: StackFrame[] = [];
    private _evaluationStack: BaseValue[] = [];
    private _memory: ArrayValue = new ArrayValue();
    private _libraries: SupportedLibraries = new SupportedLibraries();
    private _modules: { readonly [name: string]: ReadonlyArray<BaseInstruction> };

    private _exception?: Diagnostic;
    private _currentLine: number = 0;
    private _state: ExecutionState = ExecutionState.Running;

    public readonly programTerminated: PubSubPayloadChannel<Diagnostic | undefined> = new PubSubPayloadChannel<Diagnostic | undefined>("programTerminated");

    public get executionStack(): ReadonlyArray<StackFrame> {
        return this._executionStack;
    }

    public get evaluationStack(): ReadonlyArray<BaseValue> {
        return this._evaluationStack;
    }

    public get memory(): ArrayValue {
        return this._memory;
    }

    public get libraries(): SupportedLibraries {
        return this._libraries;
    }

    public get modules(): { readonly [name: string]: ReadonlyArray<BaseInstruction> } {
        return this._modules;
    }

    public get exception(): Diagnostic | undefined {
        return this._exception;
    }

    public get currentLine(): number {
        return this._currentLine;
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
            if (instruction.sourceRange.line !== this._currentLine && mode === ExecutionMode.NextStatement) {
                this._currentLine = instruction.sourceRange.line;
                this._state = ExecutionState.Paused;
                return;
            }

            instruction.execute(this, mode, frame);

            switch (this.state) {
                case ExecutionState.BlockedOnNumberInput:
                case ExecutionState.BlockedOnStringInput:
                    if (!this.libraries.TextWindow.bufferHasValue()) {
                        return;
                    }
                    break;
                case ExecutionState.BlockedOnOutput:
                    if (this.libraries.TextWindow.bufferHasValue()) {
                        return;
                    }
                    break;
                case ExecutionState.Paused:
                    return;
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
