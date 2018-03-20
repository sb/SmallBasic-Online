import "jasmine";
import { verifyCompilationErrors } from "../helpers";
import { Diagnostic, ErrorCode } from "../../../src/compiler/diagnostics";

describe("Compiler.Binding.ModuleBinder", () => {
    it("reports sub-modules with duplicate names", () => {
        verifyCompilationErrors(`
Sub x
EndSub

Sub y
EndSub

Sub x
EndSub`,
            // Sub x
            //     ^
            // Another sub-module with the same name 'x' is already defined.
            new Diagnostic(ErrorCode.TwoSubModulesWithTheSameName, { line: 7, start: 4, end: 5 }, "x"));
    });
});
