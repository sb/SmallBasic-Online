import { IShapesLibraryPlugin } from "../../../../compiler/runtime/libraries/shapes";
import { Shape } from "../../../shapes/Shape";
import { Rectangle } from "../../../shapes/Rectangle";
import { Ellipse } from "../../../shapes/Ellipse";
import { Triangle } from "../../../shapes/Triangle";
import { Line } from "../../../shapes/Line";
import { TextShape } from "../../../shapes/Text";

export class ShapesComponent implements IShapesLibraryPlugin {
    private nameGenerationCounter: number;
    private shapes: {[name: string] : Shape };

    public constructor(){
        this.nameGenerationCounter = 0;
        this.shapes = {};
    }

    private generateName(shapeType: string): string {
        this.nameGenerationCounter ++;
        return shapeType + this.nameGenerationCounter.toString();
    }

    public addRectangle(width: number, height: number): string {
        const name = this.generateName("Rectangle");
        const rect = new Rectangle(name, width, height);
        this.shapes[name] = rect;
        return name;
    }

    public addEllipse(width: number, height: number): string {
        const name = this.generateName("Ellipse");
        const ellipse = new Ellipse(name, width, height);
        this.shapes[name] = ellipse;
        return name;
    }

    public addTriangle(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): string {
        const name = this.generateName("Triangle");
        const tri = new Triangle(name, x1,y1,x2,y2,x3,y3);
        this.shapes[name] = tri;
        return name;
    }

    public addLine(x1: number, y1: number, x2: number, y2: number): string {
        const name = this.generateName("Line");
        const obj = new Line(name, x1, y1, x2, y2);
        this.shapes[name] = obj;
        return name;
    }
    
    public addImage(imageName: string): string {
        const name = this.generateName("Image");
        //TODO
        //const img = new Image(name, );
        //this.shapes[name] = img;
        return name;
    }

    public addText(text: string): string {
        const name = this.generateName("Text");
        const txt = new TextShape(name, text);
        this.shapes[name] = txt;
        return name;
    }

    public setText(shapeName: string, text: string): void {
        const shp = this.shapes[shapeName];
        if (shp !== undefined && shp instanceof TextShape) {
            shp.setText(text);
        }
    }

    public remove(shapeName: string): void {
        if(this.shapes[shapeName] !== undefined){
            return;
        }
        this.shapes[shapeName].remove();
        delete(this.shapes[shapeName]);
    }

    public move(shapeName: string, x: number, y: number): void {
        if(this.shapes[shapeName] !== undefined){
            return;
        }
        this.shapes[shapeName].move(x,y);
    }

    public rotate(shapeName: string, angle: number): void {
        if(this.shapes[shapeName] !== undefined){
            return;
        }
        this.shapes[shapeName].rotate(angle);
    }

    public zoom(shapeName: string, scaleX: number, scaleY: number): void {
        if(this.shapes[shapeName] !== undefined){
            return;
        }
        this.shapes[shapeName].zoom(scaleX, scaleY);
    }

    public animate(shapeName: string, x: number, y: number, duration: number): void {
        //TODO
        //this.shapes[shapeName].zoom(x, y, duration);
    }
    
    public getLeft(shapeName: string): number {
        if(this.shapes[shapeName] !== undefined){
            return -1;
        }
        return this.shapes[shapeName].getLeft();
    }
    
    public getTop(shapeName: string): number {
        if(this.shapes[shapeName] !== undefined){
            return -1;
        }
        return this.shapes[shapeName].getTop();
    }

    public getOpacity(shapeName: string): number {
        if(this.shapes[shapeName] !== undefined){
            return -1;
        }
        return this.shapes[shapeName].getOpacity() * 100;
    }

    public setOpacity(shapeName: string, level: number): void {
        if(this.shapes[shapeName] !== undefined){
            return;
        }
        if(level < 0) {
            level = 0;
        }
        else if (level > 100) {
            level = 100;
        }
        this.shapes[shapeName].setOpacity(level / 100);
    }

    public setVisibility(shapeName: string, isVisible: boolean): void {
        if(this.shapes[shapeName] !== undefined){
            return;
        }
        if(isVisible) {
            this.shapes[shapeName].showShape();
        }
        else {
            this.shapes[shapeName].hideShape();
        }
    }
}
