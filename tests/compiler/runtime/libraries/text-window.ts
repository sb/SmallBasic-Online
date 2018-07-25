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

    it("prints non-conventional characters", () => {
        verifyRuntimeResult(`
TextWindow.WriteLine("$")`,
            [],
            ["$"]);
    });

    it("sets foreground color correctly", () => {
        verifyRuntimeResult(`
TextWindow.WriteLine(TextWindow.ForegroundColor)
TextWindow.ForegroundColor = 7
TextWindow.WriteLine(TextWindow.ForegroundColor)
TextWindow.ForegroundColor = "Blue"
TextWindow.WriteLine(TextWindow.ForegroundColor)
TextWindow.ForegroundColor = "cyan" ' Case insensitive
TextWindow.WriteLine(TextWindow.ForegroundColor)`,
            [],
            [
                "White",
                "Gray",
                "Blue",
                "Cyan"
            ]);
    });

    it("sets background color correctly", () => {
        verifyRuntimeResult(`
TextWindow.WriteLine(TextWindow.BackgroundColor)
TextWindow.BackgroundColor = 7
TextWindow.WriteLine(TextWindow.BackgroundColor)
TextWindow.BackgroundColor = "Blue"
TextWindow.WriteLine(TextWindow.BackgroundColor)
TextWindow.BackgroundColor = "cyan" ' Case insensitive
TextWindow.WriteLine(TextWindow.BackgroundColor)`,
            [],
            [
                "Black",
                "Gray",
                "Blue",
                "Cyan"
            ]);
    });

    it("does not change when an invalid number is used for background color", () => {
        verifyRuntimeResult(`
TextWindow.BackgroundColor  = "Red"
TextWindow.WriteLine(TextWindow.BackgroundColor)
TextWindow.BackgroundColor  = 9455
TextWindow.WriteLine(TextWindow.BackgroundColor)
`,
            [],
            [
                "Red",
                "Red"
            ]);
    });

    it("does not change when an invalid string is used for background color", () => {
        verifyRuntimeResult(`
TextWindow.BackgroundColor  = "Red"
TextWindow.WriteLine(TextWindow.BackgroundColor)
TextWindow.BackgroundColor  = "invalid"
TextWindow.WriteLine(TextWindow.BackgroundColor)
`,
            [],
            [
                "Red",
                "Red"
            ]);
    });

    it("does not change when an invalid number is used for foreground color", () => {
        verifyRuntimeResult(`
TextWindow.ForegroundColor  = "Red"
TextWindow.WriteLine(TextWindow.ForegroundColor)
TextWindow.ForegroundColor  = 9455
TextWindow.WriteLine(TextWindow.ForegroundColor)
`,
            [],
            [
                "Red",
                "Red"
            ]);
    });

    it("does not change when an invalid string is used for foreground color", () => {
        verifyRuntimeResult(`
TextWindow.ForegroundColor  = "Red"
TextWindow.WriteLine(TextWindow.ForegroundColor)
TextWindow.ForegroundColor  = "invalid"
TextWindow.WriteLine(TextWindow.ForegroundColor)
`,
            [],
            [
                "Red",
                "Red"
            ]);
    });

    it("writes partial chunks", () => {
        verifyRuntimeResult(`
TextWindow.Write("1")
TextWindow.Write("2")
TextWindow.Write("3")`,
            [],
            [
                "123"
            ]);
    });
});
