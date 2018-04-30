import "jasmine";
import { Compilation } from "../../../../src/compiler/compilation";
import { ExecutionEngine, ExecutionMode, ExecutionState } from "../../../../src/compiler/execution-engine";
import { verifyRuntimeResult } from "../../helpers";

describe("Compiler.Runtime.Libraries.Program", () => {
    it("pauses when asked", () => {
        const compilation = new Compilation(`
For i = 1 To 3
    If i = 2 Then
        Program.Pause()
    EndIf
    TextWindow.WriteLine(i)
EndFor`);

        const engine = new ExecutionEngine(compilation);

        engine.execute(ExecutionMode.Debug);
        expect(engine.state).toBe(ExecutionState.BlockedOnOutput);
        let value = engine.libraries.TextWindow.readValueFromBuffer();
        expect(value.appendNewLine).toBe(true);
        expect(value.value.toValueString()).toBe("1");

        engine.execute(ExecutionMode.Debug);
        expect(engine.state).toBe(ExecutionState.Paused);
        
        engine.execute(ExecutionMode.Debug);
        expect(engine.state).toBe(ExecutionState.BlockedOnOutput);
        value = engine.libraries.TextWindow.readValueFromBuffer();
        expect(value.appendNewLine).toBe(true);
        expect(value.value.toValueString()).toBe("2");
        
        engine.execute(ExecutionMode.Debug);
        expect(engine.state).toBe(ExecutionState.BlockedOnOutput);
        value = engine.libraries.TextWindow.readValueFromBuffer();
        expect(value.appendNewLine).toBe(true);
        expect(value.value.toValueString()).toBe("3");
        
        engine.execute(ExecutionMode.Debug);
        expect(engine.state).toBe(ExecutionState.Terminated);
        expect(engine.exception).toBeUndefined();
    });
    
    it("ends when asked", () => {
        verifyRuntimeResult(`
For i = 1 To 5
    TextWindow.WriteLine(i)
    If i = 3 Then
        Program.End()
    EndIf
EndFor`,
            [],
            ["1", "2", "3"]);
    });
});
