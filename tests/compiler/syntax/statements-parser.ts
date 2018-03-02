import "jasmine";
import { verifyCompilationErrors } from "../helpers";
import { Diagnostic, ErrorCode } from "../../../src/compiler/diagnostics";

describe("Compiler.Syntax.StatementsParser", () => {
    it("reports errors on unfinished modules", () => {
        verifyCompilationErrors(`
Sub A`,
            // Sub A
            // ^^^^^
            // Unexpected end of file. I was expecting a command of type 'EndSub'.
            new Diagnostic(ErrorCode.UnexpectedEOF_ExpectingCommand, { line: 1, start: 0, end: 5 }, "EndSub"));
    });

    it("reports errors on defining sub inside another one", () => {
        verifyCompilationErrors(`
Sub A
Sub B
EndSub`,
            // Sub B
            // ^^^^^
            // You cannot define a sub-module inside another sub-module.
            new Diagnostic(ErrorCode.CannotDefineASubInsideAnotherSub, { line: 2, start: 0, end: 5 }));
    });

    it("reports errors on ending sub without starting one", () => {
        verifyCompilationErrors(`
x = 1
EndSub`,
            // EndSub
            // ^^^^^^
            // You cannot write a command of type 'EndSub' without an earlier command of type 'Sub'.
            new Diagnostic(ErrorCode.CannotHaveCommandWithoutPreviousCommand, { line: 2, start: 0, end: 6 }, "EndSub", "Sub"));
    });

    it("reports errors on ElseIf without If", () => {
        verifyCompilationErrors(`
x = 1
ElseIf y Then`,
            // ElseIf y Then
            // ^^^^^^^^^^^^^
            // You cannot write a command of type 'ElseIf' without an earlier command of type 'If'.
            new Diagnostic(ErrorCode.CannotHaveCommandWithoutPreviousCommand, { line: 2, start: 0, end: 13 }, "ElseIf", "If"));
    });

    it("reports errors on Else without If", () => {
        verifyCompilationErrors(`
x = 1
Else`,
            // Else
            // ^^^^
            // You cannot write a command of type 'Else' without an earlier command of type 'If'.
            new Diagnostic(ErrorCode.CannotHaveCommandWithoutPreviousCommand, { line: 2, start: 0, end: 4 }, "Else", "If"));
    });

    it("reports errors on EndIf without If", () => {
        verifyCompilationErrors(`
x = 1
EndIf`,
            // EndIf
            // ^^^^^
            // You cannot write a command of type 'EndIf' without an earlier command of type 'If'.
            new Diagnostic(ErrorCode.CannotHaveCommandWithoutPreviousCommand, { line: 2, start: 0, end: 5 }, "EndIf", "If"));
    });

    it("reports errors on EndFor without For", () => {
        verifyCompilationErrors(`
x = 1
EndFor`,
            // EndFor
            // ^^^^^^
            // You cannot write a command of type 'EndFor' without an earlier command of type 'For'.
            new Diagnostic(ErrorCode.CannotHaveCommandWithoutPreviousCommand, { line: 2, start: 0, end: 6 }, "EndFor", "For"));
    });

    it("reports errors on EndWhile without While", () => {
        verifyCompilationErrors(`
x = 1
EndWhile`,
            // EndWhile
            // ^^^^^^^^
            // You cannot write a command of type 'EndWhile' without an earlier command of type 'While'.
            new Diagnostic(ErrorCode.CannotHaveCommandWithoutPreviousCommand, { line: 2, start: 0, end: 8 }, "EndWhile", "While"));
    });

    it("reports errors on ElseIf After Else", () => {
        verifyCompilationErrors(`
If x Then
    a = 0
Else
    a = 1
ElseIf y Then
    a = 2
EndIf`,
            // ElseIf y Then
            // ^^^^^^^^^^^^^
            // Unexpected command of type 'ElseIf'. I was expecting a command of type 'EndIf'.
            new Diagnostic(ErrorCode.UnexpectedCommand_ExpectingCommand, { line: 5, start: 0, end: 13 }, "ElseIf", "EndIf"),
            // ElseIf y Then
            // ^^^^^^^^^^^^^
            // You cannot write a command of type 'ElseIf' without an earlier command of type 'If'.
            new Diagnostic(ErrorCode.CannotHaveCommandWithoutPreviousCommand, { line: 5, start: 0, end: 13 }, "ElseIf", "If"),
            // EndIf
            // ^^^^^
            // You cannot write a command of type 'EndIf' without an earlier command of type 'If'.
            new Diagnostic(ErrorCode.CannotHaveCommandWithoutPreviousCommand, { line: 7, start: 0, end: 5 }, "EndIf", "If"));
    });
});
