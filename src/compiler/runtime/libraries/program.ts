import { ExecutionMode, ExecutionState } from "../../execution-engine";
import { LibraryTypeDefinition } from "../supported-libraries";
import { DocumentationResources } from "../../strings/documentation";

export const ProgramLibrary: LibraryTypeDefinition = {
    description: DocumentationResources.Program_Description,
    methods: {
        "Pause": {
            description: DocumentationResources.Program_Pause_Description,
            parameters: {},
            returnsValue: false,
            execute: (engine, mode) => {
                if (engine.state === ExecutionState.Paused) {
                    engine.state = ExecutionState.Running;
                    engine.moveToNextInstruction();
                } else {
                    if (mode === ExecutionMode.Debug) {
                        engine.state = ExecutionState.Paused;
                    } else {
                        engine.moveToNextInstruction();
                    }
                }
            }
        },
        "End": {
            description: DocumentationResources.Program_End_Description,
            parameters: {},
            returnsValue: false,
            execute: (engine) => {
                engine.terminate();
            }
        }
    },
    properties: {
    }
};
