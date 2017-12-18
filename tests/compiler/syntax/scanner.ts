import "jasmine";
import { verifyErrors } from "../helpers";
import { Diagnostic, ErrorCode } from "../../../src/compiler/utils/diagnostics";

describe(__filename, () => {
    it("reports unterminated string - single", () => {
        verifyErrors(`
x = "name1`,
            // x = "name1
            //     ^^^^^^
            // This string is missing its right double quotes.
            new Diagnostic(ErrorCode.UnterminatedStringLiteral, { line: 1, start: 4, end: 10 }));
    });

    it("reports unterminated string - multiple", () => {
        verifyErrors(`
x = "name1
' Comment line
y = "name2`,
            // x = "name1
            //     ^^^^^^
            // This string is missing its right double quotes.
            new Diagnostic(ErrorCode.UnterminatedStringLiteral, { line: 1, start: 4, end: 10 }),
            // y = "name2
            //     ^^^^^^
            // This string is missing its right double quotes.
            new Diagnostic(ErrorCode.UnterminatedStringLiteral, { line: 3, start: 4, end: 10 }));
    });

    it("reports unsupported characters - single", () => {
        verifyErrors(`
$`,
            // $
            // ^
            // I don't understand this character '$'.
            new Diagnostic(ErrorCode.UnrecognizedCharacter, { line: 1, start: 0, end: 1 }, "$"));
    });

    it("reports unsupported characters - multiple", () => {
        verifyErrors(`
x = ____^
ok = "value $ value"
not_ok = "value" $
& ' Alone`,
            // x = ____^
            //         ^
            // I don't understand this character '^'.
            new Diagnostic(ErrorCode.UnrecognizedCharacter, { line: 1, start: 8, end: 9 }, "^"),
            // not_ok = "value" $
            //                  ^
            // I don't understand this character '$'.
            new Diagnostic(ErrorCode.UnrecognizedCharacter, { line: 3, start: 17, end: 18 }, "$"),
            // & ' Alone
            // ^
            // I don't understand this character '&'.
            new Diagnostic(ErrorCode.UnrecognizedCharacter, { line: 4, start: 0, end: 1 }, "&"));
    });
});
