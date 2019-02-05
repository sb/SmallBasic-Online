import { ExecutionMode, ExecutionState, ExecutionEngine } from "../../execution-engine";
import { LibraryTypeInstance, LibraryPropertyInstance, LibraryMethodInstance, LibraryEventInstance } from "../libraries";
import { ValueKind } from "../values/base-value";
import { NumberValue } from "../values/number-value";

export class ProgramLibrary implements LibraryTypeInstance {
    private async executeDelay(engine: ExecutionEngine): Promise<any> {
        const milliSecondsArg = engine.popEvaluationStack().tryConvertToNumber();

        const milliSecondsValue = milliSecondsArg.kind === ValueKind.Number ? (milliSecondsArg as NumberValue).value : 0;

        const executionState = engine.state;
        engine.state = ExecutionState.BlockedOnInput;
        await new Promise(resolve => setTimeout(resolve, milliSecondsValue));
        engine.state = executionState;
    }

    private executePause(engine: ExecutionEngine, mode: ExecutionMode): void {
        if (engine.state === ExecutionState.Paused) {
            engine.state = ExecutionState.Running;
        } else if (mode === ExecutionMode.Debug) {
            engine.state = ExecutionState.Paused;
        }
    }

    private executeEnd(engine: ExecutionEngine): void {
        engine.terminate();
    }

    public readonly methods: { readonly [name: string]: LibraryMethodInstance } = {
        Delay: { execute: this.executeDelay.bind(this) },
        Pause: { execute: this.executePause.bind(this) },
        End: { execute: this.executeEnd.bind(this) }
    };

    public readonly properties: { readonly [name: string]: LibraryPropertyInstance } = {};

    public readonly events: { readonly [name: string]: LibraryEventInstance } = {};
}
