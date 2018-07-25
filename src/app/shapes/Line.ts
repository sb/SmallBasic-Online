import * as Konva from "konva";
import { Shape } from "./Shape";

export class Line extends Shape {

  private strokeWidth: number = 2;
  private static DEFAULT_COLOR: string = "black";

  public constructor(name: string, x1: number, y1: number, x2: number, y2: number) {
    super(name);

    this.instance = this.createKonvaLine(x1, y1, x2, y2);
  }
  
  public getLeft(): number {
    return this.instance.x();
  }
  
  public getTop(): number {
    return this.instance.y();
  }
  
  private createKonvaLine(x1: number, y1: number, x2: number, y2: number): Konva.Line {
    const leftShift = Math.min(x1, x2);
    const topShift = Math.min(y1, y2);
    
    return new Konva.Line({
      points: [ x1 - leftShift, y1 - topShift, x2 - leftShift, y2 - topShift ],
      x: leftShift,
      y: topShift,
      stroke: Line.DEFAULT_COLOR,
      strokeWidth: this.strokeWidth
    });
  }
}
