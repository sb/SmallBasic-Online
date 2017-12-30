import "jasmine";
import { Compilation } from "../../../src/compiler/compilation";
import { ExecutionEngine, ExecutionMode, ExecutionState } from "../../../src/compiler/execution-engine";

describe("Compiler.Runtime.SteppingThrough", () => {
    it("pauses when asked", () => {
        const compilation = new Compilation(`
x = 1
x = 2
x = 3`);

        const engine = new ExecutionEngine(compilation);

        engine.execute(ExecutionMode.NextStatement);
        expect(engine.state).toBe(ExecutionState.Paused);
        expect(engine.memory["x"]).toBeUndefined();
        
        engine.execute(ExecutionMode.NextStatement);
        expect(engine.state).toBe(ExecutionState.Paused);
        expect(engine.memory["x"].toDisplayString()).toBe("1");
        
        engine.execute(ExecutionMode.NextStatement);
        expect(engine.state).toBe(ExecutionState.Paused);
        expect(engine.memory["x"].toDisplayString()).toBe("2");
        
        engine.execute(ExecutionMode.NextStatement);
        expect(engine.state).toBe(ExecutionState.Terminated);
        expect(engine.memory["x"].toDisplayString()).toBe("3");
    });
});
