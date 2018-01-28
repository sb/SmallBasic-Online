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

    it("breaks out of an infinite loop", () => {
        verifyRuntimeResult(`
While "true"
    TextWindow.WriteLine("string? y/n")
    input = TextWindow.Read()
    If input = "y" Then
        TextWindow.WriteLine("string: " + TextWindow.Read())
    ElseIf input = "n" Then
        TextWindow.WriteLine("number: " + TextWindow.ReadNumber())
    Else
        Program.End()
    EndIf
EndWhile`,
            [
                "y",
                "test1",
                "n",
                5,
                "y",
                "test3",
                "end"
            ],
            [
                "string? y/n",
                "string: test1",
                "string? y/n",
                "number: 5",
                "string? y/n",
                "string: test3",
                "string? y/n"
            ]);
    });
});
