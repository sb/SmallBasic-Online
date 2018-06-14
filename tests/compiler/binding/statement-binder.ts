import "jasmine";
import { verifyCompilationErrors } from "../helpers";
import { Diagnostic, ErrorCode } from "../../../src/compiler/utils/diagnostics";
import { CompilerRange } from "../../../src/compiler/syntax/ranges";

describe("Compiler.Binding.StatementBinder", () => {
    it("reports errors on goto statements to non-existent labels", () => {
        verifyCompilationErrors(`
label1:
GoTo label1
GoTo label2`,
            // GoTo label2
            //      ^^^^^^
            // No label with the name 'label2' exists in the same module.
            new Diagnostic(ErrorCode.LabelDoesNotExist, CompilerRange.fromValues(3, 5, 3, 11), "label2"));
    });

    it("reports errors on main module goto statements to sub-module labels", () => {
        verifyCompilationErrors(`
Sub x
    label:
    GoTo label
EndSub
GoTo label`,
            // GoTo label
            //      ^^^^^
            // No label with the name 'label' exists in the same module.
            new Diagnostic(ErrorCode.LabelDoesNotExist, CompilerRange.fromValues(5, 5, 5, 10), "label"));
    });

    it("reports errors on sub-module goto statements to main module labels", () => {
        verifyCompilationErrors(`
label:
Sub x
    GoTo label
EndSub
GoTo label`,
            //     GoTo label
            //          ^^^^^
            // No label with the name 'label' exists in the same module.
            new Diagnostic(ErrorCode.LabelDoesNotExist, CompilerRange.fromValues(3, 9, 3, 14), "label"));
    });

    it("reports error on non-value in for loop from expression", () => {
        verifyCompilationErrors(`
For x = TextWindow.WriteLine("") To 5
EndFor`,
            // For x = TextWindow.WriteLine("") To 5
            //         ^^^^^^^^^^^^^^^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, CompilerRange.fromValues(1, 8, 1, 32)));
    });

    it("reports error on non-value in for loop to expression", () => {
        verifyCompilationErrors(`
For x = 1 To TextWindow.WriteLine("")
EndFor`,
            // For x = 1 To TextWindow.WriteLine("")
            //              ^^^^^^^^^^^^^^^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, CompilerRange.fromValues(1, 13, 1, 37)));
    });

    it("reports error on non-value in for loop step expression", () => {
        verifyCompilationErrors(`
For x = 1 To 10 Step TextWindow.WriteLine("")
EndFor`,
            // For x = 1 To 10 Step TextWindow.WriteLine("")
            //                      ^^^^^^^^^^^^^^^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, CompilerRange.fromValues(1, 21, 1, 45)));
    });

    it("reports error on non-value in if statement expression", () => {
        verifyCompilationErrors(`
If TextWindow.WriteLine("") Then
EndIf`,
            // If TextWindow.WriteLine("") Then
            //    ^^^^^^^^^^^^^^^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, CompilerRange.fromValues(1, 3, 1, 27)));
    });

    it("reports error on non-value in else-if statement expression", () => {
        verifyCompilationErrors(`
If True Then
ElseIf TextWindow.WriteLine("") Then
EndIf`,
            // ElseIf TextWindow.WriteLine("") Then
            //        ^^^^^^^^^^^^^^^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, CompilerRange.fromValues(2, 7, 2, 31)));
    });

    it("reports error on non-value in while statement expression", () => {
        verifyCompilationErrors(`
While TextWindow.WriteLine("")
EndWhile`,
            // While TextWindow.WriteLine("")
            //       ^^^^^^^^^^^^^^^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, CompilerRange.fromValues(1, 6, 1, 30)));
    });

    it("reports only one error on expressions that have errors", () => {
        // It should report another error as the function is missing an argument
        verifyCompilationErrors(`
TextWindow.WriteLine() = 5`,
            // TextWindow.WriteLine() = 5
            // ^^^^^^^^^^^^^^^^^^^^
            // I was expecting 1 arguments, but found 0 instead.
            new Diagnostic(ErrorCode.UnexpectedArgumentsCount, CompilerRange.fromValues(1, 0, 1, 20), "1", "0"));
    });

    it("reports error on LHS of assignment not assignable", () => {
        verifyCompilationErrors(`
TextWindow.WriteLine(0) = 5`,
            // TextWindow.WriteLine(0) = 5
            // ^^^^^^^^^^^^^^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, CompilerRange.fromValues(1, 0, 1, 23)));
    });

    it("reports error on assigning to property without a setter", () => {
        verifyCompilationErrors(`
Clock.Time = 5`,
            // Clock.Time = 5
            // ^^^^^^^^^^
            // This property cannot be set. You can only get its value.
            new Diagnostic(ErrorCode.PropertyHasNoSetter, CompilerRange.fromValues(1, 0, 1, 10)));
    });

    it("reports error on invalid LHS expressions - parenthesis", () => {
        verifyCompilationErrors(`
( x + y ) = 5`,
            // ( x + y ) = 5
            // ^^^^^^^^^
            // You cannot assign to this expression. Did you mean to use a variable instead?
            new Diagnostic(ErrorCode.ValueIsNotAssignable, CompilerRange.fromValues(1, 0, 1, 9)));
    });

    it("reports error on invalid LHS expressions - and", () => {
        verifyCompilationErrors(`
x and y = 5`,
            // x and y = 5
            // ^^^^^^^^^^^
            // This value is not assigned to anything. Did you mean to assign it to a variable?
            new Diagnostic(ErrorCode.UnassignedExpressionStatement, CompilerRange.fromValues(1, 0, 1, 11)));
    });

    it("reports error on invalid LHS expressions - or", () => {
        verifyCompilationErrors(`
x or y = 5`,
            // x or y = 5
            // ^^^^^^^^^^^
            // This value is not assigned to anything. Did you mean to assign it to a variable?
            new Diagnostic(ErrorCode.UnassignedExpressionStatement, CompilerRange.fromValues(1, 0, 1, 10)));
    });

    it("reports error on invalid LHS expressions - negation", () => {
        verifyCompilationErrors(`
-x = 5`,
            // -x = 5
            // ^^^^^^
            // This value is not assigned to anything. Did you mean to assign it to a variable?
            new Diagnostic(ErrorCode.UnassignedExpressionStatement, CompilerRange.fromValues(1, 0, 1, 6)));
    });

    it("reports error on invalid LHS expressions - equal", () => {
        verifyCompilationErrors(`
x = y = 5`,
            // x = y = 5
            // ^^^^^
            // You cannot assign to this expression. Did you mean to use a variable instead?
            new Diagnostic(ErrorCode.ValueIsNotAssignable, CompilerRange.fromValues(1, 0, 1, 5)));
    });

    it("reports error on invalid LHS expressions - not equal", () => {
        verifyCompilationErrors(`
x <> y = 5`,
            // x <> y = 5
            // ^^^^^^
            // You cannot assign to this expression. Did you mean to use a variable instead?
            new Diagnostic(ErrorCode.ValueIsNotAssignable, CompilerRange.fromValues(1, 0, 1, 6)));
    });

    it("reports error on invalid LHS expressions - addition", () => {
        verifyCompilationErrors(`
x + y = 5`,
            // x + y = 5
            // ^^^^^
            // You cannot assign to this expression. Did you mean to use a variable instead?
            new Diagnostic(ErrorCode.ValueIsNotAssignable, CompilerRange.fromValues(1, 0, 1, 5)));
    });

    it("reports error on invalid LHS expressions - subtraction", () => {
        verifyCompilationErrors(`
x - y = 5`,
            // x - y = 5
            // ^^^^^
            // You cannot assign to this expression. Did you mean to use a variable instead?
            new Diagnostic(ErrorCode.ValueIsNotAssignable, CompilerRange.fromValues(1, 0, 1, 5)));
    });

    it("reports error on invalid LHS expressions - multiplication", () => {
        verifyCompilationErrors(`
x * y = 5`,
            // x * y = 5
            // ^^^^^
            // You cannot assign to this expression. Did you mean to use a variable instead?
            new Diagnostic(ErrorCode.ValueIsNotAssignable, CompilerRange.fromValues(1, 0, 1, 5)));
    });

    it("reports error on invalid LHS expressions - division", () => {
        verifyCompilationErrors(`
x / y = 5`,
            // x / y = 5
            // ^^^^^
            // You cannot assign to this expression. Did you mean to use a variable instead?
            new Diagnostic(ErrorCode.ValueIsNotAssignable, CompilerRange.fromValues(1, 0, 1, 5)));
    });

    it("reports error on invalid LHS expressions - greater than", () => {
        verifyCompilationErrors(`
x > y = 5`,
            // x > y = 5
            // ^^^^^
            // You cannot assign to this expression. Did you mean to use a variable instead?
            new Diagnostic(ErrorCode.ValueIsNotAssignable, CompilerRange.fromValues(1, 0, 1, 5)));
    });

    it("reports error on invalid LHS expressions - greater than or equal", () => {
        verifyCompilationErrors(`
x >= y = 5`,
            // x >= y = 5
            // ^^^^^^
            // You cannot assign to this expression. Did you mean to use a variable instead?
            new Diagnostic(ErrorCode.ValueIsNotAssignable, CompilerRange.fromValues(1, 0, 1, 6)));
    });

    it("reports error on invalid LHS expressions - less than", () => {
        verifyCompilationErrors(`
x < y = 5`,
            // x < y = 5
            // ^^^^^
            // You cannot assign to this expression. Did you mean to use a variable instead?
            new Diagnostic(ErrorCode.ValueIsNotAssignable, CompilerRange.fromValues(1, 0, 1, 5)));
    });

    it("reports error on invalid LHS expressions - less than or equal", () => {
        verifyCompilationErrors(`
x <= y = 5`,
            // x <= y = 5
            // ^^^^^^
            // You cannot assign to this expression. Did you mean to use a variable instead?
            new Diagnostic(ErrorCode.ValueIsNotAssignable, CompilerRange.fromValues(1, 0, 1, 6)));
    });

    it("reports error on invalid LHS expressions -library method", () => {
        verifyCompilationErrors(`
TextWindow.WriteLine = 5`,
            // TextWindow.WriteLine = 5
            // ^^^^^^^^^^^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, CompilerRange.fromValues(1, 0, 1, 20)));
    });

    it("reports error on invalid LHS expressions - library method call", () => {
        verifyCompilationErrors(`
TextWindow.WriteLine("") = 5`,
            // TextWindow.WriteLine("") = 5
            // ^^^^^^^^^^^^^^^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, CompilerRange.fromValues(1, 0, 1, 24)));
    });

    it("reports error on invalid LHS expressions - library type", () => {
        verifyCompilationErrors(`
TextWindow = 5`,
            // TextWindow = 5
            // ^^^^^^^^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, CompilerRange.fromValues(1, 0, 1, 10)));
    });

    it("reports error on invalid LHS expressions - number literal", () => {
        verifyCompilationErrors(`
6 = 5`,
            // 6 = 5
            // ^
            // You cannot assign to this expression. Did you mean to use a variable instead?
            new Diagnostic(ErrorCode.ValueIsNotAssignable, CompilerRange.fromValues(1, 0, 1, 1)));
    });

    it("reports error on invalid LHS expressions - string literal", () => {
        verifyCompilationErrors(`
"literal" = 5`,
            // "literal" = 5
            // ^^^^^^^^^
            // You cannot assign to this expression. Did you mean to use a variable instead?
            new Diagnostic(ErrorCode.ValueIsNotAssignable, CompilerRange.fromValues(1, 0, 1, 9)));
    });

    it("reports error on invalid LHS expressions - submodule", () => {
        verifyCompilationErrors(`
Sub M
EndSub

M = 5`,
            // M = 5
            // ^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, CompilerRange.fromValues(4, 0, 4, 1)));
    });

    it("reports error on invalid LHS expressions - submodule call", () => {
        verifyCompilationErrors(`
Sub M
EndSub

M() = 5`,
            // M() = 5
            // ^^^
            // This expression must return a value to be used here.
            new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, CompilerRange.fromValues(4, 0, 4, 3)));
    });
    
    it("reports error on invalid expression statements - variable", () => {
        verifyCompilationErrors(`
x`,
            // x
            // ^
            // This value is not assigned to anything. Did you mean to assign it to a variable?
            new Diagnostic(ErrorCode.UnassignedExpressionStatement, CompilerRange.fromValues(1, 0, 1, 1)));
    });
    
    it("reports error on invalid expression statements - array access", () => {
        verifyCompilationErrors(`
ar[0]`,
            // ar[0]
            // ^^^^^
            // This value is not assigned to anything. Did you mean to assign it to a variable?
            new Diagnostic(ErrorCode.UnassignedExpressionStatement, CompilerRange.fromValues(1, 0, 1, 5)));
    });
    
    it("reports error on invalid expression statements - library property", () => {
        verifyCompilationErrors(`
Clock.Time`,
            // Clock.Time
            // ^^^^^^^^^^
            // This value is not assigned to anything. Did you mean to assign it to a variable?
            new Diagnostic(ErrorCode.UnassignedExpressionStatement, CompilerRange.fromValues(1, 0, 1, 10)));
    });
    
    it("reports error on invalid expression statements - parenthesis", () => {
        verifyCompilationErrors(`
(x)`,
            // (x)
            // ^^^
            // This value is not assigned to anything. Did you mean to assign it to a variable?
            new Diagnostic(ErrorCode.UnassignedExpressionStatement, CompilerRange.fromValues(1, 0, 1, 3)));
    });
    
    it("reports error on invalid expression statements - and", () => {
        verifyCompilationErrors(`
x and y`,
            // x and y
            // ^^^^^^^
            // This value is not assigned to anything. Did you mean to assign it to a variable?
            new Diagnostic(ErrorCode.UnassignedExpressionStatement, CompilerRange.fromValues(1, 0, 1, 7)));
    });
    
    it("reports error on invalid expression statements - or", () => {
        verifyCompilationErrors(`
x or y`,
            // x or y
            // ^^^^^^
            // This value is not assigned to anything. Did you mean to assign it to a variable?
            new Diagnostic(ErrorCode.UnassignedExpressionStatement, CompilerRange.fromValues(1, 0, 1, 6)));
    });
    
    it("reports error on invalid expression statements - negation", () => {
        verifyCompilationErrors(`
-5`,
            // -5
            // ^^
            // This value is not assigned to anything. Did you mean to assign it to a variable?
            new Diagnostic(ErrorCode.UnassignedExpressionStatement, CompilerRange.fromValues(1, 0, 1, 2)));
    });
    
    it("reports error on invalid expression statements - not equal", () => {
        verifyCompilationErrors(`
x <> y`,
            // x <> y
            // ^^^^^^
            // This value is not assigned to anything. Did you mean to assign it to a variable?
            new Diagnostic(ErrorCode.UnassignedExpressionStatement, CompilerRange.fromValues(1, 0, 1, 6)));
    });
    
    it("reports error on invalid expression statements - addition", () => {
        verifyCompilationErrors(`
x + y`,
            // x + y
            // ^^^^^
            // This value is not assigned to anything. Did you mean to assign it to a variable?
            new Diagnostic(ErrorCode.UnassignedExpressionStatement, CompilerRange.fromValues(1, 0, 1, 5)));
    });
    
    it("reports error on invalid expression statements - subtraction", () => {
        verifyCompilationErrors(`
x - y`,
            // x - y
            // ^^^^^
            // This value is not assigned to anything. Did you mean to assign it to a variable?
            new Diagnostic(ErrorCode.UnassignedExpressionStatement, CompilerRange.fromValues(1, 0, 1, 5)));
    });
    
    it("reports error on invalid expression statements - multiplication", () => {
        verifyCompilationErrors(`
x * y`,
            // x * y
            // ^^^^^
            // This value is not assigned to anything. Did you mean to assign it to a variable?
            new Diagnostic(ErrorCode.UnassignedExpressionStatement, CompilerRange.fromValues(1, 0, 1, 5)));
    });
    
    it("reports error on invalid expression statements - division", () => {
        verifyCompilationErrors(`
x / y`,
            // x / y
            // ^^^^^
            // This value is not assigned to anything. Did you mean to assign it to a variable?
            new Diagnostic(ErrorCode.UnassignedExpressionStatement, CompilerRange.fromValues(1, 0, 1, 5)));
    });
    
    it("reports error on invalid expression statements - greater than", () => {
        verifyCompilationErrors(`
x < y`,
            // x < y
            // ^^^^^
            // This value is not assigned to anything. Did you mean to assign it to a variable?
            new Diagnostic(ErrorCode.UnassignedExpressionStatement, CompilerRange.fromValues(1, 0, 1, 5)));
    });
    
    it("reports error on invalid expression statements - less than", () => {
        verifyCompilationErrors(`
x > y`,
            // x > y
            // ^^^^^
            // This value is not assigned to anything. Did you mean to assign it to a variable?
            new Diagnostic(ErrorCode.UnassignedExpressionStatement, CompilerRange.fromValues(1, 0, 1, 5)));
    });
    
    it("reports error on invalid expression statements - greater than or equal", () => {
        verifyCompilationErrors(`
x <= y`,
            // x <= y
            // ^^^^^^
            // This value is not assigned to anything. Did you mean to assign it to a variable?
            new Diagnostic(ErrorCode.UnassignedExpressionStatement, CompilerRange.fromValues(1, 0, 1, 6)));
    });
    
    it("reports error on invalid expression statements - less than or equal", () => {
        verifyCompilationErrors(`
x >= y`,
            // x >= y
            // ^^^^^^
            // This value is not assigned to anything. Did you mean to assign it to a variable?
            new Diagnostic(ErrorCode.UnassignedExpressionStatement, CompilerRange.fromValues(1, 0, 1, 6)));
    });
    
    it("reports error on invalid expression statements - library method", () => {
        verifyCompilationErrors(`
TextWindow.WriteLine`,
            // TextWindow.WriteLine
            // ^^^^^^^^^^^^^^^^^^^^
            // This expression is not a valid statement.
            new Diagnostic(ErrorCode.InvalidExpressionStatement, CompilerRange.fromValues(1, 0, 1, 20)));
    });
    
    it("reports error on invalid expression statements - library type", () => {
        verifyCompilationErrors(`
Clock`,
            // Clock
            // ^^^^^
            // This expression is not a valid statement.
            new Diagnostic(ErrorCode.InvalidExpressionStatement, CompilerRange.fromValues(1, 0, 1, 5)));
    });
    
    it("reports error on invalid expression statements - string literal", () => {
        verifyCompilationErrors(`
"test"`,
            // "test"
            // ^^^^^^
            // This value is not assigned to anything. Did you mean to assign it to a variable?
            new Diagnostic(ErrorCode.UnassignedExpressionStatement, CompilerRange.fromValues(1, 0, 1, 6)));
    });
    
    it("reports error on invalid expression statements - number literal", () => {
        verifyCompilationErrors(`
5`,
            // 5
            // ^
            // This value is not assigned to anything. Did you mean to assign it to a variable?
            new Diagnostic(ErrorCode.UnassignedExpressionStatement, CompilerRange.fromValues(1, 0, 1, 1)));
    });
    
    it("reports error on invalid expression statements - submodule", () => {
        verifyCompilationErrors(`
Sub x
EndSub
x`,
            // x
            // ^
            // This expression is not a valid statement.
            new Diagnostic(ErrorCode.InvalidExpressionStatement, CompilerRange.fromValues(3, 0, 3, 1)));
    });
});
