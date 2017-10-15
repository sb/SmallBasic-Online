import * as React from "react";
import { Row, Col, Card, CardBlock, CardHeader, Form, FormGroup, InputGroup, InputGroupAddon, Input } from "reactstrap";
import { default as MonacoEditor } from "react-monaco-editor";

interface IState {
  code: string;
  options: monaco.editor.IEditorOptions;
}

const defaultContents: string = `
'Welcome to Small Basic!
'Below is a sample code to print 'Hello, World!' on the screen.
'Press Run for output.
TextWindow.WriteLine("Hello, World!")`;

export class Debug extends React.Component<{}, IState> {
  public constructor(props: {}) {
    super(props);
    this.updateDimensions = this.updateDimensions.bind(this);

    this.state = {
      code: defaultContents,
      options: {
        selectOnLineNumbers: true,
        readOnly: true
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
          <Col className="col-12 col-xl-9 col-lg-9">
            <Card className="card-accent-info">
              <CardHeader>
                Code
              </CardHeader>
              <CardBlock className="card-body">
                <MonacoEditor language="sb" width="100%" height="400" value={this.state.code} options={this.state.options} ref="monaco" />
              </CardBlock>
            </Card>
          </Col>
          <Col>
            <Card className="card-accent-info">
              <CardHeader>
                Variables
            </CardHeader>
            <CardBlock className="card-body">
              <Form>
              <FormGroup>
              <InputGroup>
                <InputGroupAddon >name</InputGroupAddon>
                <Input type="text" value="John" onChange={() => {}} />
              </InputGroup>
              </FormGroup>
                <FormGroup>
                <InputGroup>
                  <InputGroupAddon >age</InputGroupAddon>
                  <Input type="text" value="19" onChange={() => {}} />
                </InputGroup>
                </FormGroup>
              </Form>
            </CardBlock>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card className="card-accent-success">
              <CardHeader>
                Output
            </CardHeader>
              <CardBlock className="card-body">
                <div className="text-output">
                  <span>Hello, World!</span>
                </div>
              </CardBlock>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}
