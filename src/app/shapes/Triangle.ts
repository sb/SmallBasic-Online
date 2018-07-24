import * as Konva from "konva"; 

let stage = new Konva.Stage({
      container: "container",
      width: window.innerWidth,
      height: window.innerHeight
});
    
const layer = new Konva.Layer();
stage.add(layer);

class Triangle {
    public instance: Konva.Shape;
    public left: number = 0;
    public top: number = 0;
  
    public constructor(x1:number, y1:number, x2:number, y2:number, x3:number, y3:number) {
        if(x1 < x2 && x1 < x3) {
            this.left = x1;
        }
        if(x2<x1 && x2 < x3) {
            this.left = x2;
        }
        if(x3<x1 && x3 < x1){
            this.left = x3;
        }
        if(y1 < y2 && y1 < y3) {
            this.top = y1;
        }
        if(y2 < y1 && y2 < y3) {
            this.top = y2;
        }
        if(y3 < y1 && y3 < y2) {
        this.top = y3;
        }
        this.instance = this.addTriangle(x1, y1, x2, y2, x3, y3);
    }
  
    public getLeft(): number{
        return this.left;
    }
   
    public getTop() : number{
        return this.top;
    }
   
    private addTriangle(x1:number, y1:number, x2:number, y2:number, x3:number, y3:number) : Konva.Shape {
        let triangle = new Konva.Shape({
            sceneFunc: function (context: Konva.Context) {
                context.beginPath();
                context.moveTo(x1, y1);
                context.lineTo(x2, y2);
                context.moveTo(x2, y2);
                context.lineTo(x3, y3);
                context.moveTo(x3, y3);
                context.lineTo(x1, y1);
                context.quadraticCurveTo(x1, y1, x2, y2);
                context.closePath();
            },
            fill: "slateblue",
            stroke: "black",
            strokeWidth: 2
        });
        return triangle;
    }
}

const tri1 = new Triangle(50, 50, 150, 150, 100, 180);
layer.add(tri1.instance);
console.log("left:" + tri1.getLeft());
console.log("top:" + tri1.getTop());

const tri2 = new Triangle(5, 80, 15, 150, 30, 180);
layer.add(tri2.instance);
console.log("left:" + tri2.getLeft());
console.log("top:" + tri2.getTop());

stage.draw();
