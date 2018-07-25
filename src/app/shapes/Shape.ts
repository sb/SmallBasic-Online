import * as Konva from "konva";

export abstract class Shape {
    public instance: Konva.Shape = new Konva.Shape({});
    public name: string;
      
    // abstract methods
    public abstract getLeft(): number;
    public abstract getTop(): number;

    public constructor(name: string){
        this.name = name;
    }

    public getOpacity(): number {
        return this.instance.opacity();
    }

    public hideShape(): void {
        this.instance.hide();
    }
    
    public showShape(): void {
        this.instance.show();
    }

    public zoom(x: number, y: number): void {
        this.instance.scale({x: x, y: y});
    }
    
    public remove(): void {
        // TODO
    }
    
    public move(): void {
        // TODO
    }
    
    public rotate(): void {
        // TODO
    }
}
