import * as Konva from "konva";
import {Shape} from "./Shape";

export class Ellipse extends Shape{

  public instance: Konva.Ellipse;
  
  public constructor(name: string, width: number, height: number) {
        super(name);
        this.instance = this.createKonvaEllipse(width, height);
  }

  public getLeft(): number {
    return this.instance.x() - this.instance.radius().x();
  }
  
  public getTop(): number {
    return this.instance.y() - this.instance.radius().y();
  }
  
  private createKonvaEllipse(width: number, height: number): Konva.Ellipse {
      const strokeWidth = 2;
    return new Konva.Ellipse({
        x: (width - (2*strokeWidth) )/ 2 + strokeWidth,
        y: (height - (2*strokeWidth) ) / 2 + strokeWidth,
        radius: {
            x: (width - (2*strokeWidth) ) / 2,
            y: (height - (2*strokeWidth) ) / 2
        },
        fill: "Slateblue",
        stroke: "black",
        strokeWidth: strokeWidth
    });
  }
}
