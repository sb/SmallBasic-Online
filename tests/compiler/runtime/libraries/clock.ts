import "jasmine";
import { Compilation } from "../../../../src/compiler/compilation";
import { ExecutionEngine, ExecutionMode, ExecutionState } from "../../../../src/compiler/execution-engine";

describe("Compiler.Runtime.Libraries.Clock", () => {
    it("can retreive current time", () => {
        const compilation = new Compilation(`
x = Clock.Time`);

        const engine = new ExecutionEngine(compilation);
        engine.execute(ExecutionMode.RunToEnd);

        const value = engine.memory.values["x"];
        expect(value.toValueString()).toMatch(/[0-9]{2}:[0-9]{2}:[0-9]{2}/);

        expect(engine.state).toBe(ExecutionState.Terminated);
        expect(engine.exception).toBeUndefined();
    });
});
