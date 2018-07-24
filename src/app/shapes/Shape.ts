abstract class Shape {
  public instance: Konva.Shape;
  public name: string;
  
  // abstract methods
  abstract getLeft(): number;
  abstract getTop(): number;
  abstract getOpacity(): number;
  
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
  
  public rotate(angle: number): void {
		shape.rotation(angle);
  }
}
