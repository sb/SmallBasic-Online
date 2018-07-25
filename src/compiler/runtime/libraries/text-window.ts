import { LibraryTypeInstance, LibraryMethodInstance, LibraryPropertyInstance, LibraryEventInstance } from "../libraries";
import { ValueKind, BaseValue } from "../values/base-value";
import { StringValue } from "../values/string-value";
import { NumberValue } from "../values/number-value";
import { ExecutionState, ExecutionEngine } from "../../execution-engine";

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

export interface ITextWindowLibraryPlugin {
    inputIsNeeded(kind: ValueKind): void;

    checkInputBuffer(): BaseValue | undefined;
    writeText(value: string, appendNewLine: boolean): void;

    getForegroundColor(): TextWindowColor;
    setForegroundColor(color: TextWindowColor): void;
    getBackgroundColor(): TextWindowColor;
    setBackgroundColor(color: TextWindowColor): void;
}

export class TextWindowLibrary implements LibraryTypeInstance {
    private _pluginInstance: ITextWindowLibraryPlugin | undefined;

    public get plugin(): ITextWindowLibraryPlugin {
        if (!this._pluginInstance) {
            throw new Error("Plugin is not set.");
        }

        return this._pluginInstance;
    }

    public set plugin(plugin: ITextWindowLibraryPlugin) {
        this._pluginInstance = plugin;
    }

    // TODO: if we can get rid of this state, we can remove the return bool from all executioners (instructions and libraries)

    private executeReadMethod(engine: ExecutionEngine, kind: ValueKind): boolean {
        const bufferValue = this.plugin.checkInputBuffer();
        if (bufferValue) {
            if (bufferValue.kind !== kind) {
                throw new Error(`Expecting input kind '${ValueKind[kind]}' but buffer has kind '${ValueKind[bufferValue.kind]}'`);
            }

            engine.pushEvaluationStack(bufferValue);
            engine.state = ExecutionState.Running;
            return true;
        } else {
            engine.state = ExecutionState.BlockedOnInput;
            this.plugin.inputIsNeeded(kind);
            return false;
        }
    }

    private executeWriteMethod(engine: ExecutionEngine, appendNewLine: boolean): boolean {
        const value = engine.popEvaluationStack().toValueString();
        this.plugin.writeText(value, appendNewLine);
        return true;
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
        const color = this.tryParseColorValue(value);
        if (color) {
            this.plugin.setForegroundColor(color);
        }
    }

    private setBackgroundColor(value: BaseValue): void {
        const color = this.tryParseColorValue(value);
        if (color) {
            this.plugin.setBackgroundColor(color);
        }
    }

    private getForegroundColor(): BaseValue {
        return new StringValue(TextWindowColor[this.plugin.getForegroundColor()]);
    }

    private getBackgroundColor(): BaseValue {
        return new StringValue(TextWindowColor[this.plugin.getBackgroundColor()]);
    }

    public readonly methods: { readonly [name: string]: LibraryMethodInstance } = {
        Read: { execute: engine => this.executeReadMethod(engine, ValueKind.String) },
        ReadNumber: { execute: engine => this.executeReadMethod(engine, ValueKind.Number) },
        Write: { execute: engine => this.executeWriteMethod(engine, false) },
        WriteLine: { execute: engine => this.executeWriteMethod(engine, true) }
    };

    public readonly properties: { readonly [name: string]: LibraryPropertyInstance } = {
        ForegroundColor: { getter: this.getForegroundColor.bind(this), setter: this.setForegroundColor.bind(this) },
        BackgroundColor: { getter: this.getBackgroundColor.bind(this), setter: this.setBackgroundColor.bind(this) }
    };

    public readonly events: { readonly [name: string]: LibraryEventInstance } = {};
}
