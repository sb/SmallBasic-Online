import "jasmine";
import { verifyRuntimeResult } from "../../helpers";

describe("Compiler.Runtime.Expressions.LogicalOperators", () => {
    it("computes false and false", () => {
        verifyRuntimeResult(`
If "false" and "false" Then
    TextWindow.WriteLine("true")
Else
    TextWindow.WriteLine("false")
EndIf`,
            [],
            ["false"]);
    });

    it("computes false and true", () => {
        verifyRuntimeResult(`
If "false" and "true" Then
    TextWindow.WriteLine("true")
Else
    TextWindow.WriteLine("false")
EndIf`,
            [],
            ["false"]);
    });

    it("computes true and false", () => {
        verifyRuntimeResult(`
If "true" and "false" Then
    TextWindow.WriteLine("true")
Else
    TextWindow.WriteLine("false")
EndIf`,
            [],
            ["false"]);
    });

    it("computes true and true", () => {
        verifyRuntimeResult(`
If "true" and "true" Then
    TextWindow.WriteLine("true")
Else
    TextWindow.WriteLine("false")
EndIf`,
            [],
            ["true"]);
    });

    it("computes false or false", () => {
        verifyRuntimeResult(`
If "false" or "false" Then
    TextWindow.WriteLine("true")
Else
    TextWindow.WriteLine("false")
EndIf`,
            [],
            ["false"]);
    });

    it("computes false or true", () => {
        verifyRuntimeResult(`
If "false" or "true" Then
    TextWindow.WriteLine("true")
Else
    TextWindow.WriteLine("false")
EndIf`,
            [],
            ["true"]);
    });

    it("computes true or false", () => {
        verifyRuntimeResult(`
If "true" or "false" Then
    TextWindow.WriteLine("true")
Else
    TextWindow.WriteLine("false")
EndIf`,
            [],
            ["true"]);
    });

    it("computes true or true", () => {
        verifyRuntimeResult(`
If "true" or "true" Then
    TextWindow.WriteLine("true")
Else
    TextWindow.WriteLine("false")
EndIf`,
            [],
            ["true"]);
    });
});
