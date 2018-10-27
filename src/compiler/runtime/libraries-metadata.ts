import { DocumentationResources } from "../../strings/documentation";

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

class EventMetadata {
    public constructor(
        public readonly typeName: string,
        public readonly eventName: string) {
    }

    public get description(): string {
        return DocumentationResources.get(`${this.typeName}_${this.eventName}`);
    }
}

class TypeMetadata {
    public constructor(
        public readonly typeName: string,
        public readonly methods: { readonly [name: string]: MethodMetadata },
        public readonly properties: { readonly [name: string]: PropertyMetadata },
        public readonly events: { readonly [name: string]: EventMetadata }) {
    }

    public get description(): string {
        return DocumentationResources.get(this.typeName);
    }
}

export class LibrariesMetadata {
    readonly [name: string]: TypeMetadata;

    public readonly Array: TypeMetadata = new TypeMetadata("Array",
        {
            IsArray: new MethodMetadata("Array", "IsArray", true, ["Value"]),
            GetItemCount: new MethodMetadata("Array", "GetItemCount", true, ["Array"]),
            GetAllIndices: new MethodMetadata("Array", "GetAllIndices", true, ["Array"]),
            ContainsValue: new MethodMetadata("Array", "ContainsValue", true, ["Array", "Index"]),
            ContainsIndex: new MethodMetadata("Array", "ContainsIndex", true, ["Array", "Index"])
        },
        {
            // No Properties
        },
        {
            // No Events
        });

    public readonly Clock: TypeMetadata = new TypeMetadata("Clock",
        {
            // No Methods
        },
        {
            Time: new PropertyMetadata("Clock", "Time", true, false)
        },
        {
            // No Events
        });

        /* // TODO: 
    public readonly Controls: TypeMetadata = new TypeMetadata("Controls",
        {
            AddButton: new MethodMetadata("Controls", "AddButton", true, ["Caption", "Left", "Top"]),
            GetButtonCaption: new MethodMetadata("Controls", "GetButtonCaption", true, ["ButtonName"]),
            SetButtonCaption: new MethodMetadata("Controls", "SetButtonCaption", false, ["ButtonName", "Caption"]),
            AddTextBox: new MethodMetadata("Controls", "AddTextBox", true, ["Left", "Top"]),
            AddMultiLineTextBox: new MethodMetadata("Controls", "AddMultiLineTextBox", true, ["Left", "Top"]),
            GetTextBoxText: new MethodMetadata("Controls", "GetTextBoxText", true, ["TextBoxName"]),
            SetTextBoxText: new MethodMetadata("Controls", "SetTextBoxText", true, ["TextBoxName", "Text"]),
            Remove: new MethodMetadata("Controls", "Remove", false, ["ControlName"]),
            Move: new MethodMetadata("Controls", "Move", false, ["Control", "X", "Y"]),
            SetSize: new MethodMetadata("Controls", "SetSize", false, ["Control", "Width", "Height"]),
            HideControl: new MethodMetadata("Controls", "HideControl", false, ["ControlName"]),
            ShowControl: new MethodMetadata("Controls", "ShowControl", false, ["ControlName"])
        },
        {
            LastClickedButton: new PropertyMetadata("Controls", "LastClickedButton", true, false),
            LastTypedTextBox: new PropertyMetadata("Controls", "LastTypedTextBox", true, false)
        },
        {
            ButtonClicked: new EventMetadata("Controls", "ButtonClicked"),
            TextTyped: new EventMetadata("Controls", "TextTyped")
        });
        */

    public readonly Math: TypeMetadata = new TypeMetadata("Math",
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
        },
        {
            // No Events
        });

    public readonly Program: TypeMetadata = new TypeMetadata("Program",
        {
            Pause: new MethodMetadata("Program", "Pause", false, []),
            End: new MethodMetadata("Program", "End", false, [])
        },
        {
            // No Properties
        },
        {
            // No Events
        });

    public readonly Shapes: TypeMetadata = new TypeMetadata("Shapes",
        {
            AddRectangle: new MethodMetadata("Shapes", "AddRectangle", true, ["Width", "Height"]),
            AddEllipse: new MethodMetadata("Shapes", "AddEllipse", true, ["Width", "Height"]),
            AddTriangle: new MethodMetadata("Shapes", "AddTriangle", true, ["X1", "Y1", "X2", "Y2", "X3", "Y3"]),
            AddLine: new MethodMetadata("Shapes", "AddLine", true, ["X1", "Y1", "X2", "Y2"]),
            AddImage: new MethodMetadata("Shapes", "AddImage", true, ["ImageName"]),
            AddText: new MethodMetadata("Shapes", "AddText", true, ["Text"]),
            SetText: new MethodMetadata("Shapes", "SetText", false, ["ShapeName", "Text"]),
            Remove: new MethodMetadata("Shapes", "Remove", false, ["ShapeName"]),
            Move: new MethodMetadata("Shapes", "Move", false, ["ShapeName", "X", "Y"]),
            Rotate: new MethodMetadata("Shapes", "Rotate", false, ["ShapeName", "Angle"]),
            Zoom: new MethodMetadata("Shapes", "Zoom", false, ["ShapeName", "ScaleX", "ScaleY"]),
            Animate: new MethodMetadata("Shapes", "Animate", false, ["ShapeName", "X", "Y", "Duration"]),
            GetLeft: new MethodMetadata("Shapes", "GetLeft", true, ["ShapeName"]),
            GetTop: new MethodMetadata("Shapes", "GetTop", true, ["ShapeName"]),
            GetOpacity: new MethodMetadata("Shapes", "GetOpacity", true, ["ShapeName"]),
            SetOpacity: new MethodMetadata("Shapes", "SetOpacity", false, ["ShapeName", "Level"]),
            HideShape: new MethodMetadata("Shapes", "HideShape", false, ["ShapeName"]),
            ShowShape: new MethodMetadata("Shapes", "ShowShape", false, ["ShapeName"])
        },
        {
            // No Properties
        },
        {
            // No Events
        });

    public readonly Stack: TypeMetadata = new TypeMetadata("Stack",
        {
            PushValue: new MethodMetadata("Stack", "PushValue", false, ["StackName", "Value"]),
            GetCount: new MethodMetadata("Stack", "GetCount", true, ["StackName"]),
            PopValue: new MethodMetadata("Stack", "PopValue", true, ["StackName"])
        },
        {
            // No Properties
        },
        {
            // No Events
        });

    public readonly Text: TypeMetadata = new TypeMetadata("Text",
        {
            Append: new MethodMetadata("Text", "Append", true, ["Text1", "Text2"]),
            GetLength: new MethodMetadata("Text", "GetLength", true, ["Text"])
        },
        {
            // No Properties
        },
        {
            // No Events
        });

    public readonly TextWindow: TypeMetadata = new TypeMetadata("TextWindow",
        {
            Read: new MethodMetadata("TextWindow", "Read", true, []),
            ReadNumber: new MethodMetadata("TextWindow", "ReadNumber", true, []),

            Write: new MethodMetadata("TextWindow", "Write", false, ["Data"]),
            WriteLine: new MethodMetadata("TextWindow", "WriteLine", false, ["Data"])
        },
        {
            ForegroundColor: new PropertyMetadata("TextWindow", "ForegroundColor", true, true),
            BackgroundColor: new PropertyMetadata("TextWindow", "BackgroundColor", true, true)
        },
        {
            // No Events
        });

        /* // TODO: 
    public readonly Turtle: TypeMetadata = new TypeMetadata("Turtle",
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
        },
        {
            // No Events
        });
        */
}
