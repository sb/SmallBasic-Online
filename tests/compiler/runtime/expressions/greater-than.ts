import "jasmine";
import { verifyRuntimeResult } from "../../helpers";

describe("Compiler.Runtime.Expressions.GreaterThan", () => {
    it("computes greater than - less than - numbers", () => {
        verifyRuntimeResult(`
If 1 > 2 Then
    TextWindow.WriteLine("true")
Else
    TextWindow.WriteLine("false")
EndIf`,
            [],
            ["false"]);
    });
    
    it("computes greater than - equal - numbers", () => {
        verifyRuntimeResult(`
If 2 > 2 Then
    TextWindow.WriteLine("true")
Else
    TextWindow.WriteLine("false")
EndIf`,
            [],
            ["false"]);
    });
    
    it("computes greater than - greater than - numbers", () => {
        verifyRuntimeResult(`
If 3 > 2 Then
    TextWindow.WriteLine("true")
Else
    TextWindow.WriteLine("false")
EndIf`,
            [],
            ["true"]);
    });
    
    it("computes greater than - less than - numbers to numeric strings", () => {
        verifyRuntimeResult(`
If 1 > "2" Then
    TextWindow.WriteLine("true")
Else
    TextWindow.WriteLine("false")
EndIf`,
            [],
            ["false"]);
    });
    
    it("computes greater than - equal - numbers to numeric strings", () => {
        verifyRuntimeResult(`
If 2 > "2" Then
    TextWindow.WriteLine("true")
Else
    TextWindow.WriteLine("false")
EndIf`,
            [],
            ["false"]);
    });
    
    it("computes greater than - greater than - numbers to numeric strings", () => {
        verifyRuntimeResult(`
If 3 > "2" Then
    TextWindow.WriteLine("true")
Else
    TextWindow.WriteLine("false")
EndIf`,
            [],
            ["true"]);
    });
    
    it("computes greater than - numbers to non-numeric strings", () => {
        verifyRuntimeResult(`
If 3 > "z" Then
    TextWindow.WriteLine("true")
Else
    TextWindow.WriteLine("false")
EndIf`,
            [],
            ["false"]);
    });
    
    it("computes greater than - numbers to arrays", () => {
        verifyRuntimeResult(`
x[0] = 1
If 3 > x Then
    TextWindow.WriteLine("true")
Else
    TextWindow.WriteLine("false")
EndIf`,
            [],
            ["false"]);
    });

    it("computes greater than - less than - numeric strings", () => {
        verifyRuntimeResult(`
If "1" > 2 Then
    TextWindow.WriteLine("true")
Else
    TextWindow.WriteLine("false")
EndIf`,
            [],
            ["false"]);
    });
    
    it("computes greater than - equal - numeric strings", () => {
        verifyRuntimeResult(`
If "2" > 2 Then
    TextWindow.WriteLine("true")
Else
    TextWindow.WriteLine("false")
EndIf`,
            [],
            ["false"]);
    });
    
    it("computes greater than - greater than - numeric strings", () => {
        verifyRuntimeResult(`
If "3" > 2 Then
    TextWindow.WriteLine("true")
Else
    TextWindow.WriteLine("false")
EndIf`,
            [],
            ["true"]);
    });
    
    it("computes greater than - less than - numeric strings to numeric strings", () => {
        verifyRuntimeResult(`
If "1" > "2" Then
    TextWindow.WriteLine("true")
Else
    TextWindow.WriteLine("false")
EndIf`,
            [],
            ["false"]);
    });
    
    it("computes greater than - equal - numeric strings to numeric strings", () => {
        verifyRuntimeResult(`
If "2" > "2" Then
    TextWindow.WriteLine("true")
Else
    TextWindow.WriteLine("false")
EndIf`,
            [],
            ["false"]);
    });
    
    it("computes greater than - greater than - numeric strings to numeric strings", () => {
        verifyRuntimeResult(`
If "3" > "2" Then
    TextWindow.WriteLine("true")
Else
    TextWindow.WriteLine("false")
EndIf`,
            [],
            ["true"]);
    });
    
    it("computes greater than - numeric strings to non-numeric strings", () => {
        verifyRuntimeResult(`
If "3" > "z" Then
    TextWindow.WriteLine("true")
Else
    TextWindow.WriteLine("false")
EndIf`,
            [],
            ["false"]);
    });
    
    it("computes greater than - numeric strings to arrays", () => {
        verifyRuntimeResult(`
x[0] = 1
If "3" > x Then
    TextWindow.WriteLine("true")
Else
    TextWindow.WriteLine("false")
EndIf`,
            [],
            ["false"]);
    });

    it("computes greater than - non-numeric strings to numbers", () => {
        verifyRuntimeResult(`
If "a" > 2 Then
    TextWindow.WriteLine("true")
Else
    TextWindow.WriteLine("false")
EndIf`,
            [],
            ["false"]);
    });
    
    it("computes greater than - non-numeric strings to numeric strings", () => {
        verifyRuntimeResult(`
If "a" > "2" Then
    TextWindow.WriteLine("true")
Else
    TextWindow.WriteLine("false")
EndIf`,
            [],
            ["false"]);
    });
    
    it("computes greater than - non-numeric strings to non-numeric strings", () => {
        verifyRuntimeResult(`
If "a" > "b" Then
    TextWindow.WriteLine("true")
Else
    TextWindow.WriteLine("false")
EndIf`,
            [],
            ["false"]);
    });

    it("computes greater than - non-numeric strings to arrays", () => {
        verifyRuntimeResult(`
x[0] = 1
If "a" > x Then
    TextWindow.WriteLine("true")
Else
    TextWindow.WriteLine("false")
EndIf`,
            [],
            ["false"]);
    });

    it("computes greater than - arrays to numbers", () => {
        verifyRuntimeResult(`
x[0] = 1
If x > 2 Then
    TextWindow.WriteLine("true")
Else
    TextWindow.WriteLine("false")
EndIf`,
            [],
            ["false"]);
    });
    
    it("computes greater than - arrays to numeric strings", () => {
        verifyRuntimeResult(`
x[0] = 1
If x > "2" Then
    TextWindow.WriteLine("true")
Else
    TextWindow.WriteLine("false")
EndIf`,
            [],
            ["false"]);
    });
    
    it("computes greater than - arrays to non-numeric strings", () => {
        verifyRuntimeResult(`
x[0] = 1
If x > "b" Then
    TextWindow.WriteLine("true")
Else
    TextWindow.WriteLine("false")
EndIf`,
            [],
            ["false"]);
    });

    it("computes greater than - arrays to arrays", () => {
        verifyRuntimeResult(`
x[0] = 1
y[0] = 1
If x > y Then
    TextWindow.WriteLine("true")
Else
    TextWindow.WriteLine("false")
EndIf`,
            [],
            ["false"]);
    });
});
