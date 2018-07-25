import { ExecutionMode, ExecutionState, ExecutionEngine } from "../../execution-engine";
import { LibraryTypeInstance, LibraryPropertyInstance, LibraryMethodInstance, LibraryEventInstance } from "../libraries";

export class ProgramLibrary implements LibraryTypeInstance {
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
        Pause: { execute: this.executePause.bind(this) },
        End: { execute: this.executeEnd.bind(this) }
    };

    public readonly properties: { readonly [name: string]: LibraryPropertyInstance } = {};

    public readonly events: { readonly [name: string]: LibraryEventInstance } = {};
}
