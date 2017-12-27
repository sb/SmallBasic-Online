import "jasmine";
import { verifyRuntimeResult } from "../../helpers";

describe("Compiler.Runtime.Libraries.TextWindow", () => {
    it("no input or output", () => {
        verifyRuntimeResult(`
If "Truee" Then
    TextWindow.WriteLine(5)
EndIf`);
    });

    it("reads and writes a string value", () => {
        verifyRuntimeResult(`
x = TextWindow.Read()
TextWindow.WriteLine(x)
TextWindow.WriteLine(x + 1)`,
            ["test"],
            ["test", "test1"]);
    });

    it("reads and writes a number value as string", () => {
        verifyRuntimeResult(`
x = TextWindow.ReadNumber()
TextWindow.WriteLine(x)
TextWindow.WriteLine(x + 1)`,
            [5],
            ["5", "6"]);
    });

    it("displays the contents of an array", () => {
        verifyRuntimeResult(`
x[0] = 1
x[1] = "test"
x[2][0] = 10
x[2][1] = 11
x["key"] = "value"
TextWindow.WriteLine(x)

x["2"] = -5
TextWindow.WriteLine(x)

TextWindow.WriteLine(x["key"])`,
            [],
            [
                `[0=1, 1="test", 2=[0=10, 1=11], key="value"]`,
                `[0=1, 1="test", 2=-5, key="value"]`,
                `value`
            ]);
    });
});
