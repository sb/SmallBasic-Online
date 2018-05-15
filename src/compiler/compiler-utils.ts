import { TextRange } from "./syntax/nodes/syntax-nodes";

export module CompilerUtils {
    export function formatString(template: string, args: ReadonlyArray<string>): string {
        return template.replace(/{[0-9]+}/g, match => args[parseInt(match.replace(/^{/, "").replace(/}$/, ""))]);
    }

    export function combineRanges(first: TextRange, last: TextRange): TextRange {
        if (first.line !== last.line) {
            throw new Error(`First and last lines must match. Found '${first.line}' and '${last.line}'`);
        }

        return {
            line: first.line,
            start: first.start,
            end: last.end
        };
    }
}
