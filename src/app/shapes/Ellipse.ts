import shape = module('Shape')

const wwidth = window.innerWidth;
const wheight = window.innerHeight - 25;

// first we need Konva core things: stage and layer
const stage = new Konva.Stage({
  container: 'container',
  width: wwidth,
  height: wheight
});


const layer = new Konva.Layer();
stage.add(layer);

const strokeWidth = 2;

class Ellipse extends Shape{
	
  public instance: Konva.Ellipse;
  
  public constructor(width: number, height: number) {
        this.instance = this.createKonvaEllipse(width, height);
	}

  
  public getLeft(): number {
  	return this.instance.x - this.instance.radius.x;
  }
  
  public getTop(): number {
  	return this.instance.y - this.instance.radius.y;
  }
  
  private createKonvaEllipse(width: number, height: number): Konva.Ellipse {
  	return new Konva.Ellipse({
        x: (width - (2*strokeWidth) )/ 2 + strokeWidth,
        y: (height - (2*strokeWidth) ) / 2 + strokeWidth,
        radius: {
            x: (width - (2*strokeWidth) ) / 2,
            y: (height - (2*strokeWidth) ) / 2
        },
        fill: 'Slateblue',
        stroke: 'black',
        strokeWidth: strokeWidth
    });
  }
}

const ellipse = new Ellipse(30,50);
layer.add(ellipse.instance);
ellipse.rotate(45)
stage.draw();