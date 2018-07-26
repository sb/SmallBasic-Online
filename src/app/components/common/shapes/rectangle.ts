import * as Konva from "konva";
import { BaseShape, strokeWidth, ShapeKind } from "./base-shape";

export class RectangleShape extends BaseShape<Konva.Rect> {
    public constructor(width: number, height: number) {
        super(ShapeKind.Rectangle, new Konva.Rect({
            x: 0,
            y: 0,
            width: width - (2 * strokeWidth),
            height: height - (2 * strokeWidth),
            fill: "slateBlue",
            stroke: "black",
            strokeWidth: strokeWidth
        }));
    }

    public getLeft(): number {
        return this.instance.x();
    }

    public getTop(): number {
        return this.instance.y();
    }

    public move(x: number, y: number): void {
        this.instance.x(x);
        this.instance.y(y);
    }
}
