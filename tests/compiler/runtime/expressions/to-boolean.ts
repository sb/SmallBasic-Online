import "jasmine";
import { verifyRuntimeResult } from "../../helpers";

describe("Compiler.Runtime.Expressions.ToBoolean", () => {
    const numbersTestCode = `
x = TextWindow.ReadNumber()
If x Then
    TextWindow.WriteLine("true")
Else
    TextWindow.WriteLine("false")
EndIf`;

    it("can convert variables to boolean - numbers - zero", () => {
        verifyRuntimeResult(numbersTestCode, [0], ["false"]);
    });
    
    it("can convert variables to boolean - numbers - positive", () => {
        verifyRuntimeResult(numbersTestCode, [1], ["false"]);
    });
    
    it("can convert variables to boolean - numbers - negative", () => {
        verifyRuntimeResult(numbersTestCode, [-1], ["false"]);
    });
    
    const stringsTestCode = `
x = TextWindow.Read()
If x Then
    TextWindow.WriteLine("true")
Else
    TextWindow.WriteLine("false")
EndIf`;
    
    it("can convert variables to boolean - strings - correct case True", () => {
        verifyRuntimeResult(stringsTestCode, ["True"], ["true"]);
    });
    
    it("can convert variables to boolean - strings - upper case TRUE", () => {
        verifyRuntimeResult(stringsTestCode, ["TRUE"], ["true"]);
    });
    
    it("can convert variables to boolean - strings - lower case true", () => {
        verifyRuntimeResult(stringsTestCode, ["true"], ["true"]);
    });
    
    it("can convert variables to boolean - strings - false", () => {
        verifyRuntimeResult(stringsTestCode, ["False"], ["false"]);
    });
    
    it("can convert variables to boolean - strings - anything", () => {
        verifyRuntimeResult(stringsTestCode, ["random string"], ["false"]);
    });
    
    it("can convert variables to boolean - arrays", () => {
        verifyRuntimeResult(`
x[0] = 1
If x Then
    TextWindow.WriteLine("true")
Else
    TextWindow.WriteLine("false")
EndIf`,
            [],
            ["false"]);
    });
});
