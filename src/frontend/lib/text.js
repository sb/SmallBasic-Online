function addText(layer, stage, t) {
	var text = new Konva.Text({
    x: 0,
    y: 20,
    text: t,
    fontSize: 30,
    fontFamily: 'Calibri',
    fill: 'blue'
	});
  
  layer.add(text);
}
