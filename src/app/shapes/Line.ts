import * as Konva from "konva";
import { Shape } from "./Shape";

export class Line extends Shape {

  private strokeWidth: number = 2;
  private static DEFAULT_COLOR: string = "black";

  private x1: number;
  private y1: number;
  private x2: number;
  private y2: number;
  
  public constructor(name: string, x1: number, y1: number, x2: number, y2: number) {
    super(name);

    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;

    this.instance = this.createKonvaLine(x1, y1, x2, y2);
  }
  
  public getLeft(): number {
    return Math.min(this.x1, this.x2);
  }
  
  public getTop(): number {
    return Math.min(this.y1, this.y2);
  }
  
  private createKonvaLine(x1: number, y1: number, x2: number, y2: number): Konva.Line {
    return new Konva.Line({
      points: [ x1, y1, x2, y2 ],
      stroke: Line.DEFAULT_COLOR,
      strokeWidth: this.strokeWidth
    });
  }
}
