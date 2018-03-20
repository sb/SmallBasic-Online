import "jasmine";
import { verifyRuntimeResult, verifyRuntimeError } from "../../helpers";
import { Diagnostic, ErrorCode } from "../../../../src/compiler/diagnostics";

describe("Compiler.Runtime.Expressions.Multiplication", () => {
    it("computes multiplication - number multiplied by number", () => {
        verifyRuntimeResult(`
TextWindow.WriteLine(3 * 4)`,
            [],
            ["12"]);
    });

    it("computes multiplication - number multiplied by numeric string", () => {
        verifyRuntimeResult(`
TextWindow.WriteLine(4 * "2")`,
            [],
            ["8"]);
    });

    it("computes multiplication - number multiplied by non-numeric string", () => {
        verifyRuntimeError(`
TextWindow.WriteLine(1 * "t")`,
            // TextWindow.WriteLine(1 * "t")
            //                      ^^^^^^^
            // You cannot use the operator '*' with a string value
            new Diagnostic(ErrorCode.CannotUseOperatorWithAString, { line: 1, start: 21, end: 28 }, "*"));
    });

    it("computes multiplication - number multiplied by array * error", () => {
        verifyRuntimeError(`
x[0] = 1
TextWindow.WriteLine(1 * x)`,
            // TextWindow.WriteLine(1 * x)
            //                      ^^^^^
            // You cannot use the operator '*' with an array value
            new Diagnostic(ErrorCode.CannotUseOperatorWithAnArray, { line: 2, start: 21, end: 26 }, "*"));
    });
    
    it("computes multiplication - numeric string multiplied by number", () => {
        verifyRuntimeResult(`
TextWindow.WriteLine("6" * 4)`,
            [],
            ["24"]);
    });

    it("computes multiplication - numeric string multiplied by numeric string", () => {
        verifyRuntimeResult(`
TextWindow.WriteLine("1" * "7")`,
            [],
            ["7"]);
    });

    it("computes multiplication - numeric string multiplied by non-numeric string", () => {
        verifyRuntimeError(`
TextWindow.WriteLine("1" * "t")`,
            // TextWindow.WriteLine("1" * "t")
            //                      ^^^^^^^^^
            // You cannot use the operator '*' with a string value
            new Diagnostic(ErrorCode.CannotUseOperatorWithAString, { line: 1, start: 21, end: 30 }, "*"));
    });

    it("computes multiplication - numeric string multiplied by array * error", () => {
        verifyRuntimeError(`
x[0] = 1
TextWindow.WriteLine("1" * x)`,
            // TextWindow.WriteLine("1" * x)
            //                      ^^^^^^^
            // You cannot use the operator '*' with an array value
            new Diagnostic(ErrorCode.CannotUseOperatorWithAnArray, { line: 2, start: 21, end: 28 }, "*"));
    });
    
    it("computes multiplication - non-numeric string multiplied by number", () => {
        verifyRuntimeError(`
TextWindow.WriteLine("r" * 5)`,
            // TextWindow.WriteLine("r" * 5)
            //                      ^^^^^^^
            // You cannot use the operator '*' with a string value
            new Diagnostic(ErrorCode.CannotUseOperatorWithAString, { line: 1, start: 21, end: 28 }, "*"));
    });

    it("computes multiplication - non-numeric string multiplied by numeric string", () => {
        verifyRuntimeError(`
TextWindow.WriteLine("r" * "4")`,
            // TextWindow.WriteLine("r" * "4")
            //                      ^^^^^^^^^
            // You cannot use the operator '*' with a string value
            new Diagnostic(ErrorCode.CannotUseOperatorWithAString, { line: 1, start: 21, end: 30 }, "*"));
    });

    it("computes multiplication - non-numeric string multiplied by non-numeric string", () => {
        verifyRuntimeError(`
TextWindow.WriteLine("r" * "t")`,
            // TextWindow.WriteLine("r" * "t")
            //                      ^^^^^^^^^
            // You cannot use the operator '*' with a string value
            new Diagnostic(ErrorCode.CannotUseOperatorWithAString, { line: 1, start: 21, end: 30 }, "*"));
    });

    it("computes multiplication - non-numeric string multiplied by array * error", () => {
        verifyRuntimeError(`
x[0] = 1
TextWindow.WriteLine("r" * x)`,
            // TextWindow.WriteLine("r" * x)
            //                      ^^^^^^^
            // You cannot use the operator '*' with a string value
            new Diagnostic(ErrorCode.CannotUseOperatorWithAString, { line: 2, start: 21, end: 28 }, "*"));
    });
    
    it("computes multiplication - array multiplied by number", () => {
        verifyRuntimeError(`
x[0] = 1
TextWindow.WriteLine(x * 5)`,
            // TextWindow.WriteLine(x * 5)
            //                      ^^^^^
            // You cannot use the operator '*' with an array value
            new Diagnostic(ErrorCode.CannotUseOperatorWithAnArray, { line: 2, start: 21, end: 26 }, "*"));
    });

    it("computes multiplication - array multiplied by numeric string", () => {
        verifyRuntimeError(`
x[0] = 1
TextWindow.WriteLine(x * "4")`,
            // TextWindow.WriteLine(x * "4")
            //                      ^^^^^^^
            // You cannot use the operator '*' with an array value
            new Diagnostic(ErrorCode.CannotUseOperatorWithAnArray, { line: 2, start: 21, end: 28 }, "*"));
    });

    it("computes multiplication - array multiplied by non-numeric string", () => {
        verifyRuntimeError(`
x[0] = 1
TextWindow.WriteLine(x * "t")`,
            // TextWindow.WriteLine(x * "t")
            //                      ^^^^^^^
            // You cannot use the operator '*' with an array value
            new Diagnostic(ErrorCode.CannotUseOperatorWithAnArray, { line: 2, start: 21, end: 28 }, "*"));
    });

    it("computes multiplication - array multiplied by array * error", () => {
        verifyRuntimeError(`
x[0] = 1
y[0] = 1
TextWindow.WriteLine(x * y)`,
            // TextWindow.WriteLine(x * y)
            //                      ^^^^^
            // You cannot use the operator '*' with an array value
            new Diagnostic(ErrorCode.CannotUseOperatorWithAnArray, { line: 3, start: 21, end: 26 }, "*"));
    });
});
