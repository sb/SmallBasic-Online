import * as React from "react";
import AceEditor from "react-ace";
import { Row, Col, Card, CardBlock, CardHeader, Form, FormGroup, InputGroup, InputGroupAddon, Input, Button } from "reactstrap";

const defaultContents: string =
`'Welcome to Small Basic!
'Below is a sample code to print 'Hello, World!' on the screen.
'Press Run for output.

TextWindow.WriteLine("Hello, World!")`;

export class Debug extends React.Component {
  public constructor(props: {}) {
    super(props);
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
                <AceEditor
                  mode="smallbasic"
                  name="code-editor-page-editor-id"
                  value={defaultContents}
                  editorProps={{ $blockScrolling: true }}
                />
              </CardBlock>
            </Card>
          </Col>
          <Col>
            <Card className="card-accent-info">
              <CardHeader>
                Debug Options
              </CardHeader>
              <CardBlock className="card-body">
                <div> <Button color="success" className="debug-button"><i className="fa fa-play"></i> Next Statement</Button></div>
                <div> <Button color="primary" className="debug-button"><i className="fa fa-sign-in"></i> Step into Sub</Button></div>
                <div> <Button color="primary" className="debug-button"><i className="fa fa-sign-out"></i> Step out of Sub</Button></div>
                <div> <Button color="success" className="debug-button"><i className="fa fa-step-forward"></i> Run to end</Button></div>
                <div> <Button color="danger" className="debug-button"><i className="fa fa-stop"></i> Stop</Button></div>
                </CardBlock>
            </Card>
            <Card className="card-accent-info">
              <CardHeader>
                Variables
            </CardHeader>
              <CardBlock className="card-body">
                <Form>
                  <FormGroup>
                    <InputGroup>
                      <InputGroupAddon >name</InputGroupAddon>
                      <Input type="text" value="John" onChange={() => { }} />
                    </InputGroup>
                  </FormGroup>
                  <FormGroup>
                    <InputGroup>
                      <InputGroupAddon >age</InputGroupAddon>
                      <Input type="text" value="19" onChange={() => { }} />
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
