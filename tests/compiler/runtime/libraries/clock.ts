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
        expect(value.toValueString()).toMatch(/[0-9]{2}:[0-9]{2}:[0-9]{2} A|PM/);

        expect(engine.state).toBe(ExecutionState.Terminated);
        expect(engine.exception).toBeUndefined();
    });

   it("can retreive current Date", () => {
        const compilation = new Compilation(`
x = Clock.Date`);

        const engine = new ExecutionEngine(compilation);
        engine.execute(ExecutionMode.RunToEnd);

        const value = engine.memory.values["x"];
        expect(value.toValueString()).toMatch(/[01][0-9]\/[0-3][0-9]\/2[0-9]{3}/);

        expect(engine.state).toBe(ExecutionState.Terminated);
        expect(engine.exception).toBeUndefined();
    });

   it("can retreive current Year", () => {
        const compilation = new Compilation(`
x = Clock.Year`);

        const engine = new ExecutionEngine(compilation);
        engine.execute(ExecutionMode.RunToEnd);

        const value = engine.memory.values["x"];
        expect(value.toValueString()).toMatch(/2[0-9]{3}/);

        expect(engine.state).toBe(ExecutionState.Terminated);
        expect(engine.exception).toBeUndefined();
    });

   it("can retreive current Month", () => {
        const compilation = new Compilation(`
x = Clock.Month`);

        const engine = new ExecutionEngine(compilation);
        engine.execute(ExecutionMode.RunToEnd);

        const value = engine.memory.values["x"];
        expect(value.toValueString()).toMatch(/[01][0-9]/);

        expect(engine.state).toBe(ExecutionState.Terminated);
        expect(engine.exception).toBeUndefined();
    });

   it("can retreive current Day of the month", () => {
        const compilation = new Compilation(`
x = Clock.Day`);

        const engine = new ExecutionEngine(compilation);
        engine.execute(ExecutionMode.RunToEnd);

        const value = engine.memory.values["x"];
        expect(value.toValueString()).toMatch(/[0-3][0-9]/);

        expect(engine.state).toBe(ExecutionState.Terminated);
        expect(engine.exception).toBeUndefined();
    });

   it("can retreive current Day of the Week", () => {
        const compilation = new Compilation(`
x = Clock.WeekDay`);

        const engine = new ExecutionEngine(compilation);
        engine.execute(ExecutionMode.RunToEnd);

        const value = engine.memory.values["x"];
        expect(value.toValueString()).toMatch(/[0-7]/);

        expect(engine.state).toBe(ExecutionState.Terminated);
        expect(engine.exception).toBeUndefined();
    });

   it("can retreive current Hour", () => {
        const compilation = new Compilation(`
x = Clock.Hour`);

        const engine = new ExecutionEngine(compilation);
        engine.execute(ExecutionMode.RunToEnd);

        const value = engine.memory.values["x"];
        expect(value.toValueString()).toMatch(/[0-2][0-9]/);

        expect(engine.state).toBe(ExecutionState.Terminated);
        expect(engine.exception).toBeUndefined();
    });

   it("can retreive current Minute", () => {
        const compilation = new Compilation(`
x = Clock.Minute`);

        const engine = new ExecutionEngine(compilation);
        engine.execute(ExecutionMode.RunToEnd);

        const value = engine.memory.values["x"];
        expect(value.toValueString()).toMatch(/[0-6][0-9]/);

        expect(engine.state).toBe(ExecutionState.Terminated);
        expect(engine.exception).toBeUndefined();
    });

   it("can retreive current Second", () => {
        const compilation = new Compilation(`
x = Clock.Second`);

        const engine = new ExecutionEngine(compilation);
        engine.execute(ExecutionMode.RunToEnd);

        const value = engine.memory.values["x"];
        expect(value.toValueString()).toMatch(/[0-6][0-9]/);

        expect(engine.state).toBe(ExecutionState.Terminated);
        expect(engine.exception).toBeUndefined();
    });

   it("can retreive current Millisecond", () => {
        const compilation = new Compilation(`
x = Clock.Millisecond`);

        const engine = new ExecutionEngine(compilation);
        engine.execute(ExecutionMode.RunToEnd);

        const value = engine.memory.values["x"];
        expect(value.toValueString()).toMatch(/[0-9]{1,4}/);

        expect(engine.state).toBe(ExecutionState.Terminated);
        expect(engine.exception).toBeUndefined();
    });

   it("can retreive Elapsed Millisecond since 1970", () => {
        const compilation = new Compilation(`
x = Clock.ElapsedMilliseconds`);

        const engine = new ExecutionEngine(compilation);
        engine.execute(ExecutionMode.RunToEnd);

        const value = engine.memory.values["x"];
        const intval = parseInt(value.toValueString());
        const epochAtTheTimeOfWritingThis = 1540613687913;
        expect(intval).toBeGreaterThan(epochAtTheTimeOfWritingThis);

        expect(engine.state).toBe(ExecutionState.Terminated);
        expect(engine.exception).toBeUndefined();
    });
});
