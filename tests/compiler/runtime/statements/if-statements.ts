import "jasmine";
import { verifyRuntimeResult } from "../../helpers";

describe("Compiler.Runtime.Statements.IfStatements", () => {
    const testCode1 = `
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
        verifyRuntimeResult(testCode1, [1], ["one"]);
    });

    it("can evaluate first elseif part", () => {
        verifyRuntimeResult(testCode1, [2], ["two"]);
    });

    it("can evaluate second elseif part", () => {
        verifyRuntimeResult(testCode1, [3], ["three"]);
    });

    it("can evaluate else part", () => {
        verifyRuntimeResult(testCode1, [0], ["none of the above"]);
    });

    const testCode2 = `
x = TextWindow.ReadNumber()
If x = 1 or x = 2 Then
    TextWindow.WriteLine("first")
ElseIf x <= 4 and x >= 3 Then
    TextWindow.WriteLine("second")
Else
    TextWindow.WriteLine("third")
EndIf`;

    it("can evaluate compound expressions - or - rhs", () => {
        verifyRuntimeResult(testCode2, [1], ["first"]);
    });

    it("can evaluate compound expressions - or - lhs", () => {
        verifyRuntimeResult(testCode2, [2], ["first"]);
    });

    it("can evaluate compound expressions - and - rhs", () => {
        verifyRuntimeResult(testCode2, [3], ["second"]);
    });

    it("can evaluate compound expressions - and - lhs", () => {
        verifyRuntimeResult(testCode2, [4], ["second"]);
    });

    it("can evaluate compound expressions - none", () => {
        verifyRuntimeResult(testCode2, [5], ["third"]);
    });
});
