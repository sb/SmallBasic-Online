import { TextRange } from "../../compiler/syntax/nodes/syntax-nodes";

export module EditorUtils {
    export function textRangeToEditorRange(range: TextRange): monaco.Range {
        return new monaco.Range(range.line + 1, range.start + 1, range.line + 1, range.end + 1);
    }

    export function isPositionInTextRange(position: monaco.Position, range: TextRange): boolean {
        return range.line + 1 === position.lineNumber
            && range.start + 1 <= position.column
            && position.column <= range.end + 1;
    }
}
