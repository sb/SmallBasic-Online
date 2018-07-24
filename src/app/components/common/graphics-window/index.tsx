import * as React from "react";
import * as Konva from "konva";

import "./style.css";

interface GraphicsWindowComponentProps {

}

interface GraphicsWindowComponentState {
  stage?: Konva.Stage;
  layer?: Konva.Layer;
}

export class GraphicsWindowComponent extends React.Component<GraphicsWindowComponentProps, GraphicsWindowComponentState> {
  private isAlreadyMounted: boolean;
  private tokens: string[] = [];

  public constructor(props: GraphicsWindowComponentProps) {
    super(props);
    this.isAlreadyMounted = false;

    this.state = {};
  }

  public componentDidMount(): void {
    this.tokens = [];

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

    this.isAlreadyMounted = true;
  }

  public componentWillUnmount(): void {
    this.tokens.forEach(PubSub.unsubscribe);
    this.isAlreadyMounted = false;
  }

  public render(): JSX.Element {
      return (
        <div className="graphics-window">
          <div id="graphics-container"></div>
        </div>
      );
  }

}
