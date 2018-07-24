import * as Konva from "konva";

export abstract class Shape {
    public instance: Konva.Shape;
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
    
    public remove(): void {
        this.instance.destroy();
    }
    
    public move(x: number, y: number): void {
        this.instance.x(x);
        this.instance.x(y);
    }
    
    public rotate(degrees: number): void {
        this.instance.rotation(degrees);
    }
}
