import "jasmine";
import { verifyErrors } from "../helpers";
import { Diagnostic, ErrorCode } from "../../../compiler/utils/diagnostics";

describe(__filename, () => {
    it("reports errors on goto statements to non-existent labels", () => {
        verifyErrors(`
label1:
GoTo label1
GoTo label2`,
            // GoTo label2
            //      ^^^^^^
            // No label with the name 'label2' exists in the same module.
            new Diagnostic(ErrorCode.Error_LabelDoesNotExist, { line: 3, start: 5, end: 11 }, "label2"));
    });

    it("reports errors on main module goto statements to sub-module labels", () => {
        verifyErrors(`
Sub x
    label:
    GoTo label
EndSub
GoTo label`,
            // GoTo label
            //      ^^^^^
            // No label with the name 'label' exists in the same module.
            new Diagnostic(ErrorCode.Error_LabelDoesNotExist, { line: 5, start: 5, end: 10 }, "label"));
    });

    it("reports errors on sub-module goto statements to main module labels", () => {
        verifyErrors(`
label:
Sub x
    GoTo label
EndSub
GoTo label`,
            //     GoTo label
            //          ^^^^^
            // No label with the name 'label' exists in the same module.
            new Diagnostic(ErrorCode.Error_LabelDoesNotExist, { line: 3, start: 9, end: 14 }, "label"));
    });

    it("reports error on non-value in for loop from expression", () => {
        verifyErrors(`
For x = TextWindow.WriteLine("") To 5
EndFor`,
            // For x = TextWindow.WriteLine("") To 5
            //         ^^^^^^^^^^^^^^^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.Error_UnexpectedVoid_ExpectingValue, { line: 1, start: 8, end: 32 }));
    });

    it("reports error on non-value in for loop to expression", () => {
        verifyErrors(`
For x = 1 To TextWindow.WriteLine("")
EndFor`,
            // For x = 1 To TextWindow.WriteLine("")
            //              ^^^^^^^^^^^^^^^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.Error_UnexpectedVoid_ExpectingValue, { line: 1, start: 13, end: 37 }));
    });

    it("reports error on non-value in for loop step expression", () => {
        verifyErrors(`
For x = 1 To 10 Step TextWindow.WriteLine("")
EndFor`,
            // For x = 1 To 10 Step TextWindow.WriteLine("")
            //                      ^^^^^^^^^^^^^^^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.Error_UnexpectedVoid_ExpectingValue, { line: 1, start: 21, end: 45 }));
    });

    it("reports error on non-value in if statement expression", () => {
        verifyErrors(`
If TextWindow.WriteLine("") Then
EndIf`,
            // If TextWindow.WriteLine("") Then
            //    ^^^^^^^^^^^^^^^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.Error_UnexpectedVoid_ExpectingValue, { line: 1, start: 3, end: 27 }));
    });

    it("reports error on non-value in else-if statement expression", () => {
        verifyErrors(`
If True Then
ElseIf TextWindow.WriteLine("") Then
EndIf`,
            // ElseIf TextWindow.WriteLine("") Then
            //        ^^^^^^^^^^^^^^^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.Error_UnexpectedVoid_ExpectingValue, { line: 2, start: 7, end: 31 }));
    });

    it("reports error on non-value in while statement expression", () => {
        verifyErrors(`
While TextWindow.WriteLine("")
EndWhile`,
            // While TextWindow.WriteLine("")
            //       ^^^^^^^^^^^^^^^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.Error_UnexpectedVoid_ExpectingValue, { line: 1, start: 6, end: 30 }));
    });

    it("reports only one error on expressions that have errors", () => {
        // It should report another error as the function is missing an argument
        verifyErrors(`
TextWindow.WriteLine() = 5`,
            // TextWindow.WriteLine() = 5
            // ^^^^^^^^^^^^^^^^^^^^
            // I was expecting 1 arguments, but found 0 instead.
            new Diagnostic(ErrorCode.Error_UnexpectedArgumentsCount, { line: 1, start: 0, end: 20 }, "1", "0"));
    });

    it("reports error on LHS of assignment not assignable", () => {
        verifyErrors(`
TextWindow.WriteLine(0) = 5`,
            // TextWindow.WriteLine(0) = 5
            // ^^^^^^^^^^^^^^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.Error_UnexpectedVoid_ExpectingValue, { line: 1, start: 0, end: 23 }));
    });

    it("reports error on assigning to property without a setter", () => {
        verifyErrors(`
Clock.Time = 5`,
            // Clock.Time = 5
            // ^^^^^^^^^^
            // This property cannot be set. You can only get its value.
            new Diagnostic(ErrorCode.Error_PropertyHasNoSetter, { line: 1, start: 0, end: 10 }));
    });

    it("reports error on invalid LHS expressions - parenthesis", () => {
        verifyErrors(`
( x + y ) = 5`,
            // ( x + y ) = 5
            // ^^^^^^^^^
            // You cannot assign to this expression. Did you mean to use a variable instead?
            new Diagnostic(ErrorCode.Error_ValueIsNotAssignable, { line: 1, start: 0, end: 9 }));
    });

    it("reports error on invalid LHS expressions - and", () => {
        verifyErrors(`
x and y = 5`,
            // x and y = 5
            // ^^^^^^^
            // You cannot assign to this expression. Did you mean to use a variable instead?
            new Diagnostic(ErrorCode.Error_ValueIsNotAssignable, { line: 1, start: 0, end: 7 }));
    });

    it("reports error on invalid LHS expressions - or", () => {
        verifyErrors(`
x or y = 5`,
            // x or y = 5
            // ^^^^^^
            // You cannot assign to this expression. Did you mean to use a variable instead?
            new Diagnostic(ErrorCode.Error_ValueIsNotAssignable, { line: 1, start: 0, end: 6 }));
    });

    it("reports error on invalid LHS expressions - negation", () => {
        verifyErrors(`
-x = 5`,
            // -x = 5
            // ^^^^^^
            // This value is not assigned to anything. Did you mean to assign it to a variable?
            new Diagnostic(ErrorCode.Error_InvalidExpressionStatement, { line: 1, start: 0, end: 6 }));
    });

    it("reports error on invalid LHS expressions - equal", () => {
        verifyErrors(`
x = y = 5`,
            // x = y = 5
            // ^^^^^
            // You cannot assign to this expression. Did you mean to use a variable instead?
            new Diagnostic(ErrorCode.Error_ValueIsNotAssignable, { line: 1, start: 0, end: 5 }));
    });

    it("reports error on invalid LHS expressions - not equal", () => {
        verifyErrors(`
x <> y = 5`,
            // x <> y = 5
            // ^^^^^^
            // You cannot assign to this expression. Did you mean to use a variable instead?
            new Diagnostic(ErrorCode.Error_ValueIsNotAssignable, { line: 1, start: 0, end: 6 }));
    });

    it("reports error on invalid LHS expressions - addition", () => {
        verifyErrors(`
x + y = 5`,
            // x + y = 5
            // ^^^^^
            // You cannot assign to this expression. Did you mean to use a variable instead?
            new Diagnostic(ErrorCode.Error_ValueIsNotAssignable, { line: 1, start: 0, end: 5 }));
    });

    it("reports error on invalid LHS expressions - subtraction", () => {
        verifyErrors(`
x - y = 5`,
            // x - y = 5
            // ^^^^^
            // You cannot assign to this expression. Did you mean to use a variable instead?
            new Diagnostic(ErrorCode.Error_ValueIsNotAssignable, { line: 1, start: 0, end: 5 }));
    });

    it("reports error on invalid LHS expressions - multiplication", () => {
        verifyErrors(`
x * y = 5`,
            // x * y = 5
            // ^^^^^
            // You cannot assign to this expression. Did you mean to use a variable instead?
            new Diagnostic(ErrorCode.Error_ValueIsNotAssignable, { line: 1, start: 0, end: 5 }));
    });

    it("reports error on invalid LHS expressions - division", () => {
        verifyErrors(`
x / y = 5`,
            // x / y = 5
            // ^^^^^
            // You cannot assign to this expression. Did you mean to use a variable instead?
            new Diagnostic(ErrorCode.Error_ValueIsNotAssignable, { line: 1, start: 0, end: 5 }));
    });

    it("reports error on invalid LHS expressions - greater than", () => {
        verifyErrors(`
x > y = 5`,
            // x > y = 5
            // ^^^^^
            // You cannot assign to this expression. Did you mean to use a variable instead?
            new Diagnostic(ErrorCode.Error_ValueIsNotAssignable, { line: 1, start: 0, end: 5 }));
    });

    it("reports error on invalid LHS expressions - greater than or equal", () => {
        verifyErrors(`
x >= y = 5`,
            // x >= y = 5
            // ^^^^^^
            // You cannot assign to this expression. Did you mean to use a variable instead?
            new Diagnostic(ErrorCode.Error_ValueIsNotAssignable, { line: 1, start: 0, end: 6 }));
    });

    it("reports error on invalid LHS expressions - less than", () => {
        verifyErrors(`
x < y = 5`,
            // x < y = 5
            // ^^^^^
            // You cannot assign to this expression. Did you mean to use a variable instead?
            new Diagnostic(ErrorCode.Error_ValueIsNotAssignable, { line: 1, start: 0, end: 5 }));
    });

    it("reports error on invalid LHS expressions - less than or equal", () => {
        verifyErrors(`
x <= y = 5`,
            // x <= y = 5
            // ^^^^^^
            // You cannot assign to this expression. Did you mean to use a variable instead?
            new Diagnostic(ErrorCode.Error_ValueIsNotAssignable, { line: 1, start: 0, end: 6 }));
    });

    it("reports error on invalid LHS expressions -library method", () => {
        verifyErrors(`
TextWindow.WriteLine = 5`,
            // TextWindow.WriteLine = 5
            // ^^^^^^^^^^^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.Error_UnexpectedVoid_ExpectingValue, { line: 1, start: 0, end: 20 }));
    });

    it("reports error on invalid LHS expressions - library method call", () => {
        verifyErrors(`
TextWindow.WriteLine("") = 5`,
            // TextWindow.WriteLine("") = 5
            // ^^^^^^^^^^^^^^^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.Error_UnexpectedVoid_ExpectingValue, { line: 1, start: 0, end: 24 }));
    });

    it("reports error on invalid LHS expressions - library type", () => {
        verifyErrors(`
TextWindow = 5`,
            // TextWindow = 5
            // ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.Error_UnexpectedVoid_ExpectingValue, { line: 1, start: 0, end: 10 }));
    });

    it("reports error on invalid LHS expressions - number literal", () => {
        verifyErrors(`
6 = 5`,
            // 6 = 5
            // ^
            // You cannot assign to this expression. Did you mean to use a variable instead?
            new Diagnostic(ErrorCode.Error_ValueIsNotAssignable, { line: 1, start: 0, end: 1 }));
    });

    it("reports error on invalid LHS expressions - string literal", () => {
        verifyErrors(`
"literal" = 5`,
            // "literal" = 5
            // ^^^^^^^^^
            // You cannot assign to this expression. Did you mean to use a variable instead?
            new Diagnostic(ErrorCode.Error_ValueIsNotAssignable, { line: 1, start: 0, end: 9 }));
    });

    it("reports error on invalid LHS expressions - submodule", () => {
        verifyErrors(`
Sub M
EndSub

M = 5`,
            // M = 5
            // ^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.Error_UnexpectedVoid_ExpectingValue, { line: 4, start: 0, end: 1 }));
    });

    it("reports error on invalid LHS expressions - submodule call", () => {
        verifyErrors(`
Sub M
EndSub

M() = 5`,
            // M() = 5
            // ^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.Error_UnexpectedVoid_ExpectingValue, { line: 4, start: 0, end: 3 }));
    });
});
