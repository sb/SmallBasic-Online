import "jasmine";
import { verifyErrors } from "../helpers";
import { Diagnostic, ErrorCode } from "../../../src/compiler/utils/diagnostics";

describe(__filename, () => {
    it("reports errors on expression without value - indexer base", () => {
        verifyErrors(`
x = TextWindow[5]`,
            // x = TextWindow[5]
            //     ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, { line: 1, start: 4, end: 14 }));
    });
    
    it("reports errors on expression without value - indexer index - first", () => {
        verifyErrors(`
x = y[TextWindow]`,
            // x = y[TextWindow]
            //       ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, { line: 1, start: 6, end: 16 }));
    });
    
    it("reports errors on expression without value - indexer base - second", () => {
        verifyErrors(`
x = y[5][TextWindow]`,
            // x = y[5][TextWindow]
            //          ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, { line: 1, start: 9, end: 19 }));
    });
    
    it("reports errors on expression without value - method arguments - first", () => {
        verifyErrors(`
TextWindow.WriteLine(TextWindow)`,
            // TextWindow.WriteLine(TextWindow)
            //                      ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, { line: 1, start: 21, end: 31 }));
    });
    
    it("reports errors on expression without value - method arguments - second", () => {
        verifyErrors(`
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
        verifyErrors(`
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
        verifyErrors(`
x = (TextWindow)`,
            // x = (TextWindow)
            //      ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, { line: 1, start: 5, end: 15 }));
    });
    
    it("reports errors on expression without value - method arguments - negation", () => {
        verifyErrors(`
x = -TextWindow`,
            // x = -TextWindow
            //      ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, { line: 1, start: 5, end: 15 }));
    });

    it("reports errors on expression without value - method arguments - library type", () => {
        verifyErrors(`
x = TextWindow`,
            // x = TextWindow
            //     ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, { line: 1, start: 4, end: 14 }));
    });

    it("reports errors on expression without value - method arguments - library method", () => {
        verifyErrors(`
x = TextWindow.WriteLine`,
            // x = TextWindow.WriteLine
            //     ^^^^^^^^^^^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, { line: 1, start: 4, end: 24 }));
    });
    
    it("reports errors on expression without value - method arguments - submodule", () => {
        verifyErrors(`
Sub x
EndSub
y = x`,
            // y = x
            //     ^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, { line: 3, start: 4, end: 5 }));
    });

    it("reports errors on expression without value - or - left hand side", () => {
        verifyErrors(`
x = TextWindow or "False"`,
            // x = TextWindow or "False"
            //     ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, { line: 1, start: 4, end: 14 }));
    });

    it("reports errors on expression without value - or - right hand side", () => {
        verifyErrors(`
x = "False" or TextWindow`,
            // x = "False" or TextWindow
            //                ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, { line: 1, start: 15, end: 25 }));
    });

    it("reports errors on expression without value - and - left hand side", () => {
        verifyErrors(`
x = TextWindow and "False"`,
            // x = TextWindow and "False"
            //     ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, { line: 1, start: 4, end: 14 }));
    });

    it("reports errors on expression without value - and - right hand side", () => {
        verifyErrors(`
x = "False" and TextWindow`,
            // x = "False" and TextWindow
            //                 ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, { line: 1, start: 16, end: 26 }));
    });

    it("reports errors on expression without value - not equal - left hand side", () => {
        verifyErrors(`
x = TextWindow <> "False"`,
            // x = TextWindow <> "False"
            //     ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, { line: 1, start: 4, end: 14 }));
    });

    it("reports errors on expression without value - not equal - right hand side", () => {
        verifyErrors(`
x = "False" <> TextWindow`,
            // x = "False" <> TextWindow
            //                ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, { line: 1, start: 15, end: 25 }));
    });
    
    it("reports errors on expression without value - equal - left hand side", () => {
        verifyErrors(`
x = TextWindow = "False"`,
            // x = TextWindow = "False"
            //     ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, { line: 1, start: 4, end: 14 }));
    });

    it("reports errors on expression without value - equal - right hand side", () => {
        verifyErrors(`
x = "False" = TextWindow`,
            // x = "False" = TextWindow
            //               ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, { line: 1, start: 14, end: 24 }));
    });
    
    it("reports errors on expression without value - less than - left hand side", () => {
        verifyErrors(`
x = TextWindow < 5`,
            // x = TextWindow < 5
            //     ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, { line: 1, start: 4, end: 14 }));
    });

    it("reports errors on expression without value - less than - right hand side", () => {
        verifyErrors(`
x = 5 < TextWindow`,
            // x = 5 < TextWindow
            //         ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, { line: 1, start: 8, end: 18 }));
    });
    
    it("reports errors on expression without value - greater than - left hand side", () => {
        verifyErrors(`
x = TextWindow > 5`,
            // x = TextWindow > 5
            //     ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, { line: 1, start: 4, end: 14 }));
    });

    it("reports errors on expression without value - greater than - right hand side", () => {
        verifyErrors(`
x = 5 > TextWindow`,
            // x = 5 > TextWindow
            //         ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, { line: 1, start: 8, end: 18 }));
    });
    
    it("reports errors on expression without value - less than or equal- left hand side", () => {
        verifyErrors(`
x = TextWindow <= 5`,
            // x = TextWindow <= 5
            //     ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, { line: 1, start: 4, end: 14 }));
    });

    it("reports errors on expression without value - less than or equal - right hand side", () => {
        verifyErrors(`
x = 5 <= TextWindow`,
            // x = 5 <= TextWindow
            //          ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, { line: 1, start: 9, end: 19 }));
    });
    
    it("reports errors on expression without value - greater than or equal - left hand side", () => {
        verifyErrors(`
x = TextWindow >= 5`,
            // x = TextWindow >= 5
            //     ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, { line: 1, start: 4, end: 14 }));
    });

    it("reports errors on expression without value - greater than or equal - right hand side", () => {
        verifyErrors(`
x = 5 >= TextWindow`,
            // x = 5 >= TextWindow
            //          ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, { line: 1, start: 9, end: 19 }));
    });

    it("reports errors on expression without value - plus - left hand side", () => {
        verifyErrors(`
x = TextWindow + 5`,
            // x = TextWindow + 5
            //     ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, { line: 1, start: 4, end: 14 }));
    });

    it("reports errors on expression without value - plus - right hand side", () => {
        verifyErrors(`
x = 5 + TextWindow`,
            // x = 5 + TextWindow
            //         ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, { line: 1, start: 8, end: 18 }));
    });
    
    it("reports errors on expression without value - minus - left hand side", () => {
        verifyErrors(`
x = TextWindow - 5`,
            // x = TextWindow - 5
            //     ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, { line: 1, start: 4, end: 14 }));
    });

    it("reports errors on expression without value - minus - right hand side", () => {
        verifyErrors(`
x = 5 - TextWindow`,
            // x = 5 - TextWindow
            //         ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, { line: 1, start: 8, end: 18 }));
    });
    
    it("reports errors on expression without value - multiply - left hand side", () => {
        verifyErrors(`
x = TextWindow * 5`,
            // x = TextWindow * 5
            //     ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, { line: 1, start: 4, end: 14 }));
    });

    it("reports errors on expression without value - multiply - right hand side", () => {
        verifyErrors(`
x = 5 * TextWindow`,
            // x = 5 * TextWindow
            //         ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, { line: 1, start: 8, end: 18 }));
    });
    
    it("reports errors on expression without value - divide - left hand side", () => {
        verifyErrors(`
x = TextWindow / 5`,
            // x = TextWindow / 5
            //     ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, { line: 1, start: 4, end: 14 }));
    });

    it("reports errors on expression without value - divide - right hand side", () => {
        verifyErrors(`
x = 5 / TextWindow`,
            // x = 5 / TextWindow
            //         ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, { line: 1, start: 8, end: 18 }));
    });
    
    it("reports errors on invalid array access base - library property", () => {
        verifyErrors(`
x = Clock.Time[0]`,
            // x = Clock.Time[0]
            //     ^^^^^^^^^^
            // This expression is not a valid array.
            new Diagnostic(ErrorCode.UnsupportedArrayBaseExpression, { line: 1, start: 4, end: 14 }));
    });
    
    it("reports errors on invalid array access base - library method call", () => {
        verifyErrors(`
x = TextWindow.Read()[1]`,
            // x = TextWindow.Read()[1]
            //     ^^^^^^^^^^^^^^^^^
            // This expression is not a valid array.
            new Diagnostic(ErrorCode.UnsupportedArrayBaseExpression, { line: 1, start: 4, end: 21 }));
    });
    
    it("reports errors on invalid array access base - string literal", () => {
        verifyErrors(`
x = "test"[1]`,
            // x = "test"[1]
            //     ^^^^^^
            // This expression is not a valid array.
            new Diagnostic(ErrorCode.UnsupportedArrayBaseExpression, { line: 1, start: 4, end: 10 }));
    });
    
    it("reports errors on invalid array access base - number literal", () => {
        verifyErrors(`
x = 5[1]`,
            // x = 5[1]
            //     ^
            // This expression is not a valid array.
            new Diagnostic(ErrorCode.UnsupportedArrayBaseExpression, { line: 1, start: 4, end: 5 }));
    });
    
    it("reports errors on invalid array access base - parenthesis", () => {
        verifyErrors(`
y = (x)[1]`,
            // y = (x)[1]
            //     ^^^
            // This expression is not a valid array.
            new Diagnostic(ErrorCode.UnsupportedArrayBaseExpression, { line: 1, start: 4, end: 7 }));
    });
    
    it("reports errors on invalid argument count for library method calls", () => {
        verifyErrors(`
y = TextWindow.Read(5)`,
            // y = TextWindow.Read(5)
            //     ^^^^^^^^^^^^^^^
            // I was expecting 0 arguments, but found 1 instead.
            new Diagnostic(ErrorCode.UnexpectedArgumentsCount, { line: 1, start: 4, end: 19 }, "0", "1"));
    });
    
    it("reports errors on arguments for submodule calls", () => {
        verifyErrors(`
Sub x
EndSub
x(0)`,
            // x(0)
            // ^
            // I was expecting 0 arguments, but found 1 instead.
            new Diagnostic(ErrorCode.UnexpectedArgumentsCount, { line: 3, start: 0, end: 1 }, "0", "1"));
    });
    
    it("reports errors on invalid base for call expressions - array access", () => {
        verifyErrors(`
x[0](1)`,
            // x[0](1)
            // ^^^^
            // This expression is not a valid submodule or method to be called.
            new Diagnostic(ErrorCode.UnsupportedCallBaseExpression, { line: 1, start: 0, end: 4 }));
    });
    
    it("reports errors on invalid base for call expressions - library type", () => {
        verifyErrors(`
TextWindow(1)`,
            // TextWindow(1)
            // ^^^^^^^^^^
            // This expression is not a valid submodule or method to be called.
            new Diagnostic(ErrorCode.UnsupportedCallBaseExpression, { line: 1, start: 0, end: 10 }));
    });
    
    it("reports errors on invalid base for call expressions - library method call", () => {
        verifyErrors(`
TextWindow.Read()(1)`,
            // TextWindow.Read()(1)
            // ^^^^^^^^^^^^^^^^^
            // This expression is not a valid submodule or method to be called.
            new Diagnostic(ErrorCode.UnsupportedCallBaseExpression, { line: 1, start: 0, end: 17 }));
    });
    
    it("reports errors on invalid base for call expressions - library property", () => {
        verifyErrors(`
Clock.Time(1)`,
            // Clock.Time(1)
            // ^^^^^^^^^^
            // This expression is not a valid submodule or method to be called.
            new Diagnostic(ErrorCode.UnsupportedCallBaseExpression, { line: 1, start: 0, end: 10 }));
    });
    
    it("reports errors on invalid base for call expressions - submodule call", () => {
        verifyErrors(`
Sub x
EndSub
x()(0)`,
            // x()(0)
            // ^^^
            // This expression is not a valid submodule or method to be called.
            new Diagnostic(ErrorCode.UnsupportedCallBaseExpression, { line: 3, start: 0, end: 3 }));
    });
    
    it("reports errors on invalid base for call expressions - string literal", () => {
        verifyErrors(`
"test"(0)`,
            // "test"(0)
            // ^^^^^^
            // This expression is not a valid submodule or method to be called.
            new Diagnostic(ErrorCode.UnsupportedCallBaseExpression, { line: 1, start: 0, end: 6 }));
    });
    
    it("reports errors on invalid base for call expressions - number literal", () => {
        verifyErrors(`
5(0)`,
            // 5(0)
            // ^
            // This expression is not a valid submodule or method to be called.
            new Diagnostic(ErrorCode.UnsupportedCallBaseExpression, { line: 1, start: 0, end: 1 }));
    });
    
    it("reports errors on invalid base for call expressions - parenthesis", () => {
        verifyErrors(`
(0)(1)`,
            // (0)(1)
            // ^^^
            // This expression is not a valid submodule or method to be called.
            new Diagnostic(ErrorCode.UnsupportedCallBaseExpression, { line: 1, start: 0, end: 3 }));
    });
    
    it("reports errors on invalid base for call expressions - variable", () => {
        verifyErrors(`
x(1)`,
            // x(1)
            // ^
            // This expression is not a valid submodule or method to be called.
            new Diagnostic(ErrorCode.UnsupportedCallBaseExpression, { line: 1, start: 0, end: 1 }));
    });
    
    it("reports errors on non-existent library member", () => {
        verifyErrors(`
x = TextWindow.Nonexistent`,
            // x = TextWindow.Nonexistent
            //     ^^^^^^^^^^
            // The library 'TextWindow' has no member named 'Nonexistent'.
            new Diagnostic(ErrorCode.LibraryMemberNotFound, { line: 1, start: 4, end: 14 }, "TextWindow", "Nonexistent"));
    });
    
    it("reports errors on invalid base for dot expression - array access", () => {
        verifyErrors(`
x = y[0].Value`,
            // x = y[0].Value
            //     ^^^^
            // You can only use dot access with a library. Did you mean to use an existing library instead?
            new Diagnostic(ErrorCode.UnsupportedDotBaseExpression, { line: 1, start: 4, end: 8 }));
    });
    
    it("reports errors on invalid base for dot expression - library property", () => {
        verifyErrors(`
x = Clock.Time.Value`,
            // x = Clock.Time.Value
            //     ^^^^^^^^^^
            // You can only use dot access with a library. Did you mean to use an existing library instead?
            new Diagnostic(ErrorCode.UnsupportedDotBaseExpression, { line: 1, start: 4, end: 14 }));
    });
    
    it("reports errors on invalid base for dot expression - library method", () => {
        verifyErrors(`
x = TextWindow.Read.Value`,
            // x = TextWindow.Read.Value
            //     ^^^^^^^^^^^^^^^
            // You can only use dot access with a library. Did you mean to use an existing library instead?
            new Diagnostic(ErrorCode.UnsupportedDotBaseExpression, { line: 1, start: 4, end: 19 }));
    });
    
    it("reports errors on invalid base for dot expression - library method call", () => {
        verifyErrors(`
x = TextWindow.Read().Value`,
            // x = TextWindow.Read().Value
            //     ^^^^^^^^^^^^^^^^^
            // You can only use dot access with a library. Did you mean to use an existing library instead?
            new Diagnostic(ErrorCode.UnsupportedDotBaseExpression, { line: 1, start: 4, end: 21 }));
    });
    
    it("reports errors on invalid base for dot expression - submodule", () => {
        verifyErrors(`
Sub y
EndSub
x = y.Value`,
            // x = y.Value
            //     ^
            // You can only use dot access with a library. Did you mean to use an existing library instead?
            new Diagnostic(ErrorCode.UnsupportedDotBaseExpression, { line: 3, start: 4, end: 5 }));
    });
    
    it("reports errors on invalid base for dot expression - submodule call", () => {
        verifyErrors(`
Sub y
EndSub
x = y().Value`,
            // x = y().Value
            //     ^^^
            // You can only use dot access with a library. Did you mean to use an existing library instead?
            new Diagnostic(ErrorCode.UnsupportedDotBaseExpression, { line: 3, start: 4, end: 7 }));
    });
    
    it("reports errors on invalid base for dot expression - variable", () => {
        verifyErrors(`
x = y.Value`,
            // x = y.Value
            //     ^
            // You can only use dot access with a library. Did you mean to use an existing library instead?
            new Diagnostic(ErrorCode.UnsupportedDotBaseExpression, { line: 1, start: 4, end: 5 }));
    });
    
    it("reports errors on invalid base for dot expression - string literal", () => {
        verifyErrors(`
x = "test".Value`,
            // x = "test".Value
            //     ^^^^^^
            // You can only use dot access with a library. Did you mean to use an existing library instead?
            new Diagnostic(ErrorCode.UnsupportedDotBaseExpression, { line: 1, start: 4, end: 10 }));
    });
    
    it("reports errors on invalid base for dot expression - parenthesis", () => {
        verifyErrors(`
x = (5).Value`,
            // x = (5).Value
            //     ^^^
            // You can only use dot access with a library. Did you mean to use an existing library instead?
            new Diagnostic(ErrorCode.UnsupportedDotBaseExpression, { line: 1, start: 4, end: 7 }));
    });
});
