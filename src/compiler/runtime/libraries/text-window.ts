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

    checkInputLines(): BaseValue | undefined;
    clearOutput(): void;
    writeText(value: string, appendNewLine: boolean): void;

    checkInputBuffer(): string;
    clearInputBuffer(): void;
    
    setVisibility(isVisible: boolean): void;
    getIsVisible(): boolean;

    getForegroundColor(): TextWindowColor;
    setForegroundColor(color: TextWindowColor): void;
    getBackgroundColor(): TextWindowColor;
    setBackgroundColor(color: TextWindowColor): void;
    getTitle(): string;
    setTitle(title: string): void;
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

    private executeReadMethod(engine: ExecutionEngine, kind: ValueKind): void {
        const bufferValue = this.plugin.checkInputLines();

        if (bufferValue) {
            if (bufferValue.kind !== kind) {
                throw new Error(`Expecting input kind '${ValueKind[kind]}' but buffer has kind '${ValueKind[bufferValue.kind]}'`);
            }

            engine.pushEvaluationStack(bufferValue);
            engine.state = ExecutionState.Running;
        } else {
            engine.state = ExecutionState.BlockedOnInput;
            this.plugin.inputIsNeeded(kind);
        }
    }

    private executeWriteMethod(engine: ExecutionEngine, appendNewLine: boolean): void {
        const value = engine.popEvaluationStack().toValueString();
        this.plugin.writeText(value, appendNewLine);
    }

    private executeClearMethod(): void {
        this.plugin.clearOutput();
    }

    private executeSetVisibility(isVisible: boolean): void {
        this.plugin.setVisibility(isVisible);
    }

    private executePauseIfVisible(engine: ExecutionEngine): void {
        if (this.plugin.getIsVisible()) {
            this.executePause(engine);
        }
    }

    private executePause(engine: ExecutionEngine): void {
        // Only write the "Press any key" text the first time we cycle through
        if (engine.state === ExecutionState.Running) {
            this.plugin.writeText("Press any key to continue...", true);
        }
        this.executePauseWithoutMessage(engine);
    }

    private executePauseWithoutMessage(engine: ExecutionEngine): void {
        this.plugin.inputIsNeeded(ValueKind.String);
        const bufferValue = this.plugin.checkInputBuffer();
        
        if (bufferValue) {
            engine.state = ExecutionState.Running;
            this.plugin.clearInputBuffer();
        } else {
            engine.state = ExecutionState.BlockedOnInput;
        }
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

    private getTitle(): BaseValue {
        return new StringValue(this.plugin.getTitle());
    }

    private setTitle(title: BaseValue): void {
        switch (title.kind) {
            case ValueKind.String:
            case ValueKind.Number:
                this.plugin.setTitle(title.toValueString());
                break;
            default: 
                return;
        }
        
    }

    private getForegroundColor(): BaseValue {
        return new StringValue(TextWindowColor[this.plugin.getForegroundColor()]);
    }

    private getBackgroundColor(): BaseValue {
        return new StringValue(TextWindowColor[this.plugin.getBackgroundColor()]);
    }

    public readonly methods: { readonly [name: string]: LibraryMethodInstance } = {
        Clear: { execute: () => this.executeClearMethod() },
        Hide: { execute: () => this.executeSetVisibility(false) },
        Read: { execute: engine => this.executeReadMethod(engine, ValueKind.String) },
        ReadNumber: { execute: engine => this.executeReadMethod(engine, ValueKind.Number) },
        Write: { execute: engine => this.executeWriteMethod(engine, false) },
        WriteLine: { execute: engine => this.executeWriteMethod(engine, true) },
        Pause: { execute: engine => this.executePause(engine) },
        PauseIfVisible: { execute: engine => this.executePauseIfVisible(engine) },
        PauseWithoutMessage: { execute: engine => this.executePauseWithoutMessage(engine) },
        Show: { execute: () =>  this.executeSetVisibility(true) }
    };

    public readonly properties: { readonly [name: string]: LibraryPropertyInstance } = {
        ForegroundColor: { getter: this.getForegroundColor.bind(this), setter: this.setForegroundColor.bind(this) },
        BackgroundColor: { getter: this.getBackgroundColor.bind(this), setter: this.setBackgroundColor.bind(this) },
        Title: { getter: this.getTitle.bind(this), setter: this.setTitle.bind(this) }
    };

    public readonly events: { readonly [name: string]: LibraryEventInstance } = {};
}
