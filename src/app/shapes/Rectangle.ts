import * as Konva from "konva";
import { Shape } from "./Shape";

export class Rectangle extends Shape {
    private width: number = 0;
    private height: number = 0;

    private strokeWidth: number = 2;

    public constructor(name: string, width: number, height: number){
        super(name);
        this.width = width;
        this.height = height;
        this.instance = this.createKonvaRectangle(width, height);
    }
  
    public getLeft(): number {
      return this.instance.x();
    }
  
    public getTop(): number {
      return this.instance.y();
    }
  
    private createKonvaRectangle(width: number, height: number): Konva.Rect {
        const rect = new Konva.Rect({
            x: 0,
            y: 0,
            width: width - (2 * this.strokeWidth),
            height: height - (2 * this.strokeWidth),
            fill: "slateBlue",
            stroke: "black",
            strokeWidth: this.strokeWidth
            });
        return rect;
    }
}
