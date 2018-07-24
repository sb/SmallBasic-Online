import { LibraryTypeInstance, LibraryMethodInstance, LibraryPropertyInstance, LibraryEventInstance } from "../libraries";
import { ValueKind, BaseValue } from "../values/base-value";
import { StringValue } from "../values/string-value";
import { NumberValue } from "../values/number-value";
import { ExecutionState, ExecutionEngine } from "../../execution-engine";
import { PubSubPayloadChannel, PubSubChannel } from "../../utils/notifications";

// TODO: refactor into a plugin, and maybe remove pubsub afterwards

export enum TextWindowColor {
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

const defaultForegroundColor = TextWindowColor.White;
const defaultBackgroundColor = TextWindowColor.Black;

export interface BufferValue {
    value: BaseValue;
    appendNewLine: boolean;
}

export class TextWindowLibrary implements LibraryTypeInstance {
    private _buffer?: BufferValue;
    private _foregroundValue: TextWindowColor = defaultForegroundColor;
    private _backgroundValue: TextWindowColor = defaultBackgroundColor;

    public readonly blockedOnInput: PubSubPayloadChannel<ValueKind> = new PubSubPayloadChannel<ValueKind>("blockedOnInput");
    public readonly producedOutput: PubSubChannel = new PubSubChannel("producedOutput");

    public readonly backgroundColorChanged: PubSubPayloadChannel<TextWindowColor> = new PubSubPayloadChannel<TextWindowColor>("backgroundColorChanged");
    public readonly foregroundColorChanged: PubSubPayloadChannel<TextWindowColor> = new PubSubPayloadChannel<TextWindowColor>("foregroundColorChanged");

    private executeReadMethod(engine: ExecutionEngine, valueKind: ValueKind, blockedState: ExecutionState): boolean {
        if (this.bufferHasValue()) {
            const value = this.readValueFromBuffer();
            if (value.value.kind !== valueKind) {
                throw new Error(`Unexpected value kind: ${ValueKind[value.value.kind]}`);
            }

            engine.pushEvaluationStack(value.value);
            engine.state = ExecutionState.Running;
            return true;
        } else {
            engine.state = blockedState;
            this.blockedOnInput.publish(valueKind);
            return false;
        }
    }

    private executeWriteMethod(engine: ExecutionEngine, appendNewLine: boolean): boolean {
        if (engine.state === ExecutionState.BlockedOnOutput) {
            if (!this.bufferHasValue()) {
                engine.state = ExecutionState.Running;
                return true;
            }
        } else {
            const value = new StringValue(engine.popEvaluationStack().toValueString());
            this.writeValueToBuffer(value, appendNewLine);
            engine.state = ExecutionState.BlockedOnOutput;
            this.producedOutput.publish();
        }

        return false;
    }

    private getColor(color: TextWindowColor): BaseValue {
        return new StringValue(TextWindowColor[color]);
    }

    private tryParseColorValue(value: BaseValue): TextWindowColor | undefined {
        switch (value.kind) {
            case ValueKind.Number: {
                const numberValue = (value as NumberValue).value;
                if (TextWindowColor[numberValue]) {
                    return numberValue;
                }
                break;
            }
            case ValueKind.String: {
                const stringValue = (value as StringValue).value.toLowerCase();
                for (let color in TextWindowColor) {
                    if (color.toLowerCase() === stringValue) {
                        return <any>TextWindowColor[color];
                    }
                }
                break;
            }
        }

        return undefined;
    }

    private setForegroundColor(value: BaseValue): void {
        this._foregroundValue = this.tryParseColorValue(value) || defaultForegroundColor;
        this.foregroundColorChanged.publish(this._foregroundValue);
    }

    private setBackgroundColor(value: BaseValue): void {
        this._backgroundValue = this.tryParseColorValue(value) || defaultBackgroundColor;
        this.backgroundColorChanged.publish(this._backgroundValue);
    }

    public get foreground(): TextWindowColor {
        return this._foregroundValue;
    }

    public get background(): TextWindowColor {
        return this._backgroundValue;
    }

    public bufferHasValue(): boolean {
        return !!this._buffer;
    }

    public writeValueToBuffer(value: BaseValue, appendNewLine: boolean): void {
        if (this._buffer) {
            throw new Error(`Existing value not read yet`);
        }

        this._buffer = {
            value: value,
            appendNewLine: appendNewLine
        };
    }

    public readValueFromBuffer(): BufferValue {
        if (!this._buffer) {
            throw new Error(`No value exists in buffer`);
        }

        const value = this._buffer;
        this._buffer = undefined;
        return value;
    }

    public readonly methods: { readonly [name: string]: LibraryMethodInstance } = {
        Read: { execute: engine => this.executeReadMethod(engine, ValueKind.String, ExecutionState.BlockedOnStringInput) },
        ReadNumber: { execute: engine => this.executeReadMethod(engine, ValueKind.Number, ExecutionState.BlockedOnNumberInput) },
        Write: { execute: engine => this.executeWriteMethod(engine, false) },
        WriteLine: { execute: engine => this.executeWriteMethod(engine, true) }
    };

    public readonly properties: { readonly [name: string]: LibraryPropertyInstance } = {
        ForegroundColor: { getter: () => this.getColor(this._foregroundValue), setter: this.setForegroundColor.bind(this) },
        BackgroundColor: { getter: () => this.getColor(this._backgroundValue), setter: this.setBackgroundColor.bind(this) }
    };

    public readonly events: { readonly [name: string]: LibraryEventInstance } = {};
}
