import { DocumentationResources } from "../../strings/documentation";

export enum ProgramKind {
    Any,
    Console,
    Turtle
}

class MethodMetadata {
    public constructor(
        public readonly typeName: string,
        public readonly methodName: string,
        public readonly returnsValue: boolean,
        public readonly parameters: ReadonlyArray<string>) {
    }

    public get description(): string {
        return DocumentationResources.get(`${this.typeName}_${this.methodName}`);
    }

    public parameterDescription(name: string): string {
        return DocumentationResources.get(`${this.typeName}_${this.methodName}_${name}`);
    }
}

class PropertyMetadata {
    public constructor(
        public readonly typeName: string,
        public readonly propertyName: string,
        public readonly hasGetter: boolean,
        public readonly hasSetter: boolean) {
    }

    public get description(): string {
        return DocumentationResources.get(`${this.typeName}_${this.propertyName}`);
    }
}

class TypeMetadata {
    public constructor(
        public readonly typeName: string,
        public readonly kind: ProgramKind,
        public readonly methods: { readonly [name: string]: MethodMetadata },
        public readonly properties: { readonly [name: string]: PropertyMetadata }) {
    }

    public get description(): string {
        return DocumentationResources.get(this.typeName);
    }
}

export class LibrariesMetadata {
    readonly [name: string]: TypeMetadata;

    public readonly Array: TypeMetadata = new TypeMetadata("Array", ProgramKind.Any,
        {
            IsArray: new MethodMetadata("Array", "IsArray", true, ["Value"]),
            GetItemCount: new MethodMetadata("Array", "GetItemCount", true, ["Array"]),
            GetAllIndices: new MethodMetadata("Array", "GetAllIndices", true, ["Array"]),
            ContainsValue: new MethodMetadata("Array", "ContainsValue", true, ["Array", "Index"]),
            ContainsIndex: new MethodMetadata("Array", "ContainsIndex", true, ["Array", "Index"])
        },
        {
            // No Properties
        });

    public readonly Clock: TypeMetadata = new TypeMetadata("Clock", ProgramKind.Any,
        {
            // No Methods
        },
        {
            Time: new PropertyMetadata("Clock", "Time", true, false)
        });

    public readonly Program: TypeMetadata = new TypeMetadata("Program", ProgramKind.Any,
        {
            Pause: new MethodMetadata("Program", "Pause", false, []),
            End: new MethodMetadata("Program", "End", false, [])
        },
        {
            // No Properties
        });

    public readonly Stack: TypeMetadata = new TypeMetadata("Stack", ProgramKind.Any,
        {
            PushValue: new MethodMetadata("Stack", "PushValue", false, ["StackName", "Value"]),
            GetCount: new MethodMetadata("Stack", "GetCount", true, ["StackName"]),
            PopValue: new MethodMetadata("Stack", "PopValue", true, ["StackName"])
        },
        {
            // No Properties
        });

    public readonly TextWindow: TypeMetadata = new TypeMetadata("TextWindow", ProgramKind.Console,
        {
            Read: new MethodMetadata("TextWindow", "Read", true, []),
            ReadNumber: new MethodMetadata("TextWindow", "ReadNumber", true, []),
            Write: new MethodMetadata("TextWindow", "Write", false, ["Data"]),
            WriteLine: new MethodMetadata("TextWindow", "WriteLine", false, ["Data"])
        },
        {
            ForegroundColor: new PropertyMetadata("TextWindow", "ForegroundColor", true, true),
            BackgroundColor: new PropertyMetadata("TextWindow", "BackgroundColor", true, true)
        });
}
