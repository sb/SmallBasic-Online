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
            getter: (engine) => {
                const time = new Date().toLocaleTimeString();
                engine.evaluationStack.push(new StringValue(time));
                engine.moveToNextInstruction();
            }
        }
    }
};
