export interface TextRange {
    readonly line: number;
    readonly start: number;
    readonly end: number;
}

export abstract class BaseSyntaxNode {
    protected combineRanges(first: TextRange, last: TextRange): TextRange {
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
