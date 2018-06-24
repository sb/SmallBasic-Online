import "jasmine";
import { verifyCompilationErrors } from "../helpers";
import { Diagnostic, ErrorCode } from "../../../src/compiler/utils/diagnostics";
import { CompilerRange } from "../../../src/compiler/syntax/ranges";

describe("Compiler.Binding.ExpressionBinder", () => {
    it("reports errors on expression without value - indexer base", () => {
        verifyCompilationErrors(`
x = TextWindow[5]`,
            // x = TextWindow[5]
            //     ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, CompilerRange.fromValues(1, 4, 1, 14)));
    });

    it("reports errors on expression without value - indexer index - first", () => {
        verifyCompilationErrors(`
x = y[TextWindow]`,
            // x = y[TextWindow]
            //       ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, CompilerRange.fromValues(1, 6, 1, 16)));
    });

    it("reports errors on expression without value - indexer base - second", () => {
        verifyCompilationErrors(`
x = y[5][TextWindow]`,
            // x = y[5][TextWindow]
            //          ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, CompilerRange.fromValues(1, 9, 1, 19)));
    });

    it("reports errors on expression without value - method arguments - first", () => {
        verifyCompilationErrors(`
TextWindow.WriteLine(TextWindow)`,
            // TextWindow.WriteLine(TextWindow)
            //                      ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, CompilerRange.fromValues(1, 21, 1, 31)));
    });

    it("reports errors on expression without value - method arguments - second", () => {
        verifyCompilationErrors(`
TextWindow.WriteLine(5, TextWindow)`,
            // TextWindow.WriteLine(5, TextWindow)
            //                         ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, CompilerRange.fromValues(1, 24, 1, 34)),
            // TextWindow.WriteLine(5, TextWindow)
            // ^^^^^^^^^^^^^^^^^^^^
            // I was expecting 1 arguments, but found 2 instead.
            new Diagnostic(ErrorCode.UnexpectedArgumentsCount, CompilerRange.fromValues(1, 0, 1, 20), "1", "2"));
    });

    it("reports errors on expression without value - method arguments - multiple", () => {
        verifyCompilationErrors(`
TextWindow.WriteLine(TextWindow, TextWindow)`,
            // TextWindow.WriteLine(TextWindow, TextWindow)
            //                      ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, CompilerRange.fromValues(1, 21, 1, 31)),
            // TextWindow.WriteLine(TextWindow, TextWindow)
            //                                  ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, CompilerRange.fromValues(1, 33, 1, 43)),
            // TextWindow.WriteLine(TextWindow, TextWindow)
            // ^^^^^^^^^^^^^^^^^^^^
            // I was expecting 1 arguments, but found 2 instead.
            new Diagnostic(ErrorCode.UnexpectedArgumentsCount, CompilerRange.fromValues(1, 0, 1, 20), "1", "2"));
    });

    it("reports errors on expression without value - method arguments - parenthesis", () => {
        verifyCompilationErrors(`
x = (TextWindow)`,
            // x = (TextWindow)
            //      ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, CompilerRange.fromValues(1, 5, 1, 15)));
    });

    it("reports errors on expression without value - method arguments - negation", () => {
        verifyCompilationErrors(`
x = -TextWindow`,
            // x = -TextWindow
            //      ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, CompilerRange.fromValues(1, 5, 1, 15)));
    });

    it("reports errors on expression without value - method arguments - library type", () => {
        verifyCompilationErrors(`
x = TextWindow`,
            // x = TextWindow
            //     ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, CompilerRange.fromValues(1, 4, 1, 14)));
    });

    it("reports errors on expression without value - method arguments - library method", () => {
        verifyCompilationErrors(`
x = TextWindow.WriteLine`,
            // x = TextWindow.WriteLine
            //     ^^^^^^^^^^^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, CompilerRange.fromValues(1, 4, 1, 24)));
    });

    it("reports errors on expression without value - method arguments - submodule", () => {
        verifyCompilationErrors(`
Sub x
EndSub
y = x`,
            // y = x
            //     ^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, CompilerRange.fromValues(3, 4, 3, 5)));
    });

    it("reports errors on expression without value - or - left hand side", () => {
        verifyCompilationErrors(`
x = TextWindow or "False"`,
            // x = TextWindow or "False"
            //     ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, CompilerRange.fromValues(1, 4, 1, 14)));
    });

    it("reports errors on expression without value - or - right hand side", () => {
        verifyCompilationErrors(`
x = "False" or TextWindow`,
            // x = "False" or TextWindow
            //                ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, CompilerRange.fromValues(1, 15, 1, 25)));
    });

    it("reports errors on expression without value - and - left hand side", () => {
        verifyCompilationErrors(`
x = TextWindow and "False"`,
            // x = TextWindow and "False"
            //     ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, CompilerRange.fromValues(1, 4, 1, 14)));
    });

    it("reports errors on expression without value - and - right hand side", () => {
        verifyCompilationErrors(`
x = "False" and TextWindow`,
            // x = "False" and TextWindow
            //                 ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, CompilerRange.fromValues(1, 16, 1, 26)));
    });

    it("reports errors on expression without value - not equal - left hand side", () => {
        verifyCompilationErrors(`
x = TextWindow <> "False"`,
            // x = TextWindow <> "False"
            //     ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, CompilerRange.fromValues(1, 4, 1, 14)));
    });

    it("reports errors on expression without value - not equal - right hand side", () => {
        verifyCompilationErrors(`
x = "False" <> TextWindow`,
            // x = "False" <> TextWindow
            //                ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, CompilerRange.fromValues(1, 15, 1, 25)));
    });

    it("reports errors on expression without value - equal - left hand side", () => {
        verifyCompilationErrors(`
x = TextWindow = "False"`,
            // x = TextWindow = "False"
            //     ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, CompilerRange.fromValues(1, 4, 1, 14)));
    });

    it("reports errors on expression without value - equal - right hand side", () => {
        verifyCompilationErrors(`
x = "False" = TextWindow`,
            // x = "False" = TextWindow
            //               ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, CompilerRange.fromValues(1, 14, 1, 24)));
    });

    it("reports errors on expression without value - less than - left hand side", () => {
        verifyCompilationErrors(`
x = TextWindow < 5`,
            // x = TextWindow < 5
            //     ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, CompilerRange.fromValues(1, 4, 1, 14)));
    });

    it("reports errors on expression without value - less than - right hand side", () => {
        verifyCompilationErrors(`
x = 5 < TextWindow`,
            // x = 5 < TextWindow
            //         ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, CompilerRange.fromValues(1, 8, 1, 18)));
    });

    it("reports errors on expression without value - greater than - left hand side", () => {
        verifyCompilationErrors(`
x = TextWindow > 5`,
            // x = TextWindow > 5
            //     ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, CompilerRange.fromValues(1, 4, 1, 14)));
    });

    it("reports errors on expression without value - greater than - right hand side", () => {
        verifyCompilationErrors(`
x = 5 > TextWindow`,
            // x = 5 > TextWindow
            //         ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, CompilerRange.fromValues(1, 8, 1, 18)));
    });

    it("reports errors on expression without value - less than or equal- left hand side", () => {
        verifyCompilationErrors(`
x = TextWindow <= 5`,
            // x = TextWindow <= 5
            //     ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, CompilerRange.fromValues(1, 4, 1, 14)));
    });

    it("reports errors on expression without value - less than or equal - right hand side", () => {
        verifyCompilationErrors(`
x = 5 <= TextWindow`,
            // x = 5 <= TextWindow
            //          ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, CompilerRange.fromValues(1, 9, 1, 19)));
    });

    it("reports errors on expression without value - greater than or equal - left hand side", () => {
        verifyCompilationErrors(`
x = TextWindow >= 5`,
            // x = TextWindow >= 5
            //     ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, CompilerRange.fromValues(1, 4, 1, 14)));
    });

    it("reports errors on expression without value - greater than or equal - right hand side", () => {
        verifyCompilationErrors(`
x = 5 >= TextWindow`,
            // x = 5 >= TextWindow
            //          ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, CompilerRange.fromValues(1, 9, 1, 19)));
    });

    it("reports errors on expression without value - plus - left hand side", () => {
        verifyCompilationErrors(`
x = TextWindow + 5`,
            // x = TextWindow + 5
            //     ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, CompilerRange.fromValues(1, 4, 1, 14)));
    });

    it("reports errors on expression without value - plus - right hand side", () => {
        verifyCompilationErrors(`
x = 5 + TextWindow`,
            // x = 5 + TextWindow
            //         ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, CompilerRange.fromValues(1, 8, 1, 18)));
    });

    it("reports errors on expression without value - minus - left hand side", () => {
        verifyCompilationErrors(`
x = TextWindow - 5`,
            // x = TextWindow - 5
            //     ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, CompilerRange.fromValues(1, 4, 1, 14)));
    });

    it("reports errors on expression without value - minus - right hand side", () => {
        verifyCompilationErrors(`
x = 5 - TextWindow`,
            // x = 5 - TextWindow
            //         ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, CompilerRange.fromValues(1, 8, 1, 18)));
    });

    it("reports errors on expression without value - multiply - left hand side", () => {
        verifyCompilationErrors(`
x = TextWindow * 5`,
            // x = TextWindow * 5
            //     ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, CompilerRange.fromValues(1, 4, 1, 14)));
    });

    it("reports errors on expression without value - multiply - right hand side", () => {
        verifyCompilationErrors(`
x = 5 * TextWindow`,
            // x = 5 * TextWindow
            //         ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, CompilerRange.fromValues(1, 8, 1, 18)));
    });

    it("reports errors on expression without value - divide - left hand side", () => {
        verifyCompilationErrors(`
x = TextWindow / 5`,
            // x = TextWindow / 5
            //     ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, CompilerRange.fromValues(1, 4, 1, 14)));
    });

    it("reports errors on expression without value - divide - right hand side", () => {
        verifyCompilationErrors(`
x = 5 / TextWindow`,
            // x = 5 / TextWindow
            //         ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, CompilerRange.fromValues(1, 8, 1, 18)));
    });

    it("reports errors on invalid array access base - library property", () => {
        verifyCompilationErrors(`
x = Clock.Time[0]`,
            // x = Clock.Time[0]
            //     ^^^^^^^^^^
            // This expression is not a valid array.
            new Diagnostic(ErrorCode.UnsupportedArrayBaseExpression, CompilerRange.fromValues(1, 4, 1, 14)));
    });

    it("reports errors on invalid array access base - library method call", () => {
        verifyCompilationErrors(`
x = TextWindow.Read()[1]`,
            // x = TextWindow.Read()[1]
            //     ^^^^^^^^^^^^^^^^^
            // This expression is not a valid array.
            new Diagnostic(ErrorCode.UnsupportedArrayBaseExpression, CompilerRange.fromValues(1, 4, 1, 21)));
    });

    it("reports errors on invalid array access base - string literal", () => {
        verifyCompilationErrors(`
x = "test"[1]`,
            // x = "test"[1]
            //     ^^^^^^
            // This expression is not a valid array.
            new Diagnostic(ErrorCode.UnsupportedArrayBaseExpression, CompilerRange.fromValues(1, 4, 1, 10)));
    });

    it("reports errors on invalid array access base - number literal", () => {
        verifyCompilationErrors(`
x = 5[1]`,
            // x = 5[1]
            //     ^
            // This expression is not a valid array.
            new Diagnostic(ErrorCode.UnsupportedArrayBaseExpression, CompilerRange.fromValues(1, 4, 1, 5)));
    });

    it("reports errors on invalid array access base - parenthesis", () => {
        verifyCompilationErrors(`
y = (x)[1]`,
            // y = (x)[1]
            //     ^^^
            // This expression is not a valid array.
            new Diagnostic(ErrorCode.UnsupportedArrayBaseExpression, CompilerRange.fromValues(1, 4, 1, 7)));
    });

    it("reports errors on invalid argument count for library method calls", () => {
        verifyCompilationErrors(`
y = TextWindow.Read(5)`,
            // y = TextWindow.Read(5)
            //     ^^^^^^^^^^^^^^^
            // I was expecting 0 arguments, but found 1 instead.
            new Diagnostic(ErrorCode.UnexpectedArgumentsCount, CompilerRange.fromValues(1, 4, 1, 19), "0", "1"));
    });

    it("reports errors on arguments for submodule calls", () => {
        verifyCompilationErrors(`
Sub x
EndSub
x(0)`,
            // x(0)
            // ^
            // I was expecting 0 arguments, but found 1 instead.
            new Diagnostic(ErrorCode.UnexpectedArgumentsCount, CompilerRange.fromValues(3, 0, 3, 1), "0", "1"));
    });

    it("reports errors on invalid base for call expressions - array access", () => {
        verifyCompilationErrors(`
x[0](1)`,
            // x[0](1)
            // ^^^^
            // This expression is not a valid submodule or method to be called.
            new Diagnostic(ErrorCode.UnsupportedCallBaseExpression, CompilerRange.fromValues(1, 0, 1, 4)));
    });

    it("reports errors on invalid base for call expressions - library type", () => {
        verifyCompilationErrors(`
TextWindow(1)`,
            // TextWindow(1)
            // ^^^^^^^^^^
            // This expression is not a valid submodule or method to be called.
            new Diagnostic(ErrorCode.UnsupportedCallBaseExpression, CompilerRange.fromValues(1, 0, 1, 10)));
    });

    it("reports errors on invalid base for call expressions - library method call", () => {
        verifyCompilationErrors(`
TextWindow.Read()(1)`,
            // TextWindow.Read()(1)
            // ^^^^^^^^^^^^^^^^^
            // This expression is not a valid submodule or method to be called.
            new Diagnostic(ErrorCode.UnsupportedCallBaseExpression, CompilerRange.fromValues(1, 0, 1, 17)));
    });

    it("reports errors on invalid base for call expressions - library property", () => {
        verifyCompilationErrors(`
Clock.Time(1)`,
            // Clock.Time(1)
            // ^^^^^^^^^^
            // This expression is not a valid submodule or method to be called.
            new Diagnostic(ErrorCode.UnsupportedCallBaseExpression, CompilerRange.fromValues(1, 0, 1, 10)));
    });

    it("reports errors on invalid base for call expressions - submodule call", () => {
        verifyCompilationErrors(`
Sub x
EndSub
x()(0)`,
            // x()(0)
            // ^^^
            // This expression is not a valid submodule or method to be called.
            new Diagnostic(ErrorCode.UnsupportedCallBaseExpression, CompilerRange.fromValues(3, 0, 3, 3)));
    });

    it("reports errors on invalid base for call expressions - string literal", () => {
        verifyCompilationErrors(`
"test"(0)`,
            // "test"(0)
            // ^^^^^^
            // This expression is not a valid submodule or method to be called.
            new Diagnostic(ErrorCode.UnsupportedCallBaseExpression, CompilerRange.fromValues(1, 0, 1, 6)));
    });

    it("reports errors on invalid base for call expressions - number literal", () => {
        verifyCompilationErrors(`
5(0)`,
            // 5(0)
            // ^
            // This expression is not a valid submodule or method to be called.
            new Diagnostic(ErrorCode.UnsupportedCallBaseExpression, CompilerRange.fromValues(1, 0, 1, 1)));
    });

    it("reports errors on invalid base for call expressions - parenthesis", () => {
        verifyCompilationErrors(`
(0)(1)`,
            // (0)(1)
            // ^^^
            // This expression is not a valid submodule or method to be called.
            new Diagnostic(ErrorCode.UnsupportedCallBaseExpression, CompilerRange.fromValues(1, 0, 1, 3)));
    });

    it("reports errors on invalid base for call expressions - variable", () => {
        verifyCompilationErrors(`
x(1)`,
            // x(1)
            // ^
            // This expression is not a valid submodule or method to be called.
            new Diagnostic(ErrorCode.UnsupportedCallBaseExpression, CompilerRange.fromValues(1, 0, 1, 1)));
    });

    it("reports errors on non-existent library member", () => {
        verifyCompilationErrors(`
x = TextWindow.Nonexistent`,
            // x = TextWindow.Nonexistent
            //     ^^^^^^^^^^
            // The library 'TextWindow' has no member named 'Nonexistent'.
            new Diagnostic(ErrorCode.LibraryMemberNotFound, CompilerRange.fromValues(1, 4, 1, 14), "TextWindow", "Nonexistent"));
    });

    it("reports errors on invalid base for dot expression - array access", () => {
        verifyCompilationErrors(`
x = y[0].Value`,
            // x = y[0].Value
            //     ^^^^
            // You can only use dot access with a library. Did you mean to use an existing library instead?
            new Diagnostic(ErrorCode.UnsupportedDotBaseExpression, CompilerRange.fromValues(1, 4, 1, 8)));
    });

    it("reports errors on invalid base for dot expression - library property", () => {
        verifyCompilationErrors(`
x = Clock.Time.Value`,
            // x = Clock.Time.Value
            //     ^^^^^^^^^^
            // You can only use dot access with a library. Did you mean to use an existing library instead?
            new Diagnostic(ErrorCode.UnsupportedDotBaseExpression, CompilerRange.fromValues(1, 4, 1, 14)));
    });

    it("reports errors on invalid base for dot expression - library method", () => {
        verifyCompilationErrors(`
x = TextWindow.Read.Value`,
            // x = TextWindow.Read.Value
            //     ^^^^^^^^^^^^^^^
            // You can only use dot access with a library. Did you mean to use an existing library instead?
            new Diagnostic(ErrorCode.UnsupportedDotBaseExpression, CompilerRange.fromValues(1, 4, 1, 19)));
    });

    it("reports errors on invalid base for dot expression - library method call", () => {
        verifyCompilationErrors(`
x = TextWindow.Read().Value`,
            // x = TextWindow.Read().Value
            //     ^^^^^^^^^^^^^^^^^
            // You can only use dot access with a library. Did you mean to use an existing library instead?
            new Diagnostic(ErrorCode.UnsupportedDotBaseExpression, CompilerRange.fromValues(1, 4, 1, 21)));
    });

    it("reports errors on invalid base for dot expression - submodule", () => {
        verifyCompilationErrors(`
Sub y
EndSub
x = y.Value`,
            // x = y.Value
            //     ^
            // You can only use dot access with a library. Did you mean to use an existing library instead?
            new Diagnostic(ErrorCode.UnsupportedDotBaseExpression, CompilerRange.fromValues(3, 4, 3, 5)));
    });

    it("reports errors on invalid base for dot expression - submodule call", () => {
        verifyCompilationErrors(`
Sub y
EndSub
x = y().Value`,
            // x = y().Value
            //     ^^^
            // You can only use dot access with a library. Did you mean to use an existing library instead?
            new Diagnostic(ErrorCode.UnsupportedDotBaseExpression, CompilerRange.fromValues(3, 4, 3, 7)));
    });

    it("reports errors on invalid base for dot expression - variable", () => {
        verifyCompilationErrors(`
x = y.Value`,
            // x = y.Value
            //     ^
            // You can only use dot access with a library. Did you mean to use an existing library instead?
            new Diagnostic(ErrorCode.UnsupportedDotBaseExpression, CompilerRange.fromValues(1, 4, 1, 5)));
    });

    it("reports errors on invalid base for dot expression - string literal", () => {
        verifyCompilationErrors(`
x = "test".Value`,
            // x = "test".Value
            //     ^^^^^^
            // You can only use dot access with a library. Did you mean to use an existing library instead?
            new Diagnostic(ErrorCode.UnsupportedDotBaseExpression, CompilerRange.fromValues(1, 4, 1, 10)));
    });

    it("reports errors on invalid base for dot expression - parenthesis", () => {
        verifyCompilationErrors(`
x = (5).Value`,
            // x = (5).Value
            //     ^^^
            // You can only use dot access with a library. Did you mean to use an existing library instead?
            new Diagnostic(ErrorCode.UnsupportedDotBaseExpression, CompilerRange.fromValues(1, 4, 1, 7)));
    });

    it("reports errors on mixing program kinds (TextWindow/Turtle)", () => {
        verifyCompilationErrors(`
TextWindow.WriteLine(Turtle.Speed)`,
            // TextWindow.WriteLine(Turtle.Speed)
            //                      ^^^^^^
            // You already used libraries of type 'Text Window', so you cannot use a library of type 'Turtle' in the same program.
            new Diagnostic(ErrorCode.ProgramKindChanged, CompilerRange.fromValues(1, 21, 1, 27), "Text Window", "Turtle"));
    });
});
