import "jasmine";
import { verifyCompilationErrors } from "../helpers";
import { Diagnostic, ErrorCode } from "../../../src/compiler/diagnostics";

describe("Compiler.Binding.ExpressionBinder", () => {
    it("reports errors on expression without value - indexer base", () => {
        verifyCompilationErrors(`
x = TextWindow[5]`,
            // x = TextWindow[5]
            //     ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, { line: 1, start: 4, end: 14 }));
    });
    
    it("reports errors on expression without value - indexer index - first", () => {
        verifyCompilationErrors(`
x = y[TextWindow]`,
            // x = y[TextWindow]
            //       ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, { line: 1, start: 6, end: 16 }));
    });
    
    it("reports errors on expression without value - indexer base - second", () => {
        verifyCompilationErrors(`
x = y[5][TextWindow]`,
            // x = y[5][TextWindow]
            //          ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, { line: 1, start: 9, end: 19 }));
    });
    
    it("reports errors on expression without value - method arguments - first", () => {
        verifyCompilationErrors(`
TextWindow.WriteLine(TextWindow)`,
            // TextWindow.WriteLine(TextWindow)
            //                      ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, { line: 1, start: 21, end: 31 }));
    });
    
    it("reports errors on expression without value - method arguments - second", () => {
        verifyCompilationErrors(`
TextWindow.WriteLine(5, TextWindow)`,
            // TextWindow.WriteLine(5, TextWindow)
            //                         ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, { line: 1, start: 24, end: 34 }),
            // TextWindow.WriteLine(5, TextWindow)
            // ^^^^^^^^^^^^^^^^^^^^
            // I was expecting 1 arguments, but found 2 instead.
            new Diagnostic(ErrorCode.UnexpectedArgumentsCount, { line: 1, start: 0, end: 20 }, "1", "2"));
    });
    
    it("reports errors on expression without value - method arguments - multiple", () => {
        verifyCompilationErrors(`
TextWindow.WriteLine(TextWindow, TextWindow)`,
            // TextWindow.WriteLine(TextWindow, TextWindow)
            //                      ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, { line: 1, start: 21, end: 31 }),
            // TextWindow.WriteLine(TextWindow, TextWindow)
            //                                  ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, { line: 1, start: 33, end: 43 }),
            // TextWindow.WriteLine(TextWindow, TextWindow)
            // ^^^^^^^^^^^^^^^^^^^^
            // I was expecting 1 arguments, but found 2 instead.
            new Diagnostic(ErrorCode.UnexpectedArgumentsCount, { line: 1, start: 0, end: 20 }, "1", "2"));
    });
    
    it("reports errors on expression without value - method arguments - parenthesis", () => {
        verifyCompilationErrors(`
x = (TextWindow)`,
            // x = (TextWindow)
            //      ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, { line: 1, start: 5, end: 15 }));
    });
    
    it("reports errors on expression without value - method arguments - negation", () => {
        verifyCompilationErrors(`
x = -TextWindow`,
            // x = -TextWindow
            //      ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, { line: 1, start: 5, end: 15 }));
    });

    it("reports errors on expression without value - method arguments - library type", () => {
        verifyCompilationErrors(`
x = TextWindow`,
            // x = TextWindow
            //     ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, { line: 1, start: 4, end: 14 }));
    });

    it("reports errors on expression without value - method arguments - library method", () => {
        verifyCompilationErrors(`
x = TextWindow.WriteLine`,
            // x = TextWindow.WriteLine
            //     ^^^^^^^^^^^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, { line: 1, start: 4, end: 24 }));
    });
    
    it("reports errors on expression without value - method arguments - submodule", () => {
        verifyCompilationErrors(`
Sub x
EndSub
y = x`,
            // y = x
            //     ^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, { line: 3, start: 4, end: 5 }));
    });

    it("reports errors on expression without value - or - left hand side", () => {
        verifyCompilationErrors(`
x = TextWindow or "False"`,
            // x = TextWindow or "False"
            //     ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, { line: 1, start: 4, end: 14 }));
    });

    it("reports errors on expression without value - or - right hand side", () => {
        verifyCompilationErrors(`
x = "False" or TextWindow`,
            // x = "False" or TextWindow
            //                ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, { line: 1, start: 15, end: 25 }));
    });

    it("reports errors on expression without value - and - left hand side", () => {
        verifyCompilationErrors(`
x = TextWindow and "False"`,
            // x = TextWindow and "False"
            //     ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, { line: 1, start: 4, end: 14 }));
    });

    it("reports errors on expression without value - and - right hand side", () => {
        verifyCompilationErrors(`
x = "False" and TextWindow`,
            // x = "False" and TextWindow
            //                 ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, { line: 1, start: 16, end: 26 }));
    });

    it("reports errors on expression without value - not equal - left hand side", () => {
        verifyCompilationErrors(`
x = TextWindow <> "False"`,
            // x = TextWindow <> "False"
            //     ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, { line: 1, start: 4, end: 14 }));
    });

    it("reports errors on expression without value - not equal - right hand side", () => {
        verifyCompilationErrors(`
x = "False" <> TextWindow`,
            // x = "False" <> TextWindow
            //                ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, { line: 1, start: 15, end: 25 }));
    });
    
    it("reports errors on expression without value - equal - left hand side", () => {
        verifyCompilationErrors(`
x = TextWindow = "False"`,
            // x = TextWindow = "False"
            //     ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, { line: 1, start: 4, end: 14 }));
    });

    it("reports errors on expression without value - equal - right hand side", () => {
        verifyCompilationErrors(`
x = "False" = TextWindow`,
            // x = "False" = TextWindow
            //               ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, { line: 1, start: 14, end: 24 }));
    });
    
    it("reports errors on expression without value - less than - left hand side", () => {
        verifyCompilationErrors(`
x = TextWindow < 5`,
            // x = TextWindow < 5
            //     ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, { line: 1, start: 4, end: 14 }));
    });

    it("reports errors on expression without value - less than - right hand side", () => {
        verifyCompilationErrors(`
x = 5 < TextWindow`,
            // x = 5 < TextWindow
            //         ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, { line: 1, start: 8, end: 18 }));
    });
    
    it("reports errors on expression without value - greater than - left hand side", () => {
        verifyCompilationErrors(`
x = TextWindow > 5`,
            // x = TextWindow > 5
            //     ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, { line: 1, start: 4, end: 14 }));
    });

    it("reports errors on expression without value - greater than - right hand side", () => {
        verifyCompilationErrors(`
x = 5 > TextWindow`,
            // x = 5 > TextWindow
            //         ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, { line: 1, start: 8, end: 18 }));
    });
    
    it("reports errors on expression without value - less than or equal- left hand side", () => {
        verifyCompilationErrors(`
x = TextWindow <= 5`,
            // x = TextWindow <= 5
            //     ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, { line: 1, start: 4, end: 14 }));
    });

    it("reports errors on expression without value - less than or equal - right hand side", () => {
        verifyCompilationErrors(`
x = 5 <= TextWindow`,
            // x = 5 <= TextWindow
            //          ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, { line: 1, start: 9, end: 19 }));
    });
    
    it("reports errors on expression without value - greater than or equal - left hand side", () => {
        verifyCompilationErrors(`
x = TextWindow >= 5`,
            // x = TextWindow >= 5
            //     ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, { line: 1, start: 4, end: 14 }));
    });

    it("reports errors on expression without value - greater than or equal - right hand side", () => {
        verifyCompilationErrors(`
x = 5 >= TextWindow`,
            // x = 5 >= TextWindow
            //          ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, { line: 1, start: 9, end: 19 }));
    });

    it("reports errors on expression without value - plus - left hand side", () => {
        verifyCompilationErrors(`
x = TextWindow + 5`,
            // x = TextWindow + 5
            //     ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, { line: 1, start: 4, end: 14 }));
    });

    it("reports errors on expression without value - plus - right hand side", () => {
        verifyCompilationErrors(`
x = 5 + TextWindow`,
            // x = 5 + TextWindow
            //         ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, { line: 1, start: 8, end: 18 }));
    });
    
    it("reports errors on expression without value - minus - left hand side", () => {
        verifyCompilationErrors(`
x = TextWindow - 5`,
            // x = TextWindow - 5
            //     ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, { line: 1, start: 4, end: 14 }));
    });

    it("reports errors on expression without value - minus - right hand side", () => {
        verifyCompilationErrors(`
x = 5 - TextWindow`,
            // x = 5 - TextWindow
            //         ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, { line: 1, start: 8, end: 18 }));
    });
    
    it("reports errors on expression without value - multiply - left hand side", () => {
        verifyCompilationErrors(`
x = TextWindow * 5`,
            // x = TextWindow * 5
            //     ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, { line: 1, start: 4, end: 14 }));
    });

    it("reports errors on expression without value - multiply - right hand side", () => {
        verifyCompilationErrors(`
x = 5 * TextWindow`,
            // x = 5 * TextWindow
            //         ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, { line: 1, start: 8, end: 18 }));
    });
    
    it("reports errors on expression without value - divide - left hand side", () => {
        verifyCompilationErrors(`
x = TextWindow / 5`,
            // x = TextWindow / 5
            //     ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, { line: 1, start: 4, end: 14 }));
    });

    it("reports errors on expression without value - divide - right hand side", () => {
        verifyCompilationErrors(`
x = 5 / TextWindow`,
            // x = 5 / TextWindow
            //         ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, { line: 1, start: 8, end: 18 }));
    });
    
    it("reports errors on invalid array access base - library property", () => {
        verifyCompilationErrors(`
x = Clock.Time[0]`,
            // x = Clock.Time[0]
            //     ^^^^^^^^^^
            // This expression is not a valid array.
            new Diagnostic(ErrorCode.UnsupportedArrayBaseExpression, { line: 1, start: 4, end: 14 }));
    });
    
    it("reports errors on invalid array access base - library method call", () => {
        verifyCompilationErrors(`
x = TextWindow.Read()[1]`,
            // x = TextWindow.Read()[1]
            //     ^^^^^^^^^^^^^^^^^
            // This expression is not a valid array.
            new Diagnostic(ErrorCode.UnsupportedArrayBaseExpression, { line: 1, start: 4, end: 21 }));
    });
    
    it("reports errors on invalid array access base - string literal", () => {
        verifyCompilationErrors(`
x = "test"[1]`,
            // x = "test"[1]
            //     ^^^^^^
            // This expression is not a valid array.
            new Diagnostic(ErrorCode.UnsupportedArrayBaseExpression, { line: 1, start: 4, end: 10 }));
    });
    
    it("reports errors on invalid array access base - number literal", () => {
        verifyCompilationErrors(`
x = 5[1]`,
            // x = 5[1]
            //     ^
            // This expression is not a valid array.
            new Diagnostic(ErrorCode.UnsupportedArrayBaseExpression, { line: 1, start: 4, end: 5 }));
    });
    
    it("reports errors on invalid array access base - parenthesis", () => {
        verifyCompilationErrors(`
y = (x)[1]`,
            // y = (x)[1]
            //     ^^^
            // This expression is not a valid array.
            new Diagnostic(ErrorCode.UnsupportedArrayBaseExpression, { line: 1, start: 4, end: 7 }));
    });
    
    it("reports errors on invalid argument count for library method calls", () => {
        verifyCompilationErrors(`
y = TextWindow.Read(5)`,
            // y = TextWindow.Read(5)
            //     ^^^^^^^^^^^^^^^
            // I was expecting 0 arguments, but found 1 instead.
            new Diagnostic(ErrorCode.UnexpectedArgumentsCount, { line: 1, start: 4, end: 19 }, "0", "1"));
    });
    
    it("reports errors on arguments for submodule calls", () => {
        verifyCompilationErrors(`
Sub x
EndSub
x(0)`,
            // x(0)
            // ^
            // I was expecting 0 arguments, but found 1 instead.
            new Diagnostic(ErrorCode.UnexpectedArgumentsCount, { line: 3, start: 0, end: 1 }, "0", "1"));
    });
    
    it("reports errors on invalid base for call expressions - array access", () => {
        verifyCompilationErrors(`
x[0](1)`,
            // x[0](1)
            // ^^^^
            // This expression is not a valid submodule or method to be called.
            new Diagnostic(ErrorCode.UnsupportedCallBaseExpression, { line: 1, start: 0, end: 4 }));
    });
    
    it("reports errors on invalid base for call expressions - library type", () => {
        verifyCompilationErrors(`
TextWindow(1)`,
            // TextWindow(1)
            // ^^^^^^^^^^
            // This expression is not a valid submodule or method to be called.
            new Diagnostic(ErrorCode.UnsupportedCallBaseExpression, { line: 1, start: 0, end: 10 }));
    });
    
    it("reports errors on invalid base for call expressions - library method call", () => {
        verifyCompilationErrors(`
TextWindow.Read()(1)`,
            // TextWindow.Read()(1)
            // ^^^^^^^^^^^^^^^^^
            // This expression is not a valid submodule or method to be called.
            new Diagnostic(ErrorCode.UnsupportedCallBaseExpression, { line: 1, start: 0, end: 17 }));
    });
    
    it("reports errors on invalid base for call expressions - library property", () => {
        verifyCompilationErrors(`
Clock.Time(1)`,
            // Clock.Time(1)
            // ^^^^^^^^^^
            // This expression is not a valid submodule or method to be called.
            new Diagnostic(ErrorCode.UnsupportedCallBaseExpression, { line: 1, start: 0, end: 10 }));
    });
    
    it("reports errors on invalid base for call expressions - submodule call", () => {
        verifyCompilationErrors(`
Sub x
EndSub
x()(0)`,
            // x()(0)
            // ^^^
            // This expression is not a valid submodule or method to be called.
            new Diagnostic(ErrorCode.UnsupportedCallBaseExpression, { line: 3, start: 0, end: 3 }));
    });
    
    it("reports errors on invalid base for call expressions - string literal", () => {
        verifyCompilationErrors(`
"test"(0)`,
            // "test"(0)
            // ^^^^^^
            // This expression is not a valid submodule or method to be called.
            new Diagnostic(ErrorCode.UnsupportedCallBaseExpression, { line: 1, start: 0, end: 6 }));
    });
    
    it("reports errors on invalid base for call expressions - number literal", () => {
        verifyCompilationErrors(`
5(0)`,
            // 5(0)
            // ^
            // This expression is not a valid submodule or method to be called.
            new Diagnostic(ErrorCode.UnsupportedCallBaseExpression, { line: 1, start: 0, end: 1 }));
    });
    
    it("reports errors on invalid base for call expressions - parenthesis", () => {
        verifyCompilationErrors(`
(0)(1)`,
            // (0)(1)
            // ^^^
            // This expression is not a valid submodule or method to be called.
            new Diagnostic(ErrorCode.UnsupportedCallBaseExpression, { line: 1, start: 0, end: 3 }));
    });
    
    it("reports errors on invalid base for call expressions - variable", () => {
        verifyCompilationErrors(`
x(1)`,
            // x(1)
            // ^
            // This expression is not a valid submodule or method to be called.
            new Diagnostic(ErrorCode.UnsupportedCallBaseExpression, { line: 1, start: 0, end: 1 }));
    });
    
    it("reports errors on non-existent library member", () => {
        verifyCompilationErrors(`
x = TextWindow.Nonexistent`,
            // x = TextWindow.Nonexistent
            //     ^^^^^^^^^^
            // The library 'TextWindow' has no member named 'Nonexistent'.
            new Diagnostic(ErrorCode.LibraryMemberNotFound, { line: 1, start: 4, end: 14 }, "TextWindow", "Nonexistent"));
    });
    
    it("reports errors on invalid base for dot expression - array access", () => {
        verifyCompilationErrors(`
x = y[0].Value`,
            // x = y[0].Value
            //     ^^^^
            // You can only use dot access with a library. Did you mean to use an existing library instead?
            new Diagnostic(ErrorCode.UnsupportedDotBaseExpression, { line: 1, start: 4, end: 8 }));
    });
    
    it("reports errors on invalid base for dot expression - library property", () => {
        verifyCompilationErrors(`
x = Clock.Time.Value`,
            // x = Clock.Time.Value
            //     ^^^^^^^^^^
            // You can only use dot access with a library. Did you mean to use an existing library instead?
            new Diagnostic(ErrorCode.UnsupportedDotBaseExpression, { line: 1, start: 4, end: 14 }));
    });
    
    it("reports errors on invalid base for dot expression - library method", () => {
        verifyCompilationErrors(`
x = TextWindow.Read.Value`,
            // x = TextWindow.Read.Value
            //     ^^^^^^^^^^^^^^^
            // You can only use dot access with a library. Did you mean to use an existing library instead?
            new Diagnostic(ErrorCode.UnsupportedDotBaseExpression, { line: 1, start: 4, end: 19 }));
    });
    
    it("reports errors on invalid base for dot expression - library method call", () => {
        verifyCompilationErrors(`
x = TextWindow.Read().Value`,
            // x = TextWindow.Read().Value
            //     ^^^^^^^^^^^^^^^^^
            // You can only use dot access with a library. Did you mean to use an existing library instead?
            new Diagnostic(ErrorCode.UnsupportedDotBaseExpression, { line: 1, start: 4, end: 21 }));
    });
    
    it("reports errors on invalid base for dot expression - submodule", () => {
        verifyCompilationErrors(`
Sub y
EndSub
x = y.Value`,
            // x = y.Value
            //     ^
            // You can only use dot access with a library. Did you mean to use an existing library instead?
            new Diagnostic(ErrorCode.UnsupportedDotBaseExpression, { line: 3, start: 4, end: 5 }));
    });
    
    it("reports errors on invalid base for dot expression - submodule call", () => {
        verifyCompilationErrors(`
Sub y
EndSub
x = y().Value`,
            // x = y().Value
            //     ^^^
            // You can only use dot access with a library. Did you mean to use an existing library instead?
            new Diagnostic(ErrorCode.UnsupportedDotBaseExpression, { line: 3, start: 4, end: 7 }));
    });
    
    it("reports errors on invalid base for dot expression - variable", () => {
        verifyCompilationErrors(`
x = y.Value`,
            // x = y.Value
            //     ^
            // You can only use dot access with a library. Did you mean to use an existing library instead?
            new Diagnostic(ErrorCode.UnsupportedDotBaseExpression, { line: 1, start: 4, end: 5 }));
    });
    
    it("reports errors on invalid base for dot expression - string literal", () => {
        verifyCompilationErrors(`
x = "test".Value`,
            // x = "test".Value
            //     ^^^^^^
            // You can only use dot access with a library. Did you mean to use an existing library instead?
            new Diagnostic(ErrorCode.UnsupportedDotBaseExpression, { line: 1, start: 4, end: 10 }));
    });
    
    it("reports errors on invalid base for dot expression - parenthesis", () => {
        verifyCompilationErrors(`
x = (5).Value`,
            // x = (5).Value
            //     ^^^
            // You can only use dot access with a library. Did you mean to use an existing library instead?
            new Diagnostic(ErrorCode.UnsupportedDotBaseExpression, { line: 1, start: 4, end: 7 }));
    });
});
