import * as React from "react";
import AceEditor from "react-ace";
import { Row, Col, Card, CardBlock, CardHeader } from "reactstrap";

const defaultContents: string =
`"Welcome to Small Basic!
"Below is a sample code to print "Hello, World!" on the screen.
"Press Run for output.

TextWindow.WriteLine("Hello, World!")`;

export class CodeEditor extends React.Component {
  public constructor(props: {}) {
    super(props);
  }

  public render(): JSX.Element {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <Card className="card-accent-info">
              <CardHeader>
                Code
              </CardHeader>
              <CardBlock className="card-body">
                <AceEditor
                  mode="smallbasic"
                  name="code-editor-page-editor-id"
                  value= {defaultContents}
                  editorProps={{ $blockScrolling: true }}
                />
              </CardBlock>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}
