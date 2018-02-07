import { ExecutionMode, ExecutionState } from "../../execution-engine";
import { LibraryTypeDefinition } from "../supported-libraries";
import { DocumentationResources } from "../../strings/documentation";

export const ProgramLibrary: LibraryTypeDefinition = {
    description: DocumentationResources.Program_Description,
    methods: {
        "Pause": {
            description: DocumentationResources.Program_Pause_Description,
            parametersDescription: [],
            argumentsCount: 0,
            returnsValue: false,
            execute: (engine, mode) => {
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
            description: DocumentationResources.Program_End_Description,
            parametersDescription: [],
            argumentsCount: 0,
            returnsValue: false,
            execute: (engine) => {
                engine.terminate();
            }
        }
    },
    properties: {
    }
};
