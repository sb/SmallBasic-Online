import "jasmine";
import { verifyRuntimeResult } from "../../helpers";

describe("Compiler.Runtime.Expressions.Equality", () => {
    it("can compare equality - numbers to numbers - equal", () => {
        verifyRuntimeResult(`
If 1 = 1 Then
    TextWindow.WriteLine("true")
Else
    TextWindow.WriteLine("false")
EndIf`,
            [],
            ["true"]);
    });
    
    it("can compare equality - numbers to numbers - not equal", () => {
        verifyRuntimeResult(`
If 1 = 2 Then
    TextWindow.WriteLine("true")
Else
    TextWindow.WriteLine("false")
EndIf`,
            [],
            ["false"]);
    });
    
    it("can compare equality - numbers to strings - equal", () => {
        verifyRuntimeResult(`
If 1 = "1" Then
    TextWindow.WriteLine("true")
Else
    TextWindow.WriteLine("false")
EndIf`,
            [],
            ["true"]);
    });
    
    it("can compare equality - numbers to strings - not equal", () => {
        verifyRuntimeResult(`
If 1 = "2" Then
    TextWindow.WriteLine("true")
Else
    TextWindow.WriteLine("false")
EndIf`,
            [],
            ["false"]);
    });
    
    it("can compare equality - numbers to arrays", () => {
        verifyRuntimeResult(`
x[0] = 1
If 1 = x Then
    TextWindow.WriteLine("true")
Else
    TextWindow.WriteLine("false")
EndIf`,
            [],
            ["false"]);
    });

    it("can compare equality - strings to numbers - equal", () => {
        verifyRuntimeResult(`
If "1" = 1 Then
    TextWindow.WriteLine("true")
Else
    TextWindow.WriteLine("false")
EndIf`,
            [],
            ["true"]);
    });
    
    it("can compare equality - strings to numbers - not equal", () => {
        verifyRuntimeResult(`
If "1" = 2 Then
    TextWindow.WriteLine("true")
Else
    TextWindow.WriteLine("false")
EndIf`,
            [],
            ["false"]);
    });
    
    it("can compare equality - strings to strings - equal", () => {
        verifyRuntimeResult(`
If "1" = "1" Then
    TextWindow.WriteLine("true")
Else
    TextWindow.WriteLine("false")
EndIf`,
            [],
            ["true"]);
    });
    
    it("can compare equality - strings to strings - not equal", () => {
        verifyRuntimeResult(`
If "1" = "2" Then
    TextWindow.WriteLine("true")
Else
    TextWindow.WriteLine("false")
EndIf`,
            [],
            ["false"]);
    });
    
    it("can compare equality - strings to arrays", () => {
        verifyRuntimeResult(`
x[0] = 1
If "1" = x Then
    TextWindow.WriteLine("true")
Else
    TextWindow.WriteLine("false")
EndIf`,
            [],
            ["false"]);
    });
    
    it("can compare equality - arrays to numbers", () => {
        verifyRuntimeResult(`
x[0] = 1
If x = 1 Then
    TextWindow.WriteLine("true")
Else
    TextWindow.WriteLine("false")
EndIf`,
            [],
            ["false"]);
    });
    
    it("can compare equality - arrays to strings", () => {
        verifyRuntimeResult(`
x[0] = 1
If x = "1" Then
    TextWindow.WriteLine("true")
Else
    TextWindow.WriteLine("false")
EndIf`,
            [],
            ["false"]);
    });
    
    it("can compare equality - arrays to arrays - equal", () => {
        verifyRuntimeResult(`
x[0] = 1
y[0] = 1
If x = y Then
    TextWindow.WriteLine("true")
Else
    TextWindow.WriteLine("false")
EndIf`,
            [],
            ["true"]);
    });
    
    it("can compare equality - arrays to arrays - not equal", () => {
        verifyRuntimeResult(`
x[0] = 1
y[0] = 2
If x = y Then
    TextWindow.WriteLine("true")
Else
    TextWindow.WriteLine("false")
EndIf`,
            [],
            ["false"]);
    });
    
    it("can compare non-equality - numbers to numbers - equal", () => {
        verifyRuntimeResult(`
If 1 <> 1 Then
    TextWindow.WriteLine("true")
Else
    TextWindow.WriteLine("false")
EndIf`,
            [],
            ["false"]);
    });
    
    it("can compare non-equality - numbers to numbers - not equal", () => {
        verifyRuntimeResult(`
If 1 <> 2 Then
    TextWindow.WriteLine("true")
Else
    TextWindow.WriteLine("false")
EndIf`,
            [],
            ["true"]);
    });
    
    it("can compare non-equality - numbers to strings - equal", () => {
        verifyRuntimeResult(`
If 1 <> "1" Then
    TextWindow.WriteLine("true")
Else
    TextWindow.WriteLine("false")
EndIf`,
            [],
            ["false"]);
    });
    
    it("can compare non-equality - numbers to strings - not equal", () => {
        verifyRuntimeResult(`
If 1 <> "2" Then
    TextWindow.WriteLine("true")
Else
    TextWindow.WriteLine("false")
EndIf`,
            [],
            ["true"]);
    });
    
    it("can compare non-equality - numbers to arrays", () => {
        verifyRuntimeResult(`
x[0] = 1
If 1 <> x Then
    TextWindow.WriteLine("true")
Else
    TextWindow.WriteLine("false")
EndIf`,
            [],
            ["true"]);
    });

    it("can compare non-equality - strings to numbers - equal", () => {
        verifyRuntimeResult(`
If "1" <> 1 Then
    TextWindow.WriteLine("true")
Else
    TextWindow.WriteLine("false")
EndIf`,
            [],
            ["false"]);
    });
    
    it("can compare non-equality - strings to numbers - not equal", () => {
        verifyRuntimeResult(`
If "1" <> 2 Then
    TextWindow.WriteLine("true")
Else
    TextWindow.WriteLine("false")
EndIf`,
            [],
            ["true"]);
    });
    
    it("can compare non-equality - strings to strings - equal", () => {
        verifyRuntimeResult(`
If "1" <> "1" Then
    TextWindow.WriteLine("true")
Else
    TextWindow.WriteLine("false")
EndIf`,
            [],
            ["false"]);
    });
    
    it("can compare non-equality - strings to strings - not equal", () => {
        verifyRuntimeResult(`
If "1" <> "2" Then
    TextWindow.WriteLine("true")
Else
    TextWindow.WriteLine("false")
EndIf`,
            [],
            ["true"]);
    });
    
    it("can compare non-equality - strings to arrays", () => {
        verifyRuntimeResult(`
x[0] = 1
If "1" <> x Then
    TextWindow.WriteLine("true")
Else
    TextWindow.WriteLine("false")
EndIf`,
            [],
            ["true"]);
    });
    
    it("can compare non-equality - arrays to numbers", () => {
        verifyRuntimeResult(`
x[0] = 1
If x <> 1 Then
    TextWindow.WriteLine("true")
Else
    TextWindow.WriteLine("false")
EndIf`,
            [],
            ["true"]);
    });
    
    it("can compare non-equality - arrays to strings", () => {
        verifyRuntimeResult(`
x[0] = 1
If x <> "1" Then
    TextWindow.WriteLine("true")
Else
    TextWindow.WriteLine("false")
EndIf`,
            [],
            ["true"]);
    });
    
    it("can compare non-equality - arrays to arrays - equal", () => {
        verifyRuntimeResult(`
x[0] = 1
y[0] = 1
If x <> y Then
    TextWindow.WriteLine("true")
Else
    TextWindow.WriteLine("false")
EndIf`,
            [],
            ["false"]);
    });
    
    it("can compare non-equality - arrays to arrays - not equal", () => {
        verifyRuntimeResult(`
x[0] = 1
y[0] = 2
If x <> y Then
    TextWindow.WriteLine("true")
Else
    TextWindow.WriteLine("false")
EndIf`,
            [],
            ["true"]);
    });
});
