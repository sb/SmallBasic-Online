import { ValueKind, BaseValue } from "../values/base-value";
import { LibraryMethodInstance, LibraryTypeInstance, LibraryPropertyInstance, LibraryEventInstance } from "../libraries";
import { ExecutionEngine } from "../../execution-engine";
import { NumberValue } from "../values/number-value";
import { StringValue } from "../values/string-value";

interface ControlsLibraryPlugin {
    addButton(caption: string, left: number, top: number): string;
    getButtonCaption(buttonName: string): string;
    setButtonCaption(buttonName: string, caption: string): void;

    addTextBox(left: number, top: number, isMultiLine: boolean): string;
    getTextBoxText(textBoxName: string): string;
    setTextBoxText(textBoxName: string, text: string): void;

    remove(controlName: string): void;
    move(controlName: string, x: number, y: number): void;
    setSize(controlName: string, width: number, height: number): void;
    setVisibility(controlName: string, isVisible: boolean): void;

    getLastClickedButton(): string;
    getLastTypedTextBox(): string;
}

export class ControlsLibrary implements LibraryTypeInstance {
    private _pluginInstance: ControlsLibraryPlugin | undefined;

    public get plugin(): ControlsLibraryPlugin {
        if (!this._pluginInstance) {
            throw new Error("Plugin is not set.");
        }

        return this._pluginInstance;
    }

    public set plugin(plugin: ControlsLibraryPlugin) {
        this._pluginInstance = plugin;
    }

    private executeAddButton(engine: ExecutionEngine): boolean {
        const top = engine.popEvaluationStack().tryConvertToNumber();
        const left = engine.popEvaluationStack().tryConvertToNumber();

        const caption = engine.popEvaluationStack().toValueString();
        const topValue = top.kind === ValueKind.Number ? (top as NumberValue).value : 0;
        const leftValue = left.kind === ValueKind.Number ? (left as NumberValue).value : 0;

        const buttonName = this.plugin.addButton(caption, leftValue, topValue);

        engine.pushEvaluationStack(new StringValue(buttonName));
        return true;
    }

    private executeGetButtonCaption(engine: ExecutionEngine): boolean {
        const buttonName = engine.popEvaluationStack().toValueString();
        const caption = this.plugin.getButtonCaption(buttonName);

        engine.pushEvaluationStack(new StringValue(caption));
        return true;
    }

    private executeSetButtonCaption(engine: ExecutionEngine): boolean {
        const caption = engine.popEvaluationStack().toValueString();
        const buttonName = engine.popEvaluationStack().toValueString();

        this.plugin.setButtonCaption(buttonName, caption);
        return true;
    }

    private executeAddTextBox(engine: ExecutionEngine, isMultiLine: boolean): boolean {
        const top = engine.popEvaluationStack().tryConvertToNumber();
        const left = engine.popEvaluationStack().tryConvertToNumber();

        const topValue = top.kind === ValueKind.Number ? (top as NumberValue).value : 0;
        const leftValue = left.kind === ValueKind.Number ? (left as NumberValue).value : 0;

        const textBoxName = this.plugin.addTextBox(leftValue, topValue, isMultiLine);

        engine.pushEvaluationStack(new StringValue(textBoxName));
        return true;
    }

    private executeGetTextBoxText(engine: ExecutionEngine): boolean {
        const textBoxName = engine.popEvaluationStack().toValueString();
        const text = this.plugin.getTextBoxText(textBoxName);

        engine.pushEvaluationStack(new StringValue(text));
        return true;
    }

    private executeSetTextBoxText(engine: ExecutionEngine): boolean {
        const text = engine.popEvaluationStack().toValueString();
        const textBoxName = engine.popEvaluationStack().toValueString();

        this.plugin.setTextBoxText(textBoxName, text);
        return true;
    }

    private executeRemove(engine: ExecutionEngine): boolean {
        const controlName = engine.popEvaluationStack().toValueString();

        this.plugin.remove(controlName);
        return true;
    }

    private executeMove(engine: ExecutionEngine): boolean {
        const yArg = engine.popEvaluationStack().tryConvertToNumber();
        const xArg = engine.popEvaluationStack().tryConvertToNumber();

        const controlName = engine.popEvaluationStack().toValueString();
        const xValue = xArg.kind === ValueKind.Number ? (xArg as NumberValue).value : 0;
        const yValue = yArg.kind === ValueKind.Number ? (yArg as NumberValue).value : 0;

        this.plugin.move(controlName, xValue, yValue);
        return true;
    }

    private executeSetSize(engine: ExecutionEngine): boolean {
        const heightArg = engine.popEvaluationStack().tryConvertToNumber();
        const widthArg = engine.popEvaluationStack().tryConvertToNumber();

        const controlName = engine.popEvaluationStack().toValueString();
        const widthValue = widthArg.kind === ValueKind.Number ? (widthArg as NumberValue).value : 0;
        const heightValue = heightArg.kind === ValueKind.Number ? (heightArg as NumberValue).value : 0;

        this.plugin.setSize(controlName, widthValue, heightValue);
        return true;
    }

    private executeSetVisibility(engine: ExecutionEngine, isVisible: boolean): boolean {
        const controlName = engine.popEvaluationStack().toValueString();

        this.plugin.setVisibility(controlName, isVisible);
        return true;
    }

    private getLastClickedButton(): BaseValue {
        return new StringValue(this.plugin.getLastClickedButton());
    }

    private getLastTypedTextBox(): BaseValue {
        return new StringValue(this.plugin.getLastTypedTextBox());
    }

    public readonly methods: { readonly [name: string]: LibraryMethodInstance } = {
        AddButton: { execute: this.executeAddButton.bind(this) },
        GetButtonCaption: { execute: this.executeGetButtonCaption.bind(this) },
        SetButtonCaption: { execute: this.executeSetButtonCaption.bind(this) },
        AddTextBox: { execute: engine => this.executeAddTextBox(engine, false) },
        AddMultiLineTextBox: { execute: engine => this.executeAddTextBox(engine, true) },
        GetTextBoxText: { execute: this.executeGetTextBoxText.bind(this) },
        SetTextBoxText: { execute: this.executeSetTextBoxText.bind(this) },
        Remove: { execute: this.executeRemove.bind(this) },
        Move: { execute: this.executeMove.bind(this) },
        SetSize: { execute: this.executeSetSize.bind(this) },
        ShowControl: { execute: engine => this.executeSetVisibility(engine, true) },
        HideControl: { execute: engine => this.executeSetVisibility(engine, false) }
    };

    public readonly properties: { readonly [name: string]: LibraryPropertyInstance } = {
        LastClickedButton: { getter: this.getLastClickedButton.bind(this) },
        LastTypedTextBox: { getter: this.getLastTypedTextBox.bind(this) }
    };

    // TODO: implement these events
    public readonly events: { readonly [name: string]: LibraryEventInstance } = {
        ButtonClicked: {
            raise: () => { throw new Error("Not Implemented Yet"); },
            setSubModule: () => { throw new Error("Not Implemented Yet"); }
        },
        TextTyped: {
            raise: () => { throw new Error("Not Implemented Yet"); },
            setSubModule: () => { throw new Error("Not Implemented Yet"); }
        }
    };
}
