abstract class Shape {
	public instance: Konva.Shape;
    public name: string;
      
    // abstract methods
    abstract getLeft(): number;
    abstract getTop(): number;

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
    // TODO
    }
    
    public move(): void {
    // TODO
    }
    
    public rotate(): void {
    // TODO
    }
}