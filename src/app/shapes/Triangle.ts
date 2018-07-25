import * as Konva from "konva"; 
import { Shape } from "./Shape";

export class Triangle extends Shape {
    public instance: Konva.Line;
  
    public constructor(name:string, x1:number, y1:number, x2:number, y2:number, x3:number, y3:number) {
        super(name);
        this.instance = this.addTriangle(x1, y1, x2, y2, x3, y3);
    }
  
    public getLeft(): number{
        return this.instance.x() + Math.min(this.instance.points()[0], this.instance.points()[2], this.instance.points()[4]);
    }
   
    public getTop() : number{
        return this.instance.y() + Math.min(this.instance.points()[1], this.instance.points()[3], this.instance.points()[5]);
    }

    public move(x: number, y: number): void {
        this.instance.x(x);
        this.instance.y(y);
    }
   
    private addTriangle(x1:number, y1:number, x2:number, y2:number, x3:number, y3:number) : Konva.Line {
        const triangle = new Konva.Line({
            points: [x1, y1, x2, y2, x3, y3],
            fill: "slateblue",
            stroke: "black",
            strokeWidth: 2,
            closed : true
          });
        return triangle;
    }
}
