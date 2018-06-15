import "jasmine";
import * as PubSub from "pubsub-js";
import { Compilation } from "../../../../src/compiler/compilation";
import { ExecutionEngine, ExecutionMode, ExecutionState } from "../../../../src/compiler/execution-engine";

function testTurtleLines(callback: DoneFn, text: string, expectedOutput: string): void {
    const compilation = new Compilation(text);
    const engine = new ExecutionEngine(compilation);

    let actualOutput = "";
    const token = engine.libraries.Turtle.drawLine.subscribe(line => {
        actualOutput += `\nx1: ${line.x1}, y1: ${line.y1}, x2: ${line.x2}, y2: ${line.y2}`;
    });

    engine.execute(ExecutionMode.RunToEnd);

    setTimeout(() => {
        PubSub.unsubscribe(token);

        expect(engine.state).toBe(ExecutionState.Terminated);
        expect(engine.exception).toBeUndefined();

        expect(expectedOutput).toBe(actualOutput);
        callback();
    }, 0);
}

describe("Compiler.Runtime.Libraries.Turtle", () => {
    it("starts with the turtle visible", () => {
        const compilation = new Compilation(`
Turtle.Hide()`);

        const engine = new ExecutionEngine(compilation);
        expect(engine.libraries.Turtle.isVisible).toBe(true);
    });

    it("can show and hide the turtle", () => {
        const compilation = new Compilation(`
Turtle.Hide()
Program.Pause()
Turtle.Show()`);

        const engine = new ExecutionEngine(compilation);
        expect(engine.libraries.Turtle.isVisible).toBe(true);
        expect(engine.state).toBe(ExecutionState.Running);

        engine.execute(ExecutionMode.Debug);
        expect(engine.libraries.Turtle.isVisible).toBe(false);
        expect(engine.state).toBe(ExecutionState.Paused);

        engine.execute(ExecutionMode.Debug);
        expect(engine.libraries.Turtle.isVisible).toBe(true);
        expect(engine.state).toBe(ExecutionState.Terminated);
        expect(engine.exception).toBeUndefined();
    });

    it("does not draw when pen is up", callback => {
        testTurtleLines(callback, `
Turtle.Speed = 10

Turtle.Move(10)
Turtle.Turn(90)
Turtle.Move(10)

Turtle.PenUp()

Turtle.Move(10)
Turtle.Turn(90)
Turtle.Move(10)`, `
x1: 250, y1: 250, x2: 250, y2: 240
x1: 250, y1: 240, x2: 260, y2: 240`);
    });

    it("MoveTo() is lowered correctly", callback => {
        testTurtleLines(callback, `
Turtle.Speed = 10

Turtle.MoveTo(100, 100)
Turtle.MoveTo(10, 10)`, `
x1: 250, y1: 250, x2: 100, y2: 100
x1: 100, y1: 100, x2: 10, y2: 10`);
    });

    it("TurnRight() is lowered correctly", callback => {
        testTurtleLines(callback, `
Turtle.Speed = 10
Turtle.TurnRight()
Turtle.Move(10)`, `
x1: 250, y1: 250, x2: 260, y2: 250`);
    });

    it("TurnLeft() is lowered correctly", callback => {
        testTurtleLines(callback, `
Turtle.Speed = 10
Turtle.TurnLeft()
Turtle.Move(10)`, `
x1: 250, y1: 250, x2: 240, y2: 250`);
    });

    it("can get and set speed", () => {
        const compilation = new Compilation(`
speed_before = Turtle.Speed
Turtle.Speed = 8
speed_after = Turtle.Speed`);

        const engine = new ExecutionEngine(compilation);
        engine.execute(ExecutionMode.RunToEnd);
        expect(engine.state).toBe(ExecutionState.Terminated);
        expect(engine.exception).toBeUndefined();

        expect(engine.memory.values["speed_before"].toDebuggerString()).toBe("5");
        expect(engine.memory.values["speed_after"].toDebuggerString()).toBe("8");
    });

    it("can get and set angle", () => {
        const compilation = new Compilation(`
angle_before = Turtle.Angle
Turtle.Angle = 90
angle_after = Turtle.Angle`);

        const engine = new ExecutionEngine(compilation);
        engine.execute(ExecutionMode.RunToEnd);
        expect(engine.state).toBe(ExecutionState.Terminated);
        expect(engine.exception).toBeUndefined();

        expect(engine.memory.values["angle_before"].toDebuggerString()).toBe("0");
        expect(engine.memory.values["angle_after"].toDebuggerString()).toBe("90");
    });

    it("can get and set position", () => {
        const compilation = new Compilation(`
x_before = Turtle.X
y_before = Turtle.Y
Turtle.MoveTo(50, 50)
x_after = Turtle.X
y_after = Turtle.Y`);

        const engine = new ExecutionEngine(compilation);
        engine.execute(ExecutionMode.RunToEnd);
        expect(engine.state).toBe(ExecutionState.Terminated);
        expect(engine.exception).toBeUndefined();

        expect(engine.memory.values["x_before"].toDebuggerString()).toBe("250");
        expect(engine.memory.values["y_before"].toDebuggerString()).toBe("250");
        expect(engine.memory.values["x_after"].toDebuggerString()).toBe("50");
        expect(engine.memory.values["y_after"].toDebuggerString()).toBe("50");
    });
});
