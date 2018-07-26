import * as Konva from "konva";

// TODO:
// Need to factor strokewidth into the size of the shape to have 
// parity with the desktop version. Konva counts the stroke width separately.
// Ex: to achieve a total width of 20, radius is (20 - (2*2))/2 = 16/2 = 8 pix.
// Then 8 pix + 2 pix is 10 pix which is half the desired width.
export const strokeWidth: number = 2;

export enum ShapeKind {
    Ellipse,
    Line,
    Rectangle,
    Text,
    Triangle
}

let nameGenerationCounter: number = 0;

export abstract class BaseShape<TShape extends Konva.Shape> {

    public readonly name: string;

    public constructor(
        public readonly kind: ShapeKind,
        public readonly instance: TShape) {
        nameGenerationCounter++;

        this.name = ShapeKind[this.kind] + nameGenerationCounter.toString();
    }

    public abstract getLeft(): number;
    public abstract getTop(): number;
    public abstract move(x: number, y: number): void;

    public getOpacity(): number {
        return this.instance.opacity();
    }

    public setOpacity(opacity: number): void {
        this.instance.opacity(opacity);
    }

    public hideShape(): void {
        this.instance.hide();
    }

    public showShape(): void {
        this.instance.show();
    }

    public zoom(scaleX: number, scaleY: number): void {
        this.instance.scale({
            x: scaleX,
            y: scaleY
        });
    }

    public remove(): void {
        this.instance.destroy();
    }

    public rotate(degrees: number): void {
        this.instance.rotation(degrees);
    }

    public animate(x: number, y: number, durationInMilliseconds: number, layer: Konva.Layer): void {
        const self = this;
        const startX = this.getLeft();
        const startY = this.getTop();
        const xDistanceToMove = x - this.getLeft();
        const yDistanceToMove = y - this.getTop();

        const animation = new Konva.Animation((frame: any) => {
            const percentage = frame.time / durationInMilliseconds;
            const newX = startX + xDistanceToMove * percentage;
            const newY = startY + yDistanceToMove * percentage;

            self.move(newX, newY);
            if (frame.time >= durationInMilliseconds) {
                animation.stop();
                self.move(x, y);
            }
        }, layer);

        animation.start();
    }
}
