import "jasmine";
import { verifyRuntimeResult, verifyRuntimeError } from "../../helpers";
import { Diagnostic, ErrorCode } from "../../../../src/compiler/diagnostics";

describe("Compiler.Runtime.Libraries.Stack", () => {
    it("can push values and get counts", () => {
        verifyRuntimeResult(`
TextWindow.WriteLine(Stack.GetCount("x"))
TextWindow.WriteLine(Stack.GetCount("y"))
Stack.PushValue("x", "first")
TextWindow.WriteLine(Stack.GetCount("x"))
TextWindow.WriteLine(Stack.GetCount("y"))
Stack.PushValue("x", "second")
Stack.PushValue("y", "other")
TextWindow.WriteLine(Stack.GetCount("x"))
TextWindow.WriteLine(Stack.GetCount("y"))`,
            [],
            [
                "0",
                "0",
                "1",
                "0",
                "2",
                "1"
            ]);
    });

    it("can push pop values in correct order", () => {
        verifyRuntimeResult(`
Stack.PushValue("x", "first")
Stack.PushValue("x", "second")
TextWindow.WriteLine(Stack.PopValue("x"))
TextWindow.WriteLine(Stack.PopValue("x"))`,
            [],
            [
                "second",
                "first"
            ]);
    });

    it("popping an empty stack produces an error", () => {
        verifyRuntimeError(`
Stack.PopValue("x")`,
            // Stack.PopValue("x")
            // ^^^^^^^^^^^^^^^^^^^
            // This stack has no elements to be popped
            new Diagnostic(ErrorCode.PoppingAnEmptyStack, { line: 1, start: 0, end: 19 }));
    });
});
