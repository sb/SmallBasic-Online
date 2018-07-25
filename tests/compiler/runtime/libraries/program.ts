import "jasmine";
import { Compilation } from "../../../../src/compiler/compilation";
import { ExecutionEngine, ExecutionMode, ExecutionState } from "../../../../src/compiler/execution-engine";
import { verifyRuntimeResult, TextWindowTestBuffer } from "../../helpers";

describe("Compiler.Runtime.Libraries.Program", () => {
    it("pauses when asked", () => {
        const compilation = new Compilation(`
TextWindow.WriteLine("before")
Program.Pause()
TextWindow.WriteLine("after")`);

        const buffer = new TextWindowTestBuffer([], ["before", "after"]);
        const engine = new ExecutionEngine(compilation);
        
        engine.libraries.TextWindow.plugin = buffer;
        expect(buffer.outputIndex).toBe(0);
        
        engine.execute(ExecutionMode.Debug);
        expect(engine.state).toBe(ExecutionState.Paused);
        expect(buffer.outputIndex).toBe(1);
        
        engine.execute(ExecutionMode.Debug);
        expect(engine.state).toBe(ExecutionState.Terminated);
        expect(buffer.outputIndex).toBe(2);

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
