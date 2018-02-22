import { ExecutionMode, ExecutionState, ExecutionEngine } from "../../execution-engine";
import { LibraryTypeDefinition, LibraryPropertyDefinition, LibraryMethodDefinition } from "../supported-libraries";
import { DocumentationResources } from "../../strings/documentation";

export class ProgramLibrary implements LibraryTypeDefinition {
    public readonly description: string = DocumentationResources.Program_Description;

    public readonly methods: { readonly [name: string]: LibraryMethodDefinition } = {
        Pause: {
            description: DocumentationResources.Program_Pause_Description,
            parameters: {},
            returnsValue: false,
            execute: (engine: ExecutionEngine, mode: ExecutionMode) => {
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
        End: {
            description: DocumentationResources.Program_End_Description,
            parameters: {},
            returnsValue: false,
            execute: (engine: ExecutionEngine) => {
                engine.terminate();
            }
        }
    };

    public readonly properties: { readonly [name: string]: LibraryPropertyDefinition } = {
    };
}
