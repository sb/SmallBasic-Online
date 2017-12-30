import "jasmine";
import { verifyRuntimeResult } from "../../helpers";

describe("Compiler.Runtime.Statements.WhileLoop", () => {
    it("can execute as asked", () => {
        verifyRuntimeResult(`
x = TextWindow.ReadNumber()
result = 1
While x > 0
    result = result * x
    x = x - 1
EndWhile
TextWindow.WriteLine(result)`,
            [4],
            ["24"]);
    });
    
    it("never enters with a false condition", () => {
        verifyRuntimeResult(`
x = TextWindow.ReadNumber()
While x > 0
    TextWindow.WriteLine("entered")
EndWhile`,
            [-5],
            []);
    });
});
