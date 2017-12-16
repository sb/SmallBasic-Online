import "jasmine";
import { verifyErrors } from "../helpers";
import { Diagnostic, ErrorCode } from "../../../compiler/utils/diagnostics";

describe(__filename, () => {
    it("reports errors on unfinished modules", () => {
        verifyErrors(`
Sub A`,
            // Sub A
            // ^^^^^
            // Unexpected end of file. I was expecting a command of type 'EndSub command'.
            new Diagnostic(ErrorCode.Error_UnexpectedEOF_ExpectingCommand, { line: 1, start: 0, end: 5 }, "EndSub command"));
    });

    it("reports errors on defining sub inside another one", () => {
        verifyErrors(`
Sub A
Sub B
EndSub`,
            // Sub B
            // ^^^^^
            // You cannot define a submodule inside another submodule.
            new Diagnostic(ErrorCode.Error_CannotDefineASubInsideAnotherSub, { line: 2, start: 0, end: 5 }));
    });

    it("reports errors on ending sub without starting one", () => {
        verifyErrors(`
x = 1
EndSub`,
            // EndSub
            // ^^^^^^
            // You cannot write 'EndSub command' without an earlier 'Sub command'.
            new Diagnostic(ErrorCode.Error_CannotHaveCommandWithoutPreviousCommand, { line: 2, start: 0, end: 6 }, "EndSub command", "Sub command"));
    });

    it("reports errors on ElseIf without If", () => {
        verifyErrors(`
x = 1
ElseIf y Then`,
            // ElseIf y Then
            // ^^^^^^^^^^^^^
            // You cannot write 'ElseIf command' without an earlier 'If command'.
            new Diagnostic(ErrorCode.Error_CannotHaveCommandWithoutPreviousCommand, { line: 2, start: 0, end: 13 }, "ElseIf command", "If command"));
    });

    it("reports errors on Else without If", () => {
        verifyErrors(`
x = 1
Else`,
            // Else
            // ^^^^
            // You cannot write 'Else command' without an earlier 'If command'.
            new Diagnostic(ErrorCode.Error_CannotHaveCommandWithoutPreviousCommand, { line: 2, start: 0, end: 4 }, "Else command", "If command"));
    });

    it("reports errors on EndIf without If", () => {
        verifyErrors(`
x = 1
EndIf`,
            // EndIf
            // ^^^^^
            // You cannot write 'EndIf command' without an earlier 'If command'.
            new Diagnostic(ErrorCode.Error_CannotHaveCommandWithoutPreviousCommand, { line: 2, start: 0, end: 5 }, "EndIf command", "If command"));
    });

    it("reports errors on EndFor without For", () => {
        verifyErrors(`
x = 1
EndFor`,
            // EndFor
            // ^^^^^^
            // You cannot write 'EndFor command' without an earlier 'For command'.
            new Diagnostic(ErrorCode.Error_CannotHaveCommandWithoutPreviousCommand, { line: 2, start: 0, end: 6 }, "EndFor command", "For command"));
    });

    it("reports errors on EndWhile without While", () => {
        verifyErrors(`
x = 1
EndWhile`,
            // EndWhile
            // ^^^^^^^^
            // You cannot write 'EndWhile command' without an earlier 'While command'.
            new Diagnostic(ErrorCode.Error_CannotHaveCommandWithoutPreviousCommand, { line: 2, start: 0, end: 8 }, "EndWhile command", "While command"));
    });

    it("reports errors on ElseIf After Else", () => {
        verifyErrors(`
If x Then
    a = 0
Else
    a = 1
ElseIf y Then
    a = 2
EndIf`,
            // ElseIf y Then
            // ^^^^^^^^^^^^^
            // Unexpected command of type 'ElseIf command'. I was expecting a command of type 'EndIf command'.
            new Diagnostic(ErrorCode.Error_UnexpectedCommand_ExpectingCommand, { line: 5, start: 0, end: 13 }, "ElseIf command", "EndIf command"),
            // ElseIf y Then
            // ^^^^^^^^^^^^^
            // You cannot write 'ElseIf command' without an earlier 'If command'.
            new Diagnostic(ErrorCode.Error_CannotHaveCommandWithoutPreviousCommand, { line: 5, start: 0, end: 13 }, "ElseIf command", "If command"),
            // EndIf
            // ^^^^^
            // You cannot write 'EndIf command' without an earlier 'If command'.
            new Diagnostic(ErrorCode.Error_CannotHaveCommandWithoutPreviousCommand, { line: 7, start: 0, end: 5 }, "EndIf command", "If command"));
    });
});
