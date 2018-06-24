import { ExecutionMode, ExecutionState, ExecutionEngine } from "../../execution-engine";
import { LibraryTypeInstance, LibraryPropertyInstance, LibraryMethodInstance } from "../libraries";

export class ProgramLibrary implements LibraryTypeInstance {
    private executePause(engine: ExecutionEngine, mode: ExecutionMode): boolean {
        if (engine.state === ExecutionState.Paused) {
            engine.state = ExecutionState.Running;
        } else if (mode === ExecutionMode.Debug) {
            engine.state = ExecutionState.Paused;
        }

        return true;
    }

    private executeEnd(engine: ExecutionEngine): boolean {
        engine.terminate();
        return true;
    }

    public readonly methods: { readonly [name: string]: LibraryMethodInstance } = {
        Pause: { execute: this.executePause.bind(this) },
        End: { execute: this.executeEnd.bind(this) }
    };

    public readonly properties: { readonly [name: string]: LibraryPropertyInstance } = {
    };
}
