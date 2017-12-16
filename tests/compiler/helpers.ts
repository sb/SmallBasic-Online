import "jasmine";
import { Compilation } from "../../compiler/compilation";
import { Diagnostic, ErrorCode } from "../../compiler/utils/diagnostics";

export function verifyErrors(text: string, ...expected: Diagnostic[]): void {
    const actual = new Compilation(text).diagnostics;

    expected.concat(actual).forEach(error => {
        // Assert that errors can be serializable
        expect(error.toString().length).toBeGreaterThan(0);
    });

    const textLines = text.split(/\r?\n/);
    const serializeErrors = (errors: Diagnostic[]) => errors.map(error => {
        return `
            // ${textLines[error.range.line]}
            // ${Array(error.range.start + 1).join(" ")}${Array(error.range.end - error.range.start + 1).join("^")}
            // ${error.toString()}
            new Diagnostic(${[
                `ErrorCode.${ErrorCode[error.code]}`,
                `{ line: ${error.range.line}, start: ${error.range.start}, end: ${error.range.end} }`,
                ...error.args.map(a => `${JSON.stringify(a)}`)
            ].join(", ")})`;
    }).join(",") + "\n";

    expect(serializeErrors(actual)).toBe(serializeErrors(expected));
}
