import * as Konva from "konva";
import { BaseShape, strokeWidth, ShapeKind } from "./base-shape";

export class EllipseShape extends BaseShape<Konva.Ellipse> {
    public constructor(width: number, height: number) {
        super(ShapeKind.Ellipse, new Konva.Ellipse({
            x: width / 2,
            y: height / 2,
            radius: {
                x: (width - (2 * strokeWidth)) / 2,
                y: (height - (2 * strokeWidth)) / 2
            },
            fill: "slateblue",
            stroke: "black",
            strokeWidth: strokeWidth
        }));
    }

    public getLeft(): number {
        return this.instance.x() - this.instance.radiusX();
    }

    public getTop(): number {
        return this.instance.y() - this.instance.radiusY();
    }

    public move(x: number, y: number): void {
        this.instance.y(y + this.instance.radiusY());
        this.instance.x(x + this.instance.radiusX());
    }
}
