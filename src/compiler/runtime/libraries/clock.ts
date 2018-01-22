import { ExecutionEngine, ExecutionMode } from "../../execution-engine";
import { LibraryTypeDefinition } from "../supported-libraries";
import { StringValue } from "../values/string-value";
import { DocumentationResources } from "../../strings/documentation";

export const ClockLibrary: LibraryTypeDefinition = {
    description: DocumentationResources.Clock_Description,
    methods: {
    },
    properties: {
        "Time": {
            description: DocumentationResources.Clock_Time_Description,
            getter: (engine: ExecutionEngine, _: ExecutionMode) => {
                // TODO: correctly implement user's locale
                const time = new Date().toLocaleTimeString();
                engine.evaluationStack.push(new StringValue(time));
                engine.executionStack.peek().instructionCounter++;
            }
        }
    }
};
