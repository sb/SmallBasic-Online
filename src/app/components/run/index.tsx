import * as React from "react";
import { Row, Col, Card, CardBlock } from "reactstrap";

export class Run extends React.Component {
  public render(): JSX.Element {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <Card>
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
