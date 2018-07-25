import * as Konva from "konva";

export abstract class Shape {
    public instance: Konva.Shape = new Konva.Shape({});
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

    public setOpacity(opacity: number): void {
        this.instance.opacity(opacity);
    }

    public hideShape(): void {
        this.instance.hide();
    }
    
    public showShape(): void {
        this.instance.show();
    }

    public zoom(scaleX: number, scaleY: number): void {
        this.instance.scale({x: scaleX, y: scaleY});
    }
    
    public remove(): void {
        this.instance.destroy();
    }
    
    public rotate(degrees: number): void {
        this.instance.rotation(degrees);
    }

    public animate(x: number, y: number, durationInMilliseconds: number, layer: Konva.Layer): void{
        const self: Shape = this;
        const startX: number = this.getLeft();
        const startY: number = this.getTop();
        const xDistanceToMove: number = x - this.getLeft();
        const yDistanceToMove: number = y - this.getTop();
        const animation: Konva.Animation = new Konva.Animation((frame: any) =>{
            const percentage: number = frame.time /durationInMilliseconds;
            const newX: number = startX + xDistanceToMove * percentage;
            const newY: number = startY + yDistanceToMove * percentage;
            self.move(newX, newY);
            if(frame.time >= durationInMilliseconds){
                animation.stop();
                self.move(x, y);
            }
        }, layer);
        animation.start();
    }
}
