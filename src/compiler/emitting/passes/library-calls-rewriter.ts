import { BoundNodeRewriter, BaseBoundNode, BoundLibraryMethodInvocationStatement, SyntheticBoundNodeFactory } from "../../binding/bound-nodes";

export class LibraryCallsRewriter extends BoundNodeRewriter {
    public rewriteLibraryMethodInvocationStatement(node: BoundLibraryMethodInvocationStatement): BaseBoundNode {
        switch (node.libraryName) {
            case "Turtle": {
                switch (node.methodName) {
                    case "TurnLeft": return this.rewrite_Turtle_TurnLeft(node);
                    case "TurnRight": return this.rewrite_Turtle_TurnRight(node);
                    case "MoveTo": return this.rewrite_Turtle_MoveTo(node);
                }
                break;
            }
        }

        return node;
    }

    private rewrite_Turtle_TurnLeft(node: BoundLibraryMethodInvocationStatement): BaseBoundNode {
        // Rewrite to: Turtle.Turn(-90)

        const f = new SyntheticBoundNodeFactory(node.syntax);
        return f.callStatement("Turtle", "Turn", f.number(-90));
    }

    private rewrite_Turtle_TurnRight(node: BoundLibraryMethodInvocationStatement): BaseBoundNode {
        // Rewrite to: Turtle.Turn(90)

        const f = new SyntheticBoundNodeFactory(node.syntax);
        return f.callStatement("Turtle", "Turn", f.number(90));
    }

    private rewrite_Turtle_MoveTo(node: BoundLibraryMethodInvocationStatement): BaseBoundNode {
        /*
        Psuedo-code for Turtle.TurnTo(x, y):
        {
            var distanceSquared = (x - Turtle.X) * (x - Turtle.X) + (y - Turtle.Y) * (y - Turtle.Y);
            if (distanceSquared != 0)
            {
                var distance = Math.SquareRoot(distanceSquared);
                var angle = Math.ArcCos((Turtle.Y - y) / distance) * 180 / Math.Pi;

                if (x < Turtle.X) { angle = 360 - angle; }

                var turnDelta = angle - Math.Remainder(Angle, 360);
                if (turnDelta > 180) { turnDelta = turnDelta - 360; }

                Turtle.Turn(turnDelta);
                Turtle.Move(distance);
            }
        }*/

        const f = new SyntheticBoundNodeFactory(node.syntax);

        const x = node.argumentsList[0];
        const y = node.argumentsList[1];

        const turtleX = f.property("Turtle", "X");
        const turtleY = f.property("Turtle", "Y");
        const turtleAngle = f.property("Turtle", "Angle");

        const angle = f.variable("Turtle.MoveTo.angle");
        const distance = f.variable("Turtle.MoveTo.distance");
        const turnDelta = f.variable("Turtle.MoveTo.turnDelta");
        const distanceSquared = f.variable("Turtle.MoveTo.distanceSquared");

        return f.block(
            // var distanceSquared = (x - Turtle.X) * (x - Turtle.X) + (y - Turtle.Y) * (y - Turtle.Y);
            f.assignVariable(
                distanceSquared.variableName,
                f.add(f.multiply(f.subtract(x, turtleX), f.subtract(x, turtleX)), f.multiply(f.subtract(y, turtleY), f.subtract(y, turtleY)))),

            // if (distanceSquared != 0)
            f.if(f.notEqual(distanceSquared, f.number(0)), f.block(
                // var distance = Math.SquareRoot(distanceSquared);
                f.assignVariable(distance.variableName, f.callExpr("Math", "SquareRoot", distanceSquared)),
                // var angle = Math.ArcCos((Turtle.Y - y) / distance) * 180 / Math.Pi;
                f.assignVariable(angle.variableName, f.divide(
                    f.multiply(f.callExpr("Math", "ArcCos", f.divide(f.subtract(turtleY, y), distance)), f.number(180)),
                    f.property("Math", "Pi"))),

                // if (x < Turtle.X) { angle = 360 - angle; }
                f.if(f.lessThan(x, turtleX), f.block(f.assignVariable(angle.variableName, f.subtract(f.number(360), angle)))),

                // var turnDelta = angle - Math.Remainder(Angle, 360);
                f.assignVariable(turnDelta.variableName, f.subtract(angle, f.callExpr("Math", "Remainder", turtleAngle, f.number(360)))),
                // if (turnDelta > 180) { turnDelta = turnDelta - 360; }
                f.if(f.greaterThan(turnDelta, f.number(180)), f.block(f.assignVariable(turnDelta.variableName, f.subtract(turnDelta, f.number(360))))),

                // Turtle.Turn(turnDelta);
                f.callStatement("Turtle", "Turn", turnDelta),
                // Turtle.Move(distance);
                f.callStatement("Turtle", "Move", distance)
            )));
    }
}
