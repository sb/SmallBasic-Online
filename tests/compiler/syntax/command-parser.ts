import "jasmine";
import { verifyCompilationErrors, verifyRuntimeResult } from "../helpers";
import { Diagnostic, ErrorCode } from "../../../src/compiler/diagnostics";
import { CompilerRange } from "../../../src/compiler/syntax/ranges";

describe("Compiler.Syntax.CommandParser", () => {
    it("reports uneven parens", () => {
        verifyCompilationErrors(`
X = ( 1 + (`,
            // X = ( 1 + (
            //           ^
            // Unexpected end of line here. I was expecting an expression instead.
            new Diagnostic(ErrorCode.UnexpectedEOL_ExpectingExpression, CompilerRange.fromValues(1, 10, 1, 11)));
    });

    it("reports commands starting with a different token", () => {
        verifyCompilationErrors(`
If x Then
Then
x = 1
EndIf`,
            // Then
            // ^^^^
            // 'Then' is not a valid command.
            new Diagnostic(ErrorCode.UnrecognizedCommand, CompilerRange.fromValues(2, 0, 2, 4), "Then"));
    });

    it("reports extra commands after a complete one", () => {
        verifyCompilationErrors(`
If x Then y
EndIf`,
            // If x Then y
            //           ^
            // Unexpected 'y' here. I was expecting a new line after the previous command.
            new Diagnostic(ErrorCode.UnexpectedToken_ExpectingEOL, CompilerRange.fromValues(1, 10, 1, 11), "y"));
    });

    it("reports non-expressions - assignment", () => {
        verifyCompilationErrors(`
x = .`,
            // x = .
            //     ^
            // Unexpected '.' here. I was expecting an expression instead.
            new Diagnostic(ErrorCode.UnexpectedToken_ExpectingExpression, CompilerRange.fromValues(1, 4, 1, 5), "."));
    });

    it("reports non-expressions - assignment - nothing", () => {
        verifyCompilationErrors(`
x = `,
            // x =
            //   ^
            // Unexpected end of line here. I was expecting an expression instead.
            new Diagnostic(ErrorCode.UnexpectedEOL_ExpectingExpression, CompilerRange.fromValues(1, 2, 1, 3)));
    });

    it("reports non-expressions - while loop", () => {
        verifyCompilationErrors(`
While *
EndWhile`,
            // While *
            //       ^
            // Unexpected '*' here. I was expecting an expression instead.
            new Diagnostic(ErrorCode.UnexpectedToken_ExpectingExpression, CompilerRange.fromValues(1, 6, 1, 7), "*"));
    });

    it("reports error on missing tokens", () => {
        verifyCompilationErrors(`
If x < 4
EndIF`,
            // If x < 4
            //        ^
            // Unexpected end of line here. I was expecting a token of type 'Then' instead.
            new Diagnostic(ErrorCode.UnexpectedEOL_ExpectingToken, CompilerRange.fromValues(1, 7, 1, 8), "Then"));
    });

    it("reports error on invalid tokens", () => {
        verifyCompilationErrors(`
If x < 4 Step
EndIF`,
            // If x < 4 Step
            //          ^^^^
            // Unexpected 'Step' here. I was expecting a token of type 'Then' instead.
            new Diagnostic(ErrorCode.UnexpectedToken_ExpectingToken, CompilerRange.fromValues(1, 9, 1, 13), "Step", "Then"));
    });

    it("gives error on incomplete parenthesis", () => {
        verifyCompilationErrors(`
TextWindow.WriteLine(1 `,
            // TextWindow.WriteLine(1
            //                      ^
            // Unexpected end of line here. I was expecting a token of type ')' instead.
            new Diagnostic(ErrorCode.UnexpectedEOL_ExpectingToken, CompilerRange.fromValues(1, 21, 1, 22), ")"));
    });

    it("gives error on incomplete parenthesis - with comma", () => {
        verifyCompilationErrors(`
TextWindow.WriteLine(1, `,
            // TextWindow.WriteLine(1,
            //                       ^
            // Unexpected end of line here. I was expecting a token of type ')' instead.
            new Diagnostic(ErrorCode.UnexpectedEOL_ExpectingToken, CompilerRange.fromValues(1, 22, 1, 23), ")"));
    });

    it("reports errors on arguments without commas", () => {
        verifyCompilationErrors(`
TextWindow.WriteLine(1 2 3)`,
            // TextWindow.WriteLine(1 2 3)
            //                        ^
            // Unexpected '2' here. I was expecting a token of type ',' instead.
            new Diagnostic(ErrorCode.UnexpectedToken_ExpectingToken, CompilerRange.fromValues(1, 23, 1, 24), "2", ","),
            // TextWindow.WriteLine(1 2 3)
            // ^^^^^^^^^^^^^^^^^^^^
            // I was expecting 1 arguments, but found 3 instead.
            new Diagnostic(ErrorCode.UnexpectedArgumentsCount, CompilerRange.fromValues(1, 0, 1, 20), "1", "3"));
    });

    it("reports errors on commas without arguments", () => {
        verifyCompilationErrors(`
TextWindow.WriteLine(, , ,)`,
            // TextWindow.WriteLine(, , ,)
            //                      ^
            // Unexpected ',' here. I was expecting an expression instead.
            new Diagnostic(ErrorCode.UnexpectedToken_ExpectingExpression, CompilerRange.fromValues(1, 21, 1, 22), ","),
            // TextWindow.WriteLine(, , ,)
            // ^^^^^^^^^^^^^^^^^^^^
            // I was expecting 1 arguments, but found 2 instead.
            new Diagnostic(ErrorCode.UnexpectedArgumentsCount, CompilerRange.fromValues(1, 0, 1, 20), "1", "2"));
    });

    it("recovers on incomplete square brackets", () => {
        verifyCompilationErrors(`
x = ar[1`,
            // x = ar[1
            //        ^
            // Unexpected end of line here. I was expecting a token of type ']' instead.
            new Diagnostic(ErrorCode.UnexpectedEOL_ExpectingToken, CompilerRange.fromValues(1, 7, 1, 8), "]"));
    });

    it("recovers on additional tokens with errors", () => {
        verifyCompilationErrors(`
For x + = 1 To 5 Step : 1
EndFor`,
            // For x + = 1 To 5 Step : 1
            //       ^
            // Unexpected '+' here. I was expecting a token of type '=' instead.
            new Diagnostic(ErrorCode.UnexpectedToken_ExpectingToken, CompilerRange.fromValues(1, 6, 1, 7), "+", "="));
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
