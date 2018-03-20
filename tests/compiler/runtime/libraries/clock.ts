import "jasmine";
import { Compilation } from "../../../../src/compiler/compilation";
import { ExecutionEngine, ExecutionMode, ExecutionState } from "../../../../src/compiler/execution-engine";
import { StringValue } from "../../../../src/compiler/runtime/values/string-value";

describe("Compiler.Runtime.Libraries.Clock", () => {
    it("can retreive current time", () => {
        const compilation = new Compilation(`
TextWindow.WriteLine(Clock.Time)`);

        const engine = new ExecutionEngine(compilation);

        engine.execute(ExecutionMode.RunToEnd);
        expect(engine.state).toBe(ExecutionState.BlockedOnOutput);
        expect((engine.libraries.TextWindow.readValueFromBuffer() as StringValue).value).toMatch(/[0-9]{2}:[0-9]{2}:[0-9]{2}/);

        engine.execute(ExecutionMode.RunToEnd);
        expect(engine.state).toBe(ExecutionState.Terminated);
        expect(engine.exception).toBeUndefined();
    });
});
