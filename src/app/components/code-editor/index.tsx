import * as React from "react";
import { default as MonacoEditor } from "react-monaco-editor";
import { Row, Col, Card, CardBlock } from "reactstrap";

interface IState {
  code: string;
  options: monaco.editor.IEditorOptions;
}

export class CodeEditor extends React.Component<{}, IState> {
  public constructor(props: {}) {
    super(props);
    this.updateDimensions = this.updateDimensions.bind(this);

    this.state = {
      code: "Hello!",
      options: {
        selectOnLineNumbers: true
      }
    };
  }

  public componentDidMount(): void {
    window.addEventListener("resize", this.updateDimensions);
  }

  public componentWillUnmount(): void {
    window.removeEventListener("resize", this.updateDimensions);
  }

  private updateDimensions(): void {
    const editor: monaco.editor.IEditor = (this.refs.monaco as any).editor;
    editor.layout();
  }

  public render(): JSX.Element {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <Card>
              <CardBlock className="card-body">
                <MonacoEditor language="sb" width="100%" height="600" value={this.state.code} options={this.state.options} ref="monaco" />
              </CardBlock>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}
