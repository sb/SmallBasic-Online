import "jasmine";
import { verifyRuntimeResult, verifyRuntimeError } from "../../helpers";
import { Diagnostic, ErrorCode } from "../../../../src/compiler/diagnostics";

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

    it("terminates with error when setting background color to invalid number", () => {
        verifyRuntimeError(`
TextWindow.BackgroundColor = 44`,
            // TextWindow.BackgroundColor = 44
            //                              ^^
            // This is not a supported color name or number: '44'
            new Diagnostic(ErrorCode.UnsupportedTextWindowColor, { line: 1, start: 29, end: 31 }, "44"));
    });

    it("terminates with error when setting foreground color to invalid number", () => {
        verifyRuntimeError(`
TextWindow.ForegroundColor = 44`,
            // TextWindow.ForegroundColor = 44
            //                              ^^
            // This is not a supported color name or number: '44'
            new Diagnostic(ErrorCode.UnsupportedTextWindowColor, { line: 1, start: 29, end: 31 }, "44"));
    });

    it("terminates with error when setting background color to invalid string", () => {
        verifyRuntimeError(`
TextWindow.BackgroundColor = "Nothing"`,
            // TextWindow.BackgroundColor = "Nothing"
            //                              ^^^^^^^^^
            // This is not a supported color name or number: 'Nothing'
            new Diagnostic(ErrorCode.UnsupportedTextWindowColor, { line: 1, start: 29, end: 38 }, "Nothing"));
    });

    it("terminates with error when setting foreground color to invalid string", () => {
        verifyRuntimeError(`
TextWindow.ForegroundColor = "Nothing"`,
            // TextWindow.ForegroundColor = "Nothing"
            //                              ^^^^^^^^^
            // This is not a supported color name or number: 'Nothing'
            new Diagnostic(ErrorCode.UnsupportedTextWindowColor, { line: 1, start: 29, end: 38 }, "Nothing"));
    });
});
