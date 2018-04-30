import "jasmine";
import { Compilation } from "../../../../src/compiler/compilation";
import { ExecutionEngine, ExecutionMode, ExecutionState } from "../../../../src/compiler/execution-engine";

describe("Compiler.Runtime.Libraries.Clock", () => {
    it("can retreive current time", () => {
        const compilation = new Compilation(`
TextWindow.WriteLine(Clock.Time)`);

        const engine = new ExecutionEngine(compilation);

        engine.execute(ExecutionMode.RunToEnd);
        expect(engine.state).toBe(ExecutionState.BlockedOnOutput);
        const value = engine.libraries.TextWindow.readValueFromBuffer();
        expect(value.appendNewLine).toBe(true);
        expect(value.value.toValueString()).toMatch(/[0-9]{2}:[0-9]{2}:[0-9]{2}/);

        engine.execute(ExecutionMode.RunToEnd);
        expect(engine.state).toBe(ExecutionState.Terminated);
        expect(engine.exception).toBeUndefined();
    });
});
