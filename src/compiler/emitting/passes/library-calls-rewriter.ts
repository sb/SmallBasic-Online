import { BaseInstruction, InstructionKind, MethodInvocationInstruction, PushNumberInstruction, StoreVariableInstruction, LoadVariableInstruction, LoadPropertyInstruction, SubtractInstruction, DuplicateInstruction, MultiplyInstruction, AddInstruction, EqualInstruction, TempConditionalJumpInstruction, DivideInstruction, GreaterThanOrEqualInstruction, TempLabelInstruction, LessThanOrEqualInstruction, DeleteVariableInstruction } from "../instructions";

export module LibraryCallsRewriter {
    type RewriterSignature = (invocation: MethodInvocationInstruction, counter: number) => BaseInstruction[];

    function rewrite_Turtle_TurnLeft(invocation: MethodInvocationInstruction, _: number): BaseInstruction[] {
        return [
            new PushNumberInstruction(-90, invocation.sourceRange),
            new MethodInvocationInstruction("Turtle", "Turn", invocation.sourceRange)
        ];
    }

    function rewrite_Turtle_TurnRight(invocation: MethodInvocationInstruction, _: number): BaseInstruction[] {
        return [
            new PushNumberInstruction(90, invocation.sourceRange),
            new MethodInvocationInstruction("Turtle", "Turn", invocation.sourceRange)
        ];
    }

