import "jasmine";
import { verifyCompilationErrors, verifyRuntimeResult } from "../helpers";
import { Diagnostic, ErrorCode } from "../../../src/compiler/utils/diagnostics";

describe("Compiler.Syntax.CommandParser", () => {
    it("reports uneven parens", () => {
        verifyCompilationErrors(`
X = ( 1 + (`,
            // X = ( 1 + (
            //           ^
            // Unexpected end of line here. I was expecting an expression instead.
            new Diagnostic(ErrorCode.UnexpectedEOL_ExpectingExpression, { line: 1, start: 10, end: 11 }));
    });

    it("reports commands starting with a different token", () => {
        verifyCompilationErrors(`
Then
x = 1
EndIf`,
            // Then
            // ^^^^
            // 'Then' is not a valid command.
            new Diagnostic(ErrorCode.UnrecognizedCommand, { line: 1, start: 0, end: 4 }, "Then"),
            // EndIf
            // ^^^^^
            // You cannot write 'EndIf command' without an earlier 'If command'.
            new Diagnostic(ErrorCode.CannotHaveCommandWithoutPreviousCommand, { line: 3, start: 0, end: 5 }, "EndIf command", "If command"));
    });

    it("reports extra commands after a complete one", () => {
        verifyCompilationErrors(`
If x Then y
EndIf`,
            // If x Then y
            //           ^
            // Unexpected 'y' here. I was expecting a new line after the previous command.
            new Diagnostic(ErrorCode.UnexpectedToken_ExpectingEOL, { line: 1, start: 10, end: 11 }, "y"));
    });

    it("reports non-expressions - assignment", () => {
        verifyCompilationErrors(`
x = .`,
            // x = .
            //     ^
            // Unexpected '.' here. I was expecting an expression instead.
            new Diagnostic(ErrorCode.UnexpectedToken_ExpectingExpression, { line: 1, start: 4, end: 5 }, "."));
    });

    it("reports non-expressions - assignment - nothing", () => {
        verifyCompilationErrors(`
x = `,
            // x =
            //   ^
            // Unexpected end of line here. I was expecting an expression instead.
            new Diagnostic(ErrorCode.UnexpectedEOL_ExpectingExpression, { line: 1, start: 2, end: 3 }));
    });

    it("reports non-expressions - while loop", () => {
        verifyCompilationErrors(`
While *
EndWhile`,
            // While *
            //       ^
            // Unexpected '*' here. I was expecting an expression instead.
            new Diagnostic(ErrorCode.UnexpectedToken_ExpectingExpression, { line: 1, start: 6, end: 7 }, "*"));
    });

    it("reports error on missing tokens", () => {
        verifyCompilationErrors(`
If x < 4
EndIF`,
            // If x < 4
            //        ^
            // Unexpected end of line here. I was expecting a token of type 'Then' instead.
            new Diagnostic(ErrorCode.UnexpectedEOL_ExpectingToken, { line: 1, start: 7, end: 8 }, "Then"));
    });

    it("reports error on invalid tokens", () => {
        verifyCompilationErrors(`
If x < 4 Step
EndIF`,
            // If x < 4 Step
            //          ^^^^
            // Unexpected 'Step' here. I was expecting a token of type 'Then' instead.
            new Diagnostic(ErrorCode.UnexpectedToken_ExpectingToken, { line: 1, start: 9, end: 13 }, "Step", "Then"));
    });

    it("gives error on incomplete parenthesis", () => {
        verifyCompilationErrors(`
TextWindow.WriteLine(1 `,
            // TextWindow.WriteLine(1
            //                      ^
            // Unexpected end of line here. I was expecting a token of type ')' instead.
            new Diagnostic(ErrorCode.UnexpectedEOL_ExpectingToken, { line: 1, start: 21, end: 22 }, ")"));
    });

    it("gives error on incomplete parenthesis - with comma", () => {
        verifyCompilationErrors(`
TextWindow.WriteLine(1, `,
            // TextWindow.WriteLine(1,
            //                       ^
            // Unexpected end of line here. I was expecting a token of type ')' instead.
            new Diagnostic(ErrorCode.UnexpectedEOL_ExpectingToken, { line: 1, start: 22, end: 23 }, ")"));
    });

    it("reports errors on arguments without commas", () => {
        verifyCompilationErrors(`
TextWindow.WriteLine(1 2 3)`,
            // TextWindow.WriteLine(1 2 3)
            //                        ^
            // Unexpected '2' here. I was expecting a token of type ',' instead.
            new Diagnostic(ErrorCode.UnexpectedToken_ExpectingToken, { line: 1, start: 23, end: 24 }, "2", ","),
            // TextWindow.WriteLine(1 2 3)
            // ^^^^^^^^^^^^^^^^^^^^
            // I was expecting 1 arguments, but found 3 instead.
            new Diagnostic(ErrorCode.UnexpectedArgumentsCount, { line: 1, start: 0, end: 20 }, "1", "3"));
    });

    it("reports errors on commas without arguments", () => {
        verifyCompilationErrors(`
TextWindow.WriteLine(, , ,)`,
            // TextWindow.WriteLine(, , ,)
            //                      ^
            // Unexpected ',' here. I was expecting an expression instead.
            new Diagnostic(ErrorCode.UnexpectedToken_ExpectingExpression, { line: 1, start: 21, end: 22 }, ","),
            // TextWindow.WriteLine(, , ,)
            // ^^^^^^^^^^^^^^^^^^^^
            // I was expecting 1 arguments, but found 4 instead.
            new Diagnostic(ErrorCode.UnexpectedArgumentsCount, { line: 1, start: 0, end: 20 }, "1", "4"));
    });

    it("recovers on incomplete square brackets", () => {
        verifyCompilationErrors(`
x = ar[1`,
            // x = ar[1
            //        ^
            // Unexpected end of line here. I was expecting a token of type ']' instead.
            new Diagnostic(ErrorCode.UnexpectedEOL_ExpectingToken, { line: 1, start: 7, end: 8 }, "]"));
    });

    it("recovers on additional tokens with errors", () => {
        verifyCompilationErrors(`
For x + = 1 To 5 Step : 1`,
            // For x + = 1 To 5 Step : 1
            //       ^
            // Unexpected '+' here. I was expecting a token of type '=' instead.
            new Diagnostic(ErrorCode.UnexpectedToken_ExpectingToken, { line: 1, start: 6, end: 7 }, "+", "="),
            // For x + = 1 To 5 Step : 1
            // ^^^^^^^^^^^^^^^^^^^^^^^
            // Unexpected end of file. I was expecting a command of type 'EndFor command'.
            new Diagnostic(ErrorCode.UnexpectedEOF_ExpectingCommand, { line: 1, start: 0, end: 23 }, "EndFor command"));
    });

    it("ignores an empty line with comments", () => {
        verifyCompilationErrors(`
' This is a comment

' Above is also empty`);
    });

    it("does not execute commented out code", () => {
        verifyRuntimeResult(`
TextWindow.WriteLine(1)
'TextWindow.WriteLine(2)
TextWindow.WriteLine(3)`,
            [],
            ["1", "3"]);
    });
});
