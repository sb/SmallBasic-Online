import * as React from "react";
import { Row, Col, Card, CardBlock, CardHeader } from "reactstrap";

export class Run extends React.Component {
  public render(): JSX.Element {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <Card className="card-accent-success">
              <CardHeader>
                Output
              </CardHeader>
              <CardBlock className="card-body">
                <div className="text-output text-output-big">
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
