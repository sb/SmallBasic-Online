import { IShapesLibraryPlugin } from "../../../../compiler/runtime/libraries/shapes";
import { Shape } from "../../../shapes/Shape";
import { Rectangle } from "../../../shapes/Rectangle";
import { Ellipse } from "../../../shapes/Ellipse";
import { Triangle } from "../../../shapes/Triangle";
import { Line } from "../../../shapes/Line";
import { TextShape } from "../../../shapes/Text";

export class ShapesComponent /*extends React.Component<Props, State>*/ implements IShapesLibraryPlugin {
    private nameGenerationCounter: number;
    private shapes: {[name: string] : Shape };

    public constructor(){
        this.nameGenerationCounter = 0;
        this.shapes = {};
    }

    private generateName(shapeType: string): string {
        this.nameGenerationCounter ++;
        return shapeType + this.nameGenerationCounter.toString;
    }

    public addRectangle(width: number, height: number): string {
        const name = this.generateName("Rectangle");
        let obj = new Rectangle(name, width, height);
        this.shapes[name] = obj;
        return name;
    }

    public addEllipse(width: number, height: number): string {
        const name = this.generateName("Ellipse");
        let obj = new Ellipse(name, width, height);
        this.shapes[name] = obj;
        return name;
    }

    public addTriangle(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): string {
        const name = this.generateName("Triangle");
        let obj = new Triangle(name, x1,y1,x2,y2,x3,y3);
        this.shapes[name] = obj;
        return name;
    }

    public addLine(x1: number, y1: number, x2: number, y2: number): string {
        const name = this.generateName("Line");
        let obj = new Line(name, x1, y1, x2, y2);
        this.shapes[name] = obj;
        return name;
    }
    
    public addImage(imageName: string): string {
        const name = this.generateName("Image");
        //TODO
        //let obj = new Image(name, );
        //this.shapes[name] = obj;
        return name;
    }

    public addText(text: string): string {
        const name = this.generateName("Text");
        let obj = new TextShape(name, text);
        this.shapes[name] = obj;
        return name;
    }

    public setText(shapeName: string, text: string): void {
        let obj = this.shapes[shapeName];
        if (obj instanceof TextShape) {
            obj.setText(text);
        }
    }

    public remove(shapeName: string): void {
        this.shapes[shapeName].remove();
    }

    public move(shapeName: string, x: number, y: number): void {
        this.shapes[shapeName].move(x,y);
    }

    public rotate(shapeName: string, angle: number): void {
        this.shapes[shapeName].rotate(angle);
    }

    public zoom(shapeName: string, scaleX: number, scaleY: number): void {
        //TODO
        //this.shapes[shapeName].zoom(scaleX, scaleY);
    }

    public animate(shapeName: string, x: number, y: number, duration: number): void {
        //TODO
        //this.shapes[shapeName].zoom(x, y, duration);
    }
    
    public getLeft(shapeName: string): number {
        return this.shapes[shapeName].getLeft();
    }
    
    public getTop(shapeName: string): number {
        return this.shapes[shapeName].getTop();
    }

    public getOpacity(shapeName: string): number {
        return this.shapes[shapeName].getOpacity();
    }

    public setOpacity(shapeName: string, level: number): void {
        this.shapes[shapeName].setOpacity(level);
    }

    public setVisibility(shapeName: string, isVisible: boolean): void {
        if(isVisible) {
            this.shapes[shapeName].showShape();
        }
        else {
            this.shapes[shapeName].hideShape();
        }
    }
}
