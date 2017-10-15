import * as React from "react";
import { Row, Col, Card, CardBlock, CardHeader } from "reactstrap";

export class Learn extends React.Component {
  public render(): JSX.Element {
    const lessons = [
      "Console",
      "2D Shapes",
      "Arrays",
      "Defining Subs",
      "Mathematics",
      "Writing Games"
    ];

    return (
      <div className="animated fadeIn">
        <Row>
          {lessons.map((value, index) =>
            <Col xs="12" sm="6" md="4" key={index}>
              <Card className="text-white bg-primary text-center">
                <CardHeader>
                  Lesson {index + 1}: {value}
                </CardHeader>
                <CardBlock className="card-body">
                  <blockquote className="card-bodyquote">
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
                  </blockquote>
                </CardBlock>
              </Card>
            </Col>
          )}
        </Row>
      </div>
    );
  }
}
