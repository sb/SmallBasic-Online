import "jasmine";
import { verifyCompilationErrors } from "../helpers";
import { Diagnostic, ErrorCode } from "../../../src/compiler/utils/diagnostics";
import { CompilerRange } from "../../../src/compiler/syntax/ranges";

describe("Compiler.Syntax.Scanner", () => {
    it("reports unterminated string - single", () => {
        verifyCompilationErrors(`
x = "name1`,
            // x = "name1
            //     ^^^^^^
            // This string is missing its right double quotes.
            new Diagnostic(ErrorCode.UnterminatedStringLiteral, CompilerRange.fromValues(1, 4, 1, 10)));
    });

    it("reports unterminated string - multiple", () => {
        verifyCompilationErrors(`
x = "name1
' Comment line
y = "name2`,
            // x = "name1
            //     ^^^^^^
            // This string is missing its right double quotes.
            new Diagnostic(ErrorCode.UnterminatedStringLiteral, CompilerRange.fromValues(1, 4, 1, 10)),
            // y = "name2
            //     ^^^^^^
            // This string is missing its right double quotes.
            new Diagnostic(ErrorCode.UnterminatedStringLiteral, CompilerRange.fromValues(3, 4, 3, 10)));
    });

    it("reports unsupported characters - single", () => {
        verifyCompilationErrors(`
$`,
            // $
            // ^
            // I don't understand this character '$'.
            new Diagnostic(ErrorCode.UnrecognizedCharacter, CompilerRange.fromValues(1, 0, 1, 1), "$"));
    });

    it("reports unsupported characters - multiple", () => {
        verifyCompilationErrors(`
x = ____^
ok = "value $ value"
not_ok = "value" $
& ' Alone`,
            // x = ____^
            //         ^
            // I don't understand this character '^'.
            new Diagnostic(ErrorCode.UnrecognizedCharacter, CompilerRange.fromValues(1, 8, 1, 9), "^"),
            // not_ok = "value" $
            //                  ^
            // I don't understand this character '$'.
            new Diagnostic(ErrorCode.UnrecognizedCharacter, CompilerRange.fromValues(3, 17, 3, 18), "$"),
            // & ' Alone
            // ^
            // I don't understand this character '&'.
            new Diagnostic(ErrorCode.UnrecognizedCharacter, CompilerRange.fromValues(4, 0, 4, 1), "&"));
    });

    it("prints an error when parsing a non-supported character in a string (escape character)", () => {
        verifyCompilationErrors(`
TextWindow.WriteLine("${String.fromCharCode(27)}")`,
            // TextWindow.WriteLine(" ")
            //                       ^
            // I don't understand this character '\u001b'.
            new Diagnostic(ErrorCode.UnrecognizedCharacter, CompilerRange.fromValues(1, 22, 1, 22), "\u001b"));
    });
});
