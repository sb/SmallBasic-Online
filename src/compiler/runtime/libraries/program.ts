import { ExecutionEngine, ExecutionMode, ExecutionState } from "../../execution-engine";
import { LibraryTypeDefinition } from "../supported-libraries";

export const ProgramLibrary: LibraryTypeDefinition = {
    methods: {
        "Pause": {
            argumentsCount: 0,
            returnsValue: false,
            execute: (engine: ExecutionEngine, mode: ExecutionMode) => {
                if (engine.state === ExecutionState.Paused) {
                    engine.state = ExecutionState.Running;
                    engine.executionStack.peek().instructionCounter++;
                } else {
                    if (mode === ExecutionMode.Debug) {
                        engine.state = ExecutionState.Paused;
                    } else {
                        engine.executionStack.peek().instructionCounter++;
                    }
                }
            }
        },
        "End": {
            argumentsCount: 0,
            returnsValue: false,
            execute: (engine: ExecutionEngine, _: ExecutionMode) => {
                engine.terminate();
            }
        }
    },
    properties: {
    }
};
