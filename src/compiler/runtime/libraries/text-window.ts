import { LibraryTypeDefinition, LibraryMethodDefinition, LibraryPropertyDefinition } from "../supported-libraries";
import { ValueKind, BaseValue } from "../values/base-value";
import { StringValue } from "../values/string-value";
import { NumberValue } from "../values/number-value";
import { DocumentationResources } from "../../strings/documentation";
import { ExecutionState, ExecutionEngine } from "../../execution-engine";
import { PubSubPayloadChannel, PubSubChannel } from "../../notifications";

export enum TextWindowColors {
    Black = 0,
    DarkBlue = 1,
    DarkGreen = 2,
    DarkCyan = 3,
    DarkRed = 4,
    DarkMagenta = 5,
    DarkYellow = 6,
    Gray = 7,
    DarkGray = 8,
    Blue = 9,
    Green = 10,
    Cyan = 11,
    Red = 12,
    Magenta = 13,
    Yellow = 14,
    White = 15
}

const defaultForegroundColor = TextWindowColors.White;
const defaultBackgroundColor = TextWindowColors.Black;

export class TextWindowLibrary implements LibraryTypeDefinition {
    private _foreground: TextWindowColors;
    private _background: TextWindowColors;

    public constructor() {
        this._foreground = defaultForegroundColor;
        this._background = defaultBackgroundColor;
    }

    public readonly blockedOnInput: PubSubPayloadChannel<ValueKind> = new PubSubPayloadChannel<ValueKind>("blockedOnInput");
    public readonly producedOutput: PubSubChannel = new PubSubChannel("producedOutput");

    public readonly backgroundColorChanged: PubSubPayloadChannel<TextWindowColors> = new PubSubPayloadChannel<TextWindowColors>("backgroundColorChanged");
    public readonly foregroundColorChanged: PubSubPayloadChannel<TextWindowColors> = new PubSubPayloadChannel<TextWindowColors>("foregroundColorChanged");

    public readonly description: string = DocumentationResources.TextWindow;

    public get foreground(): TextWindowColors {
        return this._foreground;
    }

    public get background(): TextWindowColors {
        return this._background;
    }

    public readonly methods: { readonly [name: string]: LibraryMethodDefinition } = {
        Read: {
            description: DocumentationResources.TextWindow_Read,
            parameters: {},
            returnsValue: true,
            execute: (engine: ExecutionEngine) => {
                if (engine.buffer.hasValue()) {
                    const value = engine.buffer.readValue();
                    if (value.kind !== ValueKind.String) {
                        throw new Error(`Unexpected value kind: ${ValueKind[value.kind]}`);
                    }

                    engine.state = ExecutionState.Running;
                    engine.pushEvaluationStack(value);
                    return true;
                } else {
                    engine.state = ExecutionState.BlockedOnStringInput;
                    this.blockedOnInput.publish(ValueKind.String);
                    return false;
                }
            }
        },
        ReadNumber: {
            description: DocumentationResources.TextWindow_ReadNumber,
            parameters: {},
            returnsValue: true,
            execute: (engine: ExecutionEngine) => {
                if (engine.buffer.hasValue()) {
                    const value = engine.buffer.readValue();
                    if (value.kind !== ValueKind.Number) {
                        throw new Error(`Unexpected value kind: ${ValueKind[value.kind]}`);
                    }

                    engine.pushEvaluationStack(value);
                    engine.state = ExecutionState.Running;
                    return true;
                } else {
                    engine.state = ExecutionState.BlockedOnNumberInput;
                    this.blockedOnInput.publish(ValueKind.Number);
                    return false;
                }
            }
        },
        WriteLine: {
            description: DocumentationResources.TextWindow_WriteLine,
            parameters: {
                data: DocumentationResources.TextWindow_WriteLine_Data
            },
            returnsValue: false,
            execute: (engine: ExecutionEngine) => {
                if (engine.state === ExecutionState.BlockedOnOutput) {
                    if (!engine.buffer.hasValue()) {
                        engine.state = ExecutionState.Running;
                        return true;
                    }
                } else {
                    engine.buffer.writeValue(new StringValue(engine.popEvaluationStack().toValueString()));
                    engine.state = ExecutionState.BlockedOnOutput;
                    this.producedOutput.publish();
                }

                return false;
            }
        }
    };

    public readonly properties: { readonly [name: string]: LibraryPropertyDefinition } = {
        ForegroundColor: {
            description: DocumentationResources.TextWindow_ForegroundColor,
            getter: () => {
                return new StringValue(TextWindowColors[this._foreground]);
            },
            setter: (value: BaseValue) => {
                let selectedColor = defaultForegroundColor;

                switch (value.kind) {
                    case ValueKind.Number: {
                        const numberValue = (value as NumberValue).value;
                        if (TextWindowColors[numberValue]) {
                            selectedColor = numberValue;
                        }
                        break;
                    }
                    case ValueKind.String: {
                        const stringValue = (value as StringValue).value.toLowerCase();
                        for (let color in TextWindowColors) {
                            if (color.toLowerCase() === stringValue) {
                                selectedColor = <any>TextWindowColors[color];
                            }
                        }
                        break;
                    }
                }

                this._foreground = selectedColor;
                this.foregroundColorChanged.publish(this._foreground);
            }
        },
        BackgroundColor: {
            description: DocumentationResources.TextWindow_BackgroundColor,
            getter: () => {
                return new StringValue(TextWindowColors[this._background]);
            },
            setter: (value: BaseValue) => {
                let selectedColor = defaultBackgroundColor;

                switch (value.kind) {
                    case ValueKind.Number: {
                        const numberValue = (value as NumberValue).value;
                        if (TextWindowColors[numberValue]) {
                            selectedColor = numberValue;
                        }
                        break;
                    }
                    case ValueKind.String: {
                        const stringValue = (value as StringValue).value.toLowerCase();
                        for (let color in TextWindowColors) {
                            if (color.toLowerCase() === stringValue) {
                                selectedColor = <any>TextWindowColors[color];
                            }
                        }
                        break;
                    }
                }

                this._background = selectedColor;
                this.backgroundColorChanged.publish(this._background);
            }
        }
    };
}
