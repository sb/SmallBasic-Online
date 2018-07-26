import * as Konva from "konva";
import { BaseShape, ShapeKind } from "./base-shape";

export class TextShape extends BaseShape<Konva.Text> {
    public constructor(text: string) {
        super(ShapeKind.Text, new Konva.Text({
            x: 0,
            y: 0,
            text: text,
            fontSize: 16,
            fontFamily: "calibri",
            fill: "slateblue"
        }));
    }

    public setText(text: string): void {
        this.instance.text(text);
    }

    public move(x: number, y: number): void {
        this.instance.x(x);
        this.instance.y(y);
    }

    public getLeft(): number {
        return this.instance.x();
    }

    public getTop(): number {
        return this.instance.y();
    }
}
