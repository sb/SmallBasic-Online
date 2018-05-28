import "jasmine";
import { verifyRuntimeResult, verifyRuntimeError } from "../../helpers";
import { Diagnostic, ErrorCode } from "../../../../src/compiler/diagnostics";
import { CompilerRange } from "../../../../src/compiler/syntax/ranges";

describe("Compiler.Runtime.Expressions.Addition", () => {
    it("computes addition - number plus number", () => {
        verifyRuntimeResult(`
TextWindow.WriteLine(1 + 4)`,
            [],
            ["5"]);
    });

    it("computes addition - number plus numeric string", () => {
        verifyRuntimeResult(`
TextWindow.WriteLine(1 + "7")`,
            [],
            ["8"]);
    });

    it("computes addition - number plus non-numeric string", () => {
        verifyRuntimeResult(`
TextWindow.WriteLine(1 + "t")`,
            [],
            ["1t"]);
    });

    it("computes addition - number plus array - error", () => {
        verifyRuntimeError(`
x[0] = 1
TextWindow.WriteLine(1 + x)`,
            // TextWindow.WriteLine(1 + x)
            //                      ^^^^^
            // You cannot use the operator '+' with an array value
            new Diagnostic(ErrorCode.CannotUseOperatorWithAnArray, CompilerRange.fromValues(2, 21, 2, 26), "+"));
    });
    
    it("computes addition - numeric string plus number", () => {
        verifyRuntimeResult(`
TextWindow.WriteLine("1" + 4)`,
            [],
            ["5"]);
    });

    it("computes addition - numeric string plus numeric string", () => {
        verifyRuntimeResult(`
TextWindow.WriteLine("1" + "7")`,
            [],
            ["8"]);
    });

    it("computes addition - numeric string plus non-numeric string", () => {
        verifyRuntimeResult(`
TextWindow.WriteLine("1" + "t")`,
            [],
            ["1t"]);
    });

    it("computes addition - numeric string plus array - error", () => {
        verifyRuntimeError(`
x[0] = 1
TextWindow.WriteLine("1" + x)`,
            // TextWindow.WriteLine("1" + x)
            //                      ^^^^^^^
            // You cannot use the operator '+' with an array value
            new Diagnostic(ErrorCode.CannotUseOperatorWithAnArray, CompilerRange.fromValues(2, 21, 2, 28), "+"));
    });
    
    it("computes addition - non-numeric string plus number", () => {
        verifyRuntimeResult(`
TextWindow.WriteLine("r" + 5)`,
            [],
            ["r5"]);
    });

    it("computes addition - non-numeric string plus numeric string", () => {
        verifyRuntimeResult(`
TextWindow.WriteLine("r" + "4")`,
            [],
            ["r4"]);
    });

    it("computes addition - non-numeric string plus non-numeric string", () => {
        verifyRuntimeResult(`
TextWindow.WriteLine("r" + "t")`,
            [],
            ["rt"]);
    });

    it("computes addition - non-numeric string plus array - error", () => {
        verifyRuntimeError(`
x[0] = 1
TextWindow.WriteLine("r" + x)`,
            // TextWindow.WriteLine("r" + x)
            //                      ^^^^^^^
            // You cannot use the operator '+' with an array value
            new Diagnostic(ErrorCode.CannotUseOperatorWithAnArray, CompilerRange.fromValues(2, 21, 2, 28), "+"));
    });
    
    it("computes addition - array plus number", () => {
        verifyRuntimeError(`
x[0] = 1
TextWindow.WriteLine(x + 5)`,
            // TextWindow.WriteLine(x + 5)
            //                      ^^^^^
            // You cannot use the operator '+' with an array value
            new Diagnostic(ErrorCode.CannotUseOperatorWithAnArray, CompilerRange.fromValues(2, 21, 2, 26), "+"));
    });

    it("computes addition - array plus numeric string", () => {
        verifyRuntimeError(`
x[0] = 1
TextWindow.WriteLine(x + "4")`,
            // TextWindow.WriteLine(x + "4")
            //                      ^^^^^^^
            // You cannot use the operator '+' with an array value
            new Diagnostic(ErrorCode.CannotUseOperatorWithAnArray, CompilerRange.fromValues(2, 21, 2, 28), "+"));
    });

    it("computes addition - array plus non-numeric string", () => {
        verifyRuntimeError(`
x[0] = 1
TextWindow.WriteLine(x + "t")`,
            // TextWindow.WriteLine(x + "t")
            //                      ^^^^^^^
            // You cannot use the operator '+' with an array value
            new Diagnostic(ErrorCode.CannotUseOperatorWithAnArray, CompilerRange.fromValues(2, 21, 2, 28), "+"));
    });

    it("computes addition - array plus array - error", () => {
        verifyRuntimeError(`
x[0] = 1
y[0] = 1
TextWindow.WriteLine(x + y)`,
            // TextWindow.WriteLine(x + y)
            //                      ^^^^^
            // You cannot use the operator '+' with an array value
            new Diagnostic(ErrorCode.CannotUseOperatorWithAnArray, CompilerRange.fromValues(3, 21, 3, 26), "+"));
    });
});
