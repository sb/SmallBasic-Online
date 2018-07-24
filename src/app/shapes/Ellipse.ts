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
  
  //Need to factor strokewidth into the size of the shape to have 
  //parity with the desktop version. Konva counts the stroke width separately.
  //Ex: to achieve a total width of 20, radius is (20 - (2*2))/2 = 16/2 = 8 pix.
  //    Then 8 pix + 2 pix is 10 pix which is half the desired width.
  private createKonvaEllipse(width: number, height: number): Konva.Ellipse {
      const strokeWidth = 2;
    return new Konva.Ellipse({
        x: width / 2,
        y: height / 2,
        radius: {
            x: (width - (2*strokeWidth) ) / 2,
            y: (height - (2*strokeWidth) ) / 2
        },
        fill: "slateblue",
        stroke: "black",
        strokeWidth: strokeWidth
    });
  }
}
