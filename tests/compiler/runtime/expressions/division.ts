import "jasmine";
import { verifyRuntimeResult, verifyRuntimeError } from "../../helpers";
import { Diagnostic, ErrorCode } from "../../../../src/compiler/diagnostics";

describe("Compiler.Runtime.Expressions.Division", () => {
    it("errors on division by zero", () => {
        verifyRuntimeError(`
TextWindow.WriteLine(4 / 0)`,
            // TextWindow.WriteLine(4 / 0)
            //                      ^^^^^
            // You cannot divide by zero. Please consider checking the divisor before dividing.
            new Diagnostic(ErrorCode.CannotDivideByZero, { line: 1, start: 21, end: 26 }));
    });

    it("computes division - number divided by number", () => {
        verifyRuntimeResult(`
TextWindow.WriteLine(8 / 4)`,
            [],
            ["2"]);
    });

    it("computes division - number divided by numeric string", () => {
        verifyRuntimeResult(`
TextWindow.WriteLine(4 / "2")`,
            [],
            ["2"]);
    });

    it("computes division - number divided by non-numeric string", () => {
        verifyRuntimeError(`
TextWindow.WriteLine(1 / "t")`,
            // TextWindow.WriteLine(1 / "t")
            //                      ^^^^^^^
            // You cannot use the operator '/' with a string value
            new Diagnostic(ErrorCode.CannotUseOperatorWithAString, { line: 1, start: 21, end: 28 }, "/"));
    });

    it("computes division - number divided by array / error", () => {
        verifyRuntimeError(`
x[0] = 1
TextWindow.WriteLine(1 / x)`,
            // TextWindow.WriteLine(1 / x)
            //                      ^^^^^
            // You cannot use the operator '/' with an array value
            new Diagnostic(ErrorCode.CannotUseOperatorWithAnArray, { line: 2, start: 21, end: 26 }, "/"));
    });

    it("computes division - numeric string divided by number", () => {
        verifyRuntimeResult(`
TextWindow.WriteLine("6" / 4)`,
            [],
            ["1.5"]);
    });

    it("computes division - numeric string divided by numeric string", () => {
        verifyRuntimeResult(`
TextWindow.WriteLine("14" / "7")`,
            [],
            ["2"]);
    });

    it("computes division - numeric string divided by non-numeric string", () => {
        verifyRuntimeError(`
TextWindow.WriteLine("1" / "t")`,
            // TextWindow.WriteLine("1" / "t")
            //                      ^^^^^^^^^
            // You cannot use the operator '/' with a string value
            new Diagnostic(ErrorCode.CannotUseOperatorWithAString, { line: 1, start: 21, end: 30 }, "/"));
    });

    it("computes division - numeric string divided by array / error", () => {
        verifyRuntimeError(`
x[0] = 1
TextWindow.WriteLine("1" / x)`,
            // TextWindow.WriteLine("1" / x)
            //                      ^^^^^^^
            // You cannot use the operator '/' with an array value
            new Diagnostic(ErrorCode.CannotUseOperatorWithAnArray, { line: 2, start: 21, end: 28 }, "/"));
    });

    it("computes division - non-numeric string divided by number", () => {
        verifyRuntimeError(`
TextWindow.WriteLine("r" / 5)`,
            // TextWindow.WriteLine("r" / 5)
            //                      ^^^^^^^
            // You cannot use the operator '/' with a string value
            new Diagnostic(ErrorCode.CannotUseOperatorWithAString, { line: 1, start: 21, end: 28 }, "/"));
    });

    it("computes division - non-numeric string divided by numeric string", () => {
        verifyRuntimeError(`
TextWindow.WriteLine("r" / "4")`,
            // TextWindow.WriteLine("r" / "4")
            //                      ^^^^^^^^^
            // You cannot use the operator '/' with a string value
            new Diagnostic(ErrorCode.CannotUseOperatorWithAString, { line: 1, start: 21, end: 30 }, "/"));
    });

    it("computes division - non-numeric string divided by non-numeric string", () => {
        verifyRuntimeError(`
TextWindow.WriteLine("r" / "t")`,
            // TextWindow.WriteLine("r" / "t")
            //                      ^^^^^^^^^
            // You cannot use the operator '/' with a string value
            new Diagnostic(ErrorCode.CannotUseOperatorWithAString, { line: 1, start: 21, end: 30 }, "/"));
    });

    it("computes division - non-numeric string divided by array / error", () => {
        verifyRuntimeError(`
x[0] = 1
TextWindow.WriteLine("r" / x)`,
            // TextWindow.WriteLine("r" / x)
            //                      ^^^^^^^
            // You cannot use the operator '/' with a string value
            new Diagnostic(ErrorCode.CannotUseOperatorWithAString, { line: 2, start: 21, end: 28 }, "/"));
    });

    it("computes division - array divided by number", () => {
        verifyRuntimeError(`
x[0] = 1
TextWindow.WriteLine(x / 5)`,
            // TextWindow.WriteLine(x / 5)
            //                      ^^^^^
            // You cannot use the operator '/' with an array value
            new Diagnostic(ErrorCode.CannotUseOperatorWithAnArray, { line: 2, start: 21, end: 26 }, "/"));
    });

    it("computes division - array divided by numeric string", () => {
        verifyRuntimeError(`
x[0] = 1
TextWindow.WriteLine(x / "4")`,
            // TextWindow.WriteLine(x / "4")
            //                      ^^^^^^^
            // You cannot use the operator '/' with an array value
            new Diagnostic(ErrorCode.CannotUseOperatorWithAnArray, { line: 2, start: 21, end: 28 }, "/"));
    });

    it("computes division - array divided by non-numeric string", () => {
        verifyRuntimeError(`
x[0] = 1
TextWindow.WriteLine(x / "t")`,
            // TextWindow.WriteLine(x / "t")
            //                      ^^^^^^^
            // You cannot use the operator '/' with an array value
            new Diagnostic(ErrorCode.CannotUseOperatorWithAnArray, { line: 2, start: 21, end: 28 }, "/"));
    });

    it("computes division - array divided by array / error", () => {
        verifyRuntimeError(`
x[0] = 1
y[0] = 1
TextWindow.WriteLine(x / y)`,
            // TextWindow.WriteLine(x / y)
            //                      ^^^^^
            // You cannot use the operator '/' with an array value
            new Diagnostic(ErrorCode.CannotUseOperatorWithAnArray, { line: 3, start: 21, end: 26 }, "/"));
    });
});
