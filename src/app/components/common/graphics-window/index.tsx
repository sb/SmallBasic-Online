import * as React from "react";
import * as Konva from "konva";
import { ExecutionEngine } from "../../../../compiler/execution-engine";
import { ShapesLibraryPlugin } from "../../../shapes/ShapesLibraryPlugin";

import "./style.css";

interface GraphicsWindowComponentProps {
  engine: ExecutionEngine;
}

interface GraphicsWindowComponentState {
  stage?: Konva.Stage;
  layer?: Konva.Layer;
}

export class GraphicsWindowComponent extends React.Component<GraphicsWindowComponentProps, GraphicsWindowComponentState> {

  public constructor(props: GraphicsWindowComponentProps) {
    super(props);

    this.state = {};
  }

  public componentDidMount(): void {
    const stage = new Konva.Stage({
      container: "graphics-container",
      width: document.getElementById("graphics-container")!.offsetWidth,
      height: document.getElementById("graphics-container")!.offsetHeight
    });
    const layer = new Konva.Layer();
    stage.add(layer);

    this.setState({
      ...this.state,
      stage: stage,
      layer: layer
    });

    const plugin = new ShapesLibraryPlugin(layer, stage);
    this.props.engine.libraries.Shapes.plugin = plugin;
  }

  public render(): JSX.Element {
      return (
        <div className="graphics-window">
          <div id="graphics-container"></div>
        </div>
      );
  }

}
