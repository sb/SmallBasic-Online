import { ValueKind } from "../values/base-value";
import { LibraryMethodInstance, LibraryTypeInstance, LibraryPropertyInstance, LibraryEventInstance } from "../libraries";
import { ExecutionEngine } from "../../execution-engine";
import { NumberValue } from "../values/number-value";
import { StringValue } from "../values/string-value";

// TODO: add tests

export interface IShapesLibraryPlugin {
    addRectangle(width: number, height: number): string;
    addEllipse(width: number, height: number): string;
    addTriangle(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): string;
    addLine(x1: number, y1: number, x2: number, y2: number): string;
    addImage(imageName: string): string;
    addText(text: string): string;
    setText(shapeName: string, text: string): void;
    remove(shapeName: string): void;
    move(shapeName: string, x: number, y: number): void;
    rotate(shapeName: string, angle: number): void;
    zoom(shapeName: string, scaleX: number, scaleY: number): void;
    animate(shapeName: string, x: number, y: number, duration: number): void;
    getLeft(shapeName: string): number;
    getTop(shapeName: string): number;
    getOpacity(shapeName: string): number;
    setOpacity(shapeName: string, level: number): void;
    setVisibility(shapeName: string, isVisible: boolean): void;
}

export class ShapesLibrary implements LibraryTypeInstance {
    private _pluginInstance: IShapesLibraryPlugin | undefined;

    public get plugin(): IShapesLibraryPlugin {
        if (!this._pluginInstance) {
            throw new Error("Plugin is not set.");
        }

        return this._pluginInstance;
    }

    public set plugin(plugin: IShapesLibraryPlugin) {
        this._pluginInstance = plugin;
    }

    private executeAddRectangle(engine: ExecutionEngine): boolean {
        const heightArg = engine.popEvaluationStack().tryConvertToNumber();
        const widthArg = engine.popEvaluationStack().tryConvertToNumber();

        const widthValue = widthArg.kind === ValueKind.Number ? (widthArg as NumberValue).value : 0;
        const heightValue = heightArg.kind === ValueKind.Number ? (heightArg as NumberValue).value : 0;

        const rectangleName = this.plugin.addRectangle(widthValue, heightValue);
        engine.pushEvaluationStack(new StringValue(rectangleName));

        return true;
    }

    private executeAddEllipse(engine: ExecutionEngine): boolean {
        const heightArg = engine.popEvaluationStack().tryConvertToNumber();
        const widthArg = engine.popEvaluationStack().tryConvertToNumber();

        const widthValue = widthArg.kind === ValueKind.Number ? (widthArg as NumberValue).value : 0;
        const heightValue = heightArg.kind === ValueKind.Number ? (heightArg as NumberValue).value : 0;

        const rectangleName = this.plugin.addEllipse(widthValue, heightValue);
        engine.pushEvaluationStack(new StringValue(rectangleName));

        return true;
    }

    private executeAddTriangle(engine: ExecutionEngine): boolean {
        const y3Arg = engine.popEvaluationStack().tryConvertToNumber();
        const x3Arg = engine.popEvaluationStack().tryConvertToNumber();
        const y2Arg = engine.popEvaluationStack().tryConvertToNumber();
        const x2Arg = engine.popEvaluationStack().tryConvertToNumber();
        const y1Arg = engine.popEvaluationStack().tryConvertToNumber();
        const x1Arg = engine.popEvaluationStack().tryConvertToNumber();

        const x1Value = x1Arg.kind === ValueKind.Number ? (x1Arg as NumberValue).value : 0;
        const y1Value = y1Arg.kind === ValueKind.Number ? (y1Arg as NumberValue).value : 0;
        const x2Value = x2Arg.kind === ValueKind.Number ? (x2Arg as NumberValue).value : 0;
        const y2Value = y2Arg.kind === ValueKind.Number ? (y2Arg as NumberValue).value : 0;
        const x3Value = x3Arg.kind === ValueKind.Number ? (x3Arg as NumberValue).value : 0;
        const y3Value = y3Arg.kind === ValueKind.Number ? (y3Arg as NumberValue).value : 0;

        const triangleName = this.plugin.addTriangle(x1Value, y1Value, x2Value, y2Value, x3Value, y3Value);
        engine.pushEvaluationStack(new StringValue(triangleName));

        return true;
    }

    private executeAddLine(engine: ExecutionEngine): boolean {
        const y2Arg = engine.popEvaluationStack().tryConvertToNumber();
        const x2Arg = engine.popEvaluationStack().tryConvertToNumber();
        const y1Arg = engine.popEvaluationStack().tryConvertToNumber();
        const x1Arg = engine.popEvaluationStack().tryConvertToNumber();

        const x1Value = x1Arg.kind === ValueKind.Number ? (x1Arg as NumberValue).value : 0;
        const y1Value = y1Arg.kind === ValueKind.Number ? (y1Arg as NumberValue).value : 0;
        const x2Value = x2Arg.kind === ValueKind.Number ? (x2Arg as NumberValue).value : 0;
        const y2Value = y2Arg.kind === ValueKind.Number ? (y2Arg as NumberValue).value : 0;

        const triangleName = this.plugin.addLine(x1Value, y1Value, x2Value, y2Value);
        engine.pushEvaluationStack(new StringValue(triangleName));

        return true;
    }

    private executeAddText(engine: ExecutionEngine): boolean {
        const text = engine.popEvaluationStack().toValueString();
        const shapeName = this.plugin.addText(text);

        engine.pushEvaluationStack(new StringValue(shapeName));
        return true;
    }

