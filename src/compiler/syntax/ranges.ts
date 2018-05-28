export class CompilerPosition {
    public constructor(
        public readonly line: number,
        public readonly column: number) {
    }

    public equals(position: CompilerPosition): boolean {
        return this.line === position.line && this.column === position.column;
    }

    public before(position: CompilerPosition): boolean {
        if (this.line > position.line) return false;
        if (this.line < position.line) return true;
        return this.column < position.column;
    }

    public after(position: CompilerPosition): boolean {
        if (this.line < position.line) return false;
        if (this.line > position.line) return true;
        return this.column > position.column;
    }
}

export class CompilerRange {
    private constructor(
        public readonly start: CompilerPosition,
        public readonly end: CompilerPosition) {
    }

    public static fromValues(startLine: number, startColumn: number, endLine: number, endColumn: number): CompilerRange {
        return new CompilerRange(
            new CompilerPosition(startLine, startColumn),
            new CompilerPosition(endLine, endColumn));
    }

    public static fromPositions(start: CompilerPosition, end: CompilerPosition): CompilerRange {
        return new CompilerRange(start, end);
    }

    public static combine(start: CompilerRange, end: CompilerRange): CompilerRange {
        return new CompilerRange(start.start, end.end);
    }

    public containsPosition(position: CompilerPosition): boolean {
        return (this.start.before(position) || this.start.equals(position))
            && (position.before(this.end) || position.equals(this.end));
    }

    public containsRange(range: CompilerRange): boolean {
        return this.containsPosition(range.start) && this.containsPosition(range.end);
    }
}
