import * as Konva from "konva";
import { BaseShape, strokeWidth, ShapeKind } from "./base-shape";

export class LineShape extends BaseShape<Konva.Line> {
    public constructor(x1: number, y1: number, x2: number, y2: number) {
        const leftShift = Math.min(x1, x2);
        const topShift = Math.min(y1, y2);

        super(ShapeKind.Line, new Konva.Line({
            points: [x1 - leftShift, y1 - topShift, x2 - leftShift, y2 - topShift],
            x: leftShift,
            y: topShift,
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