    function rewrite_Turtle_MoveTo(invocation: MethodInvocationInstruction, counter: number): BaseInstruction[] {
        const generate = (name: string) => `<${counter}>_${name}`;

        const tempX = generate("x");
        const tempY = generate("y");
        const tempDistanceSquared = generate("distanceSquared");
        const tempDistance = generate("distance");
        const tempAngle = generate("angle");
        const tempTurnDelta = generate("turnDelta");

        const endLabel = generate("endLabel");
        const afterXCheckLabel = generate("afterXCheckLabel");
        const afterAngleCheckLabel = generate("afterAngleCheckLabel");

        /*
        Psuedo-code for Turtle.TurnTo(x, y) rewrite:
        {
            double distanceSquared = (x - Turtle.X) * (x - Turtle.X) + (y - Turtle.Y) * (y - Turtle.Y);
            if (distanceSquared != 0) goto endLabel;

            double distance = Math.SquareRoot(distanceSquared);
            double angle = Math.ArcCos((Turtle.Y - y) / distance) * 180 / Math.Pi;

            if (x >= Turtle.X) goto afterXCheckLabel;
            angle = 360 - angle;

        afterXCheckLabel:
            double turnDelta = angle - Math.Remainder(Turtle.Angle, 360);
            if (turnDelta <= 180) goto afterAngleCheckLabel;
            turnDelta = turnDelta - 360;

        afterAngleCheckLabel:
            Turtle.Turn(turnDelta);
            Turtle.Move(distance);

        endLabel:
            delete x;
            delete y;
            delete distanceSquared;
            delete distance;
            delete angle;
            delete turnDelta;
        }
        */

        return [
            // Store arguments to temps

            new StoreVariableInstruction(tempY, invocation.sourceRange),
            new StoreVariableInstruction(tempX, invocation.sourceRange),

            // double distanceSquared = (x - Turtle.X) * (x - Turtle.X) + (y - Turtle.Y) * (y - Turtle.Y);

            new LoadVariableInstruction(tempX, invocation.sourceRange),
            new LoadPropertyInstruction("Turtle", "X", invocation.sourceRange),
            new SubtractInstruction(invocation.sourceRange),
            new DuplicateInstruction(invocation.sourceRange),
            new MultiplyInstruction(invocation.sourceRange),

            new LoadVariableInstruction(tempY, invocation.sourceRange),
            new LoadPropertyInstruction("Turtle", "Y", invocation.sourceRange),
            new SubtractInstruction(invocation.sourceRange),
            new DuplicateInstruction(invocation.sourceRange),
            new MultiplyInstruction(invocation.sourceRange),

            new AddInstruction(invocation.sourceRange),
            new StoreVariableInstruction(tempDistanceSquared, invocation.sourceRange),

            // if (distanceSquared != 0) goto endLabel;

            new LoadVariableInstruction(tempDistanceSquared, invocation.sourceRange),
            new PushNumberInstruction(0, invocation.sourceRange),
            new EqualInstruction(invocation.sourceRange),
            new TempConditionalJumpInstruction(endLabel, undefined, invocation.sourceRange),

            // double distance = Math.SquareRoot(distanceSquared);

            new LoadVariableInstruction(tempDistanceSquared, invocation.sourceRange),
            new MethodInvocationInstruction("Math", "SquareRoot", invocation.sourceRange),
            new StoreVariableInstruction(tempDistance, invocation.sourceRange),

            // double angle = Math.ArcCos((Turtle.Y - y) / distance) * 180 / Math.Pi;

            new LoadPropertyInstruction("Turtle", "Y", invocation.sourceRange),
            new LoadVariableInstruction(tempY, invocation.sourceRange),
            new SubtractInstruction(invocation.sourceRange),
            new LoadVariableInstruction(tempDistance, invocation.sourceRange),
            new DivideInstruction(invocation.sourceRange),
            new MethodInvocationInstruction("Math", "ArcCos", invocation.sourceRange),
            new PushNumberInstruction(180, invocation.sourceRange),
            new MultiplyInstruction(invocation.sourceRange),
            new LoadPropertyInstruction("Math", "Pi", invocation.sourceRange),
            new DivideInstruction(invocation.sourceRange),
            new StoreVariableInstruction(tempAngle, invocation.sourceRange),

            // if (x >= Turtle.X) goto afterXCheckLabel;

            new LoadVariableInstruction(tempX, invocation.sourceRange),
            new LoadPropertyInstruction("Turtle", "X", invocation.sourceRange),
            new GreaterThanOrEqualInstruction(invocation.sourceRange),
            new TempConditionalJumpInstruction(afterXCheckLabel, undefined, invocation.sourceRange),

            // angle = 360 - angle;

            new PushNumberInstruction(360, invocation.sourceRange),
            new LoadVariableInstruction(tempAngle, invocation.sourceRange),
            new SubtractInstruction(invocation.sourceRange),
            new StoreVariableInstruction(tempAngle, invocation.sourceRange),

            // afterXCheckLabel:

            new TempLabelInstruction(afterXCheckLabel, invocation.sourceRange),

            // double turnDelta = angle - Math.Remainder(Turtle.Angle, 360);

            new LoadVariableInstruction(tempAngle, invocation.sourceRange),
            new LoadPropertyInstruction("Turtle", "Angle", invocation.sourceRange),
            new PushNumberInstruction(360, invocation.sourceRange),
            new MethodInvocationInstruction("Math", "Remainder", invocation.sourceRange),
            new SubtractInstruction(invocation.sourceRange),
            new StoreVariableInstruction(tempTurnDelta, invocation.sourceRange),

            // if (turnDelta <= 180) goto afterAngleCheckLabel;

            new LoadVariableInstruction(tempTurnDelta, invocation.sourceRange),
            new PushNumberInstruction(180, invocation.sourceRange),
            new LessThanOrEqualInstruction(invocation.sourceRange),
            new TempConditionalJumpInstruction(afterAngleCheckLabel, undefined, invocation.sourceRange),

            // turnDelta = turnDelta - 360;

            new LoadVariableInstruction(tempTurnDelta, invocation.sourceRange),
            new PushNumberInstruction(360, invocation.sourceRange),
            new SubtractInstruction(invocation.sourceRange),
            new StoreVariableInstruction(tempTurnDelta, invocation.sourceRange),

            // afterAngleCheckLabel:

            new TempLabelInstruction(afterAngleCheckLabel, invocation.sourceRange),

            // Turtle.Turn(turnDelta);

            new LoadVariableInstruction(tempTurnDelta, invocation.sourceRange),
            new MethodInvocationInstruction("Turtle", "Turn", invocation.sourceRange),

            // Turtle.Move(distance);

            new LoadVariableInstruction(tempDistance, invocation.sourceRange),
            new MethodInvocationInstruction("Turtle", "Move", invocation.sourceRange),

            // endLabel:

            new TempLabelInstruction(endLabel, invocation.sourceRange),

            // delete temps

            new DeleteVariableInstruction(tempX, invocation.sourceRange),
            new DeleteVariableInstruction(tempY, invocation.sourceRange),
            new DeleteVariableInstruction(tempDistanceSquared, invocation.sourceRange),
            new DeleteVariableInstruction(tempDistance, invocation.sourceRange),
            new DeleteVariableInstruction(tempAngle, invocation.sourceRange),
            new DeleteVariableInstruction(tempTurnDelta, invocation.sourceRange)
        ];
    }

    let map: { [key: string]: { [key: string]: RewriterSignature } } = {
        "Turtle": {
            "TurnLeft": rewrite_Turtle_TurnLeft,
            "TurnRight": rewrite_Turtle_TurnRight,
            "MoveTo": rewrite_Turtle_MoveTo
        }
    };

    export function rewrite(instructions: BaseInstruction[]): void {
        for (let i = 0; i < instructions.length; i++) {
            if (instructions[i].kind === InstructionKind.MethodInvocation) {
                const invocation = instructions[i] as MethodInvocationInstruction;
                if (map[invocation.library] && map[invocation.library][invocation.method]) {
                    const result = map[invocation.library][invocation.method](invocation, i);
                    instructions.splice(i, 1, ...result);
                    i += result.length - 1;
                }
            }
        }
    }
}
