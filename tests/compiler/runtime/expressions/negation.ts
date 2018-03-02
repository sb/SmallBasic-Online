import { Diagnostic, ErrorCode } from "../../../../src/compiler/diagnostics";
import "jasmine";
import { verifyRuntimeResult, verifyRuntimeError } from "../../helpers";

describe("Compiler.Runtime.Expressions.Negation", () => {
    it("can negate variables - numbers", () => {
        verifyRuntimeResult(`
TextWindow.WriteLine(-2)`,
            [],
            ["-2"]);
    });

    it("can negate variables - strings", () => {
        verifyRuntimeError(`
x = "a"
TextWindow.WriteLine(-x)`,
            // TextWindow.WriteLine(-x)
            //                      ^^
            // You cannot use the operator '-' with a string value
            new Diagnostic(ErrorCode.CannotUseOperatorWithAString, { line: 2, start: 21, end: 23 }, "-"));
    });

    it("can negate variables - numeric strings", () => {
        verifyRuntimeResult(`
x = "5"
TextWindow.WriteLine(-x)`,
            [],
            ["-5"]);
    });

    it("can negate variables - arrays", () => {
        verifyRuntimeError(`
x[0] = 1
TextWindow.WriteLine(-x)`,
            // TextWindow.WriteLine(-x)
            //                      ^^
            // You cannot use the operator '-' with an array value
            new Diagnostic(ErrorCode.CannotUseOperatorWithAnArray, { line: 2, start: 21, end: 23 }, "-"));
    });
});
