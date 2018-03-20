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
    private bufferValue?: BaseValue;
    private _foregroundValue: TextWindowColors;
    private _backgroundValue: TextWindowColors;

    private _read: LibraryMethodDefinition = {
        description: DocumentationResources.TextWindow_Read,
        parameters: {},
        returnsValue: true,
        execute: (engine: ExecutionEngine) => {
            if (this.bufferHasValue()) {
                const value = this.readValueFromBuffer();
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
    };

    private _readNumber: LibraryMethodDefinition = {
        description: DocumentationResources.TextWindow_ReadNumber,
        parameters: {},
        returnsValue: true,
        execute: (engine: ExecutionEngine) => {
            if (this.bufferHasValue()) {
                const value = this.readValueFromBuffer();
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
    };

    private _writeLine: LibraryMethodDefinition = {
        description: DocumentationResources.TextWindow_WriteLine,
        parameters: {
            data: DocumentationResources.TextWindow_WriteLine_Data
        },
        returnsValue: false,
        execute: (engine: ExecutionEngine) => {
            if (engine.state === ExecutionState.BlockedOnOutput) {
                if (!this.bufferHasValue()) {
                    engine.state = ExecutionState.Running;
                    return true;
                }
            } else {
                this.writeValueToBuffer(new StringValue(engine.popEvaluationStack().toValueString()));
                engine.state = ExecutionState.BlockedOnOutput;
                this.producedOutput.publish();
            }

            return false;
        }
    };

    private _foregroundColor: LibraryPropertyDefinition = {
        description: DocumentationResources.TextWindow_ForegroundColor,
        getter: () => {
            return new StringValue(TextWindowColors[this._foregroundValue]);
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

            this._foregroundValue = selectedColor;
            this.foregroundColorChanged.publish(this._foregroundValue);
        }
    };

    private _backgroundColor: LibraryPropertyDefinition = {
        description: DocumentationResources.TextWindow_BackgroundColor,
        getter: () => {
            return new StringValue(TextWindowColors[this._backgroundValue]);
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

            this._backgroundValue = selectedColor;
            this.backgroundColorChanged.publish(this._backgroundValue);
        }
    };

    public constructor() {
        this._foregroundValue = defaultForegroundColor;
        this._backgroundValue = defaultBackgroundColor;
    }

    public readonly blockedOnInput: PubSubPayloadChannel<ValueKind> = new PubSubPayloadChannel<ValueKind>("blockedOnInput");
    public readonly producedOutput: PubSubChannel = new PubSubChannel("producedOutput");

    public readonly backgroundColorChanged: PubSubPayloadChannel<TextWindowColors> = new PubSubPayloadChannel<TextWindowColors>("backgroundColorChanged");
    public readonly foregroundColorChanged: PubSubPayloadChannel<TextWindowColors> = new PubSubPayloadChannel<TextWindowColors>("foregroundColorChanged");

    public readonly description: string = DocumentationResources.TextWindow;

    public get foreground(): TextWindowColors {
        return this._foregroundValue;
    }

    public get background(): TextWindowColors {
        return this._backgroundValue;
    }

    public bufferHasValue(): boolean {
        return !!this.bufferValue;
    }

    public writeValueToBuffer(value: BaseValue): void {
        if (this.bufferValue) {
            throw new Error(`Existing value not read yet`);
        }

        this.bufferValue = value;
    }

    public readValueFromBuffer(): BaseValue {
        if (!this.bufferValue) {
            throw new Error(`No value exists in buffer`);
        }

        const value = this.bufferValue;
        this.bufferValue = undefined;
        return value;
    }

    public readonly methods: { readonly [name: string]: LibraryMethodDefinition } = {
        Read: this._read,
        ReadNumber: this._readNumber,
        WriteLine: this._writeLine
    };

    public readonly properties: { readonly [name: string]: LibraryPropertyDefinition } = {
        ForegroundColor: this._foregroundColor,
        BackgroundColor: this._backgroundColor
    };
}
