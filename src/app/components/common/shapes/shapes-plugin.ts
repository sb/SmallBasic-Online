import * as Konva from "konva";
import { BaseShape, ShapeKind } from "./base-shape";
import { RectangleShape } from "./rectangle";
import { EllipseShape } from "./ellipse";
import { TriangleShape } from "./triangle";
import { LineShape } from "./line";
import { TextShape } from "./text";
import { IShapesLibraryPlugin } from "../../../../compiler/runtime/libraries/shapes";

export class ShapesLibraryPlugin implements IShapesLibraryPlugin {
    private readonly shapes: { [name: string]: BaseShape<Konva.Shape> } = {};

    public constructor(
        private readonly layer: Konva.Layer,
        private readonly stage: Konva.Stage) {
    }

    public addRectangle(width: number, height: number): string {
        return this.addShape(new RectangleShape(width, height));
    }

    public addEllipse(width: number, height: number): string {
        return this.addShape(new EllipseShape(width, height));
    }

    public addTriangle(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): string {
        return this.addShape(new TriangleShape(x1, y1, x2, y2, x3, y3));
    }

    public addLine(x1: number, y1: number, x2: number, y2: number): string {
        return this.addShape(new LineShape(x1, y1, x2, y2));
    }

    public addImage(): string {
        throw new Error("TODO: Not Implemented Yet");
    }

    public addText(text: string): string {
        return this.addShape(new TextShape(text));
    }

    public setText(shapeName: string, text: string): void {
        const shape = this.shapes[shapeName];
        if (shape && shape.kind === ShapeKind.Text) {
            (shape as TextShape).setText(text);
            this.stage.draw();
        }
    }

    public remove(shapeName: string): void {
        const shape = this.shapes[shapeName];
        if (shape) {
            shape.remove();
            delete (this.shapes[shapeName]);
            this.stage.draw();
        }
    }

    public move(shapeName: string, x: number, y: number): void {
        const shape = this.shapes[shapeName];
        if (shape) {
            shape.move(x, y);
            this.stage.draw();
        }
    }

    public rotate(shapeName: string, angle: number): void {
        const shape = this.shapes[shapeName];
        if (shape) {
            shape.rotate(angle);
            this.stage.draw();
        }
    }

    public zoom(shapeName: string, scaleX: number, scaleY: number): void {
        const shape = this.shapes[shapeName];
        if (shape) {
            shape.zoom(scaleX, scaleY);
            this.stage.draw();
        }
    }

    public animate(shapeName: string, x: number, y: number, duration: number): void {
        const shape = this.shapes[shapeName];
        if (shape) {
            shape.animate(x, y, duration, this.layer);
            this.stage.draw();
        }
    }

    public getLeft(shapeName: string): number {
        const shape = this.shapes[shapeName];
        if (shape) {
            return shape.getLeft();
        }

        return 0;
    }

    public getTop(shapeName: string): number {
        const shape = this.shapes[shapeName];
        if (shape) {
            return shape.getTop();
        }

        return 0;
    }

    public getOpacity(shapeName: string): number {
        const shape = this.shapes[shapeName];
        if (shape) {
            return this.shapes[shapeName].getOpacity() * 100;
        }

        return 0;
    }

    public setOpacity(shapeName: string, level: number): void {
        const shape = this.shapes[shapeName];
        if (shape) {
            if (level < 0) {
                level = 0;
            }
            else if (level > 100) {
                level = 100;
            }

            shape.setOpacity(level / 100);
            this.stage.draw();
        }
    }

    public setVisibility(shapeName: string, isVisible: boolean): void {
        const shape = this.shapes[shapeName];
        if (shape) {
            if (isVisible) {
                shape.showShape();
            }
            else {
                shape.hideShape();
            }

            this.stage.draw();
        }
    }

    private addShape(shape: BaseShape<Konva.Shape>): string {
        this.shapes[shape.name] = shape;
        this.layer.add(shape.instance);
        this.stage.draw();

        return shape.name;
    }
}
