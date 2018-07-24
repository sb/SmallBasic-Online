import * as Konva from "konva";
import { Shape } from "./Shape";

export class Text extends Shape {

  private static DEFAULT_TEXT_SIZE: number = 16;
  private static DEFAULT_FONT_FAMILY: string = "calibri";
  
  public constructor(name: string, text: string) {
    super(name);
    this.instance = this.createKonvaText(text);
  }
  
  public getLeft(): number {
    return this.instance.x();
  }
  
  public getTop(): number {
    return this.instance.y();
  }
  
  private createKonvaText(text: string): Konva.Text {
    return new Konva.Text({
        x: 0,
        y: 0,
        text: text,
        fontSize: Text.DEFAULT_TEXT_SIZE,
        fontFamily: Text.DEFAULT_FONT_FAMILY,
        fill: "slateblue"
    });
  }
}
