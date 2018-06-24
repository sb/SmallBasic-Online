import { DocumentationResources } from "../../strings/documentation";

export enum ProgramKind {
    Any,
    TextWindow,
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
        public readonly programKind: ProgramKind,
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

    public readonly Math: TypeMetadata = new TypeMetadata("Math", ProgramKind.Any,
        {
            Abs: new MethodMetadata("Math", "Abs", true, ["Number"]),
            Remainder: new MethodMetadata("Math", "Remainder", true, ["Dividend", "Divisor"]),

            Cos: new MethodMetadata("Math", "Cos", true, ["Angle"]),
            Sin: new MethodMetadata("Math", "Sin", true, ["Angle"]),
            Tan: new MethodMetadata("Math", "Tan", true, ["Angle"]),

            ArcCos: new MethodMetadata("Math", "ArcCos", true, ["CosValue"]),
            ArcSin: new MethodMetadata("Math", "ArcSin", true, ["SinValue"]),
            ArcTan: new MethodMetadata("Math", "ArcTan", true, ["TanValue"]),

            Ceiling: new MethodMetadata("Math", "Ceiling", true, ["Number"]),
            Floor: new MethodMetadata("Math", "Floor", true, ["Number"]),
            Round: new MethodMetadata("Math", "Round", true, ["Number"]),

            GetDegrees: new MethodMetadata("Math", "GetDegrees", true, ["Angle"]),
            GetRadians: new MethodMetadata("Math", "GetRadians", true, ["Angle"]),

            GetRandomNumber: new MethodMetadata("Math", "GetRandomNumber", true, ["MaxNumber"]),

            Log: new MethodMetadata("Math", "Log", true, ["Number"]),
            NaturalLog: new MethodMetadata("Math", "NaturalLog", true, ["Number"]),

            Max: new MethodMetadata("Math", "Max", true, ["Number1", "Number2"]),
            Min: new MethodMetadata("Math", "Min", true, ["Number1", "Number2"]),

            Power: new MethodMetadata("Math", "Power", true, ["BaseNumber", "Exponent"]),
            SquareRoot: new MethodMetadata("Math", "SquareRoot", true, ["Number"])
        },
        {
            Pi: new PropertyMetadata("Math", "Pi", true, false)
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

    public readonly TextWindow: TypeMetadata = new TypeMetadata("TextWindow", ProgramKind.TextWindow,
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

    public readonly Turtle: TypeMetadata = new TypeMetadata("Turtle", ProgramKind.Turtle,
        {
            Show: new MethodMetadata("Turtle", "Show", false, []),
            Hide: new MethodMetadata("Turtle", "Hide", false, []),

            PenDown: new MethodMetadata("Turtle", "PenDown", false, []),
            PenUp: new MethodMetadata("Turtle", "PenUp", false, []),

            Move: new MethodMetadata("Turtle", "Move", false, ["Distance"]),
            MoveTo: new MethodMetadata("Turtle", "MoveTo", false, ["X", "Y"]),

            Turn: new MethodMetadata("Turtle", "Turn", false, ["Angle"]),
            TurnLeft: new MethodMetadata("Turtle", "TurnLeft", false, []),
            TurnRight: new MethodMetadata("Turtle", "TurnRight", false, [])
        },
        {
            Speed: new PropertyMetadata("Turtle", "Speed", true, true),
            Angle: new PropertyMetadata("Turtle", "Angle", true, true),

            X: new PropertyMetadata("Turtle", "X", true, true),
            Y: new PropertyMetadata("Turtle", "Y", true, true)
        });
}
