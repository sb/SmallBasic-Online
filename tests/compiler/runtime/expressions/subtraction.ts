import "jasmine";
import { verifyRuntimeResult, verifyRuntimeError } from "../../helpers";
import { Diagnostic, ErrorCode } from "../../../../src/compiler/utils/diagnostics";
import { CompilerRange } from "../../../../src/compiler/syntax/ranges";

describe("Compiler.Runtime.Expressions.Subtraction", () => {
    it("computes subtraction - number minus number", () => {
        verifyRuntimeResult(`
TextWindow.WriteLine(7 - 4)`,
            [],
            ["3"]);
    });

    it("computes subtraction - number minus numeric string", () => {
        verifyRuntimeResult(`
TextWindow.WriteLine(7 - "2")`,
            [],
            ["5"]);
    });

    it("computes subtraction - number minus non-numeric string", () => {
        verifyRuntimeError(`
TextWindow.WriteLine(1 - "t")`,
            // TextWindow.WriteLine(1 - "t")
            //                      ^^^^^^^
            // You cannot use the operator '-' with a string value
            new Diagnostic(ErrorCode.CannotUseOperatorWithAString, CompilerRange.fromValues(1, 21, 1, 28), "-"));
    });

    it("computes subtraction - number minus array - error", () => {
        verifyRuntimeError(`
x[0] = 1
TextWindow.WriteLine(1 - x)`,
            // TextWindow.WriteLine(1 - x)
            //                      ^^^^^
            // You cannot use the operator '-' with an array value
            new Diagnostic(ErrorCode.CannotUseOperatorWithAnArray, CompilerRange.fromValues(2, 21, 2, 26), "-"));
    });
    
    it("computes subtraction - numeric string minus number", () => {
        verifyRuntimeResult(`
TextWindow.WriteLine("6" - 4)`,
            [],
            ["2"]);
    });

    it("computes subtraction - numeric string minus numeric string", () => {
        verifyRuntimeResult(`
TextWindow.WriteLine("1" - "7")`,
            [],
            ["-6"]);
    });

    it("computes subtraction - numeric string minus non-numeric string", () => {
        verifyRuntimeError(`
TextWindow.WriteLine("1" - "t")`,
            // TextWindow.WriteLine("1" - "t")
            //                      ^^^^^^^^^
            // You cannot use the operator '-' with a string value
            new Diagnostic(ErrorCode.CannotUseOperatorWithAString, CompilerRange.fromValues(1, 21, 1, 30), "-"));
    });

    it("computes subtraction - numeric string minus array - error", () => {
        verifyRuntimeError(`
x[0] = 1
TextWindow.WriteLine("1" - x)`,
            // TextWindow.WriteLine("1" - x)
            //                      ^^^^^^^
            // You cannot use the operator '-' with an array value
            new Diagnostic(ErrorCode.CannotUseOperatorWithAnArray, CompilerRange.fromValues(2, 21, 2, 28), "-"));
    });
    
    it("computes subtraction - non-numeric string minus number", () => {
        verifyRuntimeError(`
TextWindow.WriteLine("r" - 5)`,
            // TextWindow.WriteLine("r" - 5)
            //                      ^^^^^^^
            // You cannot use the operator '-' with a string value
            new Diagnostic(ErrorCode.CannotUseOperatorWithAString, CompilerRange.fromValues(1, 21, 1, 28), "-"));
    });

    it("computes subtraction - non-numeric string minus numeric string", () => {
        verifyRuntimeError(`
TextWindow.WriteLine("r" - "4")`,
            // TextWindow.WriteLine("r" - "4")
            //                      ^^^^^^^^^
            // You cannot use the operator '-' with a string value
            new Diagnostic(ErrorCode.CannotUseOperatorWithAString, CompilerRange.fromValues(1, 21, 1, 30), "-"));
    });

    it("computes subtraction - non-numeric string minus non-numeric string", () => {
        verifyRuntimeError(`
TextWindow.WriteLine("r" - "t")`,
            // TextWindow.WriteLine("r" - "t")
            //                      ^^^^^^^^^
            // You cannot use the operator '-' with a string value
            new Diagnostic(ErrorCode.CannotUseOperatorWithAString, CompilerRange.fromValues(1, 21, 1, 30), "-"));
    });

    it("computes subtraction - non-numeric string minus array - error", () => {
        verifyRuntimeError(`
x[0] = 1
TextWindow.WriteLine("r" - x)`,
            // TextWindow.WriteLine("r" - x)
            //                      ^^^^^^^
            // You cannot use the operator '-' with a string value
            new Diagnostic(ErrorCode.CannotUseOperatorWithAString, CompilerRange.fromValues(2, 21, 2, 28), "-"));
    });
    
    it("computes subtraction - array minus number", () => {
        verifyRuntimeError(`
x[0] = 1
TextWindow.WriteLine(x - 5)`,
            // TextWindow.WriteLine(x - 5)
            //                      ^^^^^
            // You cannot use the operator '-' with an array value
            new Diagnostic(ErrorCode.CannotUseOperatorWithAnArray, CompilerRange.fromValues(2, 21, 2, 26), "-"));
    });

    it("computes subtraction - array minus numeric string", () => {
        verifyRuntimeError(`
x[0] = 1
TextWindow.WriteLine(x - "4")`,
            // TextWindow.WriteLine(x - "4")
            //                      ^^^^^^^
            // You cannot use the operator '-' with an array value
            new Diagnostic(ErrorCode.CannotUseOperatorWithAnArray, CompilerRange.fromValues(2, 21, 2, 28), "-"));
    });

    it("computes subtraction - array minus non-numeric string", () => {
        verifyRuntimeError(`
x[0] = 1
TextWindow.WriteLine(x - "t")`,
            // TextWindow.WriteLine(x - "t")
            //                      ^^^^^^^
            // You cannot use the operator '-' with an array value
            new Diagnostic(ErrorCode.CannotUseOperatorWithAnArray, CompilerRange.fromValues(2, 21, 2, 28), "-"));
    });

    it("computes subtraction - array minus array - error", () => {
        verifyRuntimeError(`
x[0] = 1
y[0] = 1
TextWindow.WriteLine(x - y)`,
            // TextWindow.WriteLine(x - y)
            //                      ^^^^^
            // You cannot use the operator '-' with an array value
            new Diagnostic(ErrorCode.CannotUseOperatorWithAnArray, CompilerRange.fromValues(3, 21, 3, 26), "-"));
    });
});