    private executeSetText(engine: ExecutionEngine): boolean {
        const text = engine.popEvaluationStack().toValueString();
        const shapeName = engine.popEvaluationStack().toValueString();

        this.plugin.setText(shapeName, text);
        return true;
    }

    private executeRemove(engine: ExecutionEngine): boolean {
        const shapeName = engine.popEvaluationStack().toValueString();

        this.plugin.remove(shapeName);
        return true;
    }

    private executeMove(engine: ExecutionEngine): boolean {
        const yArg = engine.popEvaluationStack().tryConvertToNumber();
        const xArg = engine.popEvaluationStack().tryConvertToNumber();

        const shapeName = engine.popEvaluationStack().toValueString();
        const xValue = xArg.kind === ValueKind.Number ? (xArg as NumberValue).value : 0;
        const yValue = yArg.kind === ValueKind.Number ? (yArg as NumberValue).value : 0;

        this.plugin.move(shapeName, xValue, yValue);
        return true;
    }

    private executeRotate(engine: ExecutionEngine): boolean {
        const angleArg = engine.popEvaluationStack().tryConvertToNumber();

        const shapeName = engine.popEvaluationStack().toValueString();
        const angleValue = angleArg.kind === ValueKind.Number ? (angleArg as NumberValue).value : 0;

        this.plugin.rotate(shapeName, angleValue);
        return true;
    }

    private executeZoom(engine: ExecutionEngine): boolean {
        const scaleYArg = engine.popEvaluationStack().tryConvertToNumber();
        const scaleXArg = engine.popEvaluationStack().tryConvertToNumber();

        const shapeName = engine.popEvaluationStack().toValueString();
        const scaleX = scaleXArg.kind === ValueKind.Number ? (scaleXArg as NumberValue).value : 0;
        const scaleY = scaleYArg.kind === ValueKind.Number ? (scaleYArg as NumberValue).value : 0;

        this.plugin.zoom(shapeName, scaleX, scaleY);
        return true;
    }

    private executeAnimate(engine: ExecutionEngine): boolean {
        const durationArg = engine.popEvaluationStack().tryConvertToNumber();
        const yArg = engine.popEvaluationStack().tryConvertToNumber();
        const xArg = engine.popEvaluationStack().tryConvertToNumber();

        const shapeName = engine.popEvaluationStack().toValueString();
        const xValue = xArg.kind === ValueKind.Number ? (xArg as NumberValue).value : 0;
        const yValue = yArg.kind === ValueKind.Number ? (yArg as NumberValue).value : 0;
        const durationValue = durationArg.kind === ValueKind.Number ? (durationArg as NumberValue).value : 0;

        this.plugin.animate(shapeName, xValue, yValue, durationValue);
        return true;
    }

    private executeGetLeft(engine: ExecutionEngine): boolean {
        const shapeName = engine.popEvaluationStack().toValueString();
        const leftValue = this.plugin.getLeft(shapeName);

        engine.pushEvaluationStack(new NumberValue(leftValue));
        return true;
    }

    private executeGetTop(engine: ExecutionEngine): boolean {
        const shapeName = engine.popEvaluationStack().toValueString();
        const topValue = this.plugin.getTop(shapeName);

        engine.pushEvaluationStack(new NumberValue(topValue));
        return true;
    }

    private executeGetOpacity(engine: ExecutionEngine): boolean {
        const shapeName = engine.popEvaluationStack().toValueString();
        const opacityValue = this.plugin.getOpacity(shapeName);

        engine.pushEvaluationStack(new NumberValue(opacityValue));
        return true;
    }

    private executeSetOpacity(engine: ExecutionEngine): boolean {
        const levelArg = engine.popEvaluationStack().tryConvertToNumber();

        const shapeName = engine.popEvaluationStack().toValueString();
        const levelValue = levelArg.kind === ValueKind.Number ? (levelArg as NumberValue).value : 0;

        this.plugin.setOpacity(shapeName, levelValue);
        return true;
    }

    private executeSetVisibility(engine: ExecutionEngine, isVisible: boolean): boolean {
        const shapeName = engine.popEvaluationStack().toValueString();
        this.plugin.setVisibility(shapeName, isVisible);
        return true;
    }

    // TODO: implement missing method

    public readonly methods: { readonly [name: string]: LibraryMethodInstance } = {
        AddRectangle: { execute: this.executeAddRectangle.bind(this) },
        AddEllipse: { execute: this.executeAddEllipse.bind(this) },
        AddTriangle: { execute: this.executeAddTriangle.bind(this) },
        AddLine: { execute: this.executeAddLine.bind(this) },
        AddImage: { execute: () => { throw new Error("Not Implemented yet."); } },
        AddText: { execute: this.executeAddText.bind(this) },
        SetText: { execute: this.executeSetText.bind(this) },
        Remove: { execute: this.executeRemove.bind(this) },
        Move: { execute: this.executeMove.bind(this) },
        Rotate: { execute: this.executeRotate.bind(this) },
        Zoom: { execute: this.executeZoom.bind(this) },
        Animate: { execute: this.executeAnimate.bind(this) },
        GetLeft: { execute: this.executeGetLeft.bind(this) },
        GetTop: { execute: this.executeGetTop.bind(this) },
        GetOpacity: { execute: this.executeGetOpacity.bind(this) },
        SetOpacity: { execute: this.executeSetOpacity.bind(this) },
        HideShape: { execute: engine => this.executeSetVisibility(engine, false) },
        ShowShape: { execute: engine => this.executeSetVisibility(engine, true) }
    };

    public readonly properties: { readonly [name: string]: LibraryPropertyInstance } = {};

    public readonly events: { readonly [name: string]: LibraryEventInstance } = {};
}
