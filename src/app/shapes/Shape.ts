import * as Konva from "konva";

export abstract class Shape {
    public instance: Konva.Shape;
    public name: string;
      
    // abstract methods
    public abstract getLeft(): number;
    public abstract getTop(): number;
    public abstract move(x: number, y: number): void;

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
    
    public rotate(degrees: number): void {
        this.instance.rotation(degrees);
    }
}
