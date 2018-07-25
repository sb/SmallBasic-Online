import * as Konva from "konva"; 
import { Shape } from "./Shape";

export class Triangle extends Shape {
    public instance: Konva.Line;
  
    public constructor(name:string, x1:number, y1:number, x2:number, y2:number, x3:number, y3:number) {
        super(name);
        this.instance = this.addTriangle(x1, y1, x2, y2, x3, y3);
    }
  
    public getLeft(): number{
        return this.instance.x();
    }
   
    public getTop() : number{
        return this.instance.y();
    }

    public move(x: number, y: number): void {
        this.instance.x(x);
        this.instance.y(y);
    }
   
    private addTriangle(x1:number, y1:number, x2:number, y2:number, x3:number, y3:number) : Konva.Line {
        const leftShift = Math.min(x1, x2, x3);
        const topShift = Math.min(y1, y2, y3);
        const triangle = new Konva.Line({
            points: [x1 - leftShift, y1 - topShift, x2 - leftShift, y2 - topShift, x3 - leftShift, y3 - topShift],
            x: leftShift,
            y: topShift,
            fill: "slateblue",
            stroke: "black",
            strokeWidth: 2,
            closed : true
          });
        return triangle;
    }
}
