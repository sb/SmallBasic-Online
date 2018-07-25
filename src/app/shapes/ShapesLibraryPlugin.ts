import { IShapesLibraryPlugin } from "../../compiler/runtime/libraries/shapes";
import { Shape } from "./Shape";
import { Rectangle } from "./Rectangle";
import { Ellipse } from "./Ellipse";
import { Triangle } from "./Triangle";
import { Line } from "./Line";
import { TextShape } from "./TextShape";

export class ShapesLibraryPlugin implements IShapesLibraryPlugin {
    private nameGenerationCounter: number;
    private shapes: {[name: string] : Shape };

    private addToScreenFunction: (shape: Shape) => void;
    private updateScreenFunction: () => void;

    public constructor(addToScreenFunction: (shape: Shape) => void, updateScreenFunction: () => void) {
        this.nameGenerationCounter = 0;
        this.shapes = {};
        this.addToScreenFunction = addToScreenFunction;
        this.updateScreenFunction = updateScreenFunction;
    }

    private generateName(shapeType: string): string {
        this.nameGenerationCounter++;
        return shapeType + this.nameGenerationCounter.toString();
    }

    private addShape(shapeType: string, shapeProvider: (name: string) => Shape): string {
        const name = this.generateName(shapeType);
        const shape = shapeProvider(name);
        this.shapes[name] = shape;

        this.addToScreenFunction(shape);
        this.updateScreenFunction();

        return name;
    }

    public addRectangle(width: number, height: number): string {
        return this.addShape("Rectangle", (name) => new Rectangle(name, width, height));
    }

    public addEllipse(width: number, height: number): string {
        return this.addShape("Ellipse", (name) => new Ellipse(name, width, height));
    }

    public addTriangle(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): string {
        return this.addShape("Triangle", (name) => new Triangle(name, x1, y1, x2, y2, x3, y3));
    }

    public addLine(x1: number, y1: number, x2: number, y2: number): string {
        return this.addShape("Line", (name) => new Line(name, x1, y1, x2, y2));
    }
    
    public addImage(imageName: string): string {
        const name = this.generateName("Image");
        //TODO
        //return this.addShape("Image", (name) => new Image(name, ...))
        return name;
    }

    public addText(text: string): string {
        return this.addShape("Text", (name) => new TextShape(name, text));
    }

    public setText(shapeName: string, text: string): void {
        const shape = this.shapes[shapeName];
        if (shape !== undefined && shape instanceof TextShape) {
            shape.setText(text);
            this.updateScreenFunction();
        }
    }

    public remove(shapeName: string): void {
        if(this.shapes[shapeName] === undefined){
            return;
        }
        this.shapes[shapeName].remove();
        delete(this.shapes[shapeName]);

        this.updateScreenFunction();
    }

    public move(shapeName: string, x: number, y: number): void {
        if(this.shapes[shapeName] === undefined) {
            return;
        }
        this.shapes[shapeName].move(x,y);

        this.updateScreenFunction();
    }

    public rotate(shapeName: string, angle: number): void {
        if(this.shapes[shapeName] === undefined) {
            return;
        }
        this.shapes[shapeName].rotate(angle);

        this.updateScreenFunction();
    }

    public zoom(shapeName: string, scaleX: number, scaleY: number): void {
        if(this.shapes[shapeName] === undefined) {
            return;
        }
        this.shapes[shapeName].zoom(scaleX, scaleY);

        this.updateScreenFunction();
    }

    public animate(shapeName: string, x: number, y: number, duration: number): void {
        //TODO
        //this.shapes[shapeName].zoom(x, y, duration);
    }
    
    public getLeft(shapeName: string): number {
        if(this.shapes[shapeName] === undefined) {
            return 0;
        }
        return this.shapes[shapeName].getLeft();
    }
    
    public getTop(shapeName: string): number {
        if(this.shapes[shapeName] === undefined) {
            return 0;
        }
        return this.shapes[shapeName].getTop();
    }

    public getOpacity(shapeName: string): number {
        if(this.shapes[shapeName] === undefined) {
            return 0;
        }
        return this.shapes[shapeName].getOpacity() * 100;
    }

    public setOpacity(shapeName: string, level: number): void {
        if(this.shapes[shapeName] === undefined) {
            return;
        }
        if(level < 0) {
            level = 0;
        }
        else if (level > 100) {
            level = 100;
        }
        this.shapes[shapeName].setOpacity(level / 100);

        this.updateScreenFunction();
    }

    public setVisibility(shapeName: string, isVisible: boolean): void {
        if(this.shapes[shapeName] === undefined) {
            return;
        }

        if(isVisible) {
            this.shapes[shapeName].showShape();
        }
        else {
            this.shapes[shapeName].hideShape();
        }

        this.updateScreenFunction();
    }
}
