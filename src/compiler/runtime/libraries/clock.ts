import { LibraryTypeDefinition, LibraryMethodDefinition, LibraryPropertyDefinition } from "../supported-libraries";
import { StringValue } from "../values/string-value";
import { DocumentationResources } from "../../strings/documentation";

export class ClockLibrary implements LibraryTypeDefinition {
    public readonly description: string = DocumentationResources.Clock;

    public readonly methods: { readonly [name: string]: LibraryMethodDefinition } = {
    };

    public readonly properties: { readonly [name: string]: LibraryPropertyDefinition } = {
        Time: {
            description: DocumentationResources.Clock_Time,
            getter: () => {
                const time = new Date().toLocaleTimeString();
                return new StringValue(time);
            }
        }
    };
}
