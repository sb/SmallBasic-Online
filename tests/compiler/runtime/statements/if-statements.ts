import "jasmine";
import { verifyRuntimeResult } from "../../helpers";

describe("Compiler.Runtime.Statements.IfStatements", () => {
    const testCode = `
x = TextWindow.ReadNumber()
If x = 1 Then
    TextWindow.WriteLine("one")
ElseIf x = 2 Then
    TextWindow.WriteLine("two")
ElseIf x = 3 Then
    TextWindow.WriteLine("three")
Else
    TextWindow.WriteLine("none of the above")
EndIf`;

    it("can evaluate if part", () => {
        verifyRuntimeResult(testCode, [1], ["one"]);
    });
    
    it("can evaluate first elseif part", () => {
        verifyRuntimeResult(testCode, [2], ["two"]);
    });
    
    it("can evaluate second elseif part", () => {
        verifyRuntimeResult(testCode, [3], ["three"]);
    });
    
    it("can evaluate else part", () => {
        verifyRuntimeResult(testCode, [0], ["none of the above"]);
    });
});
