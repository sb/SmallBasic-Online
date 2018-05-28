import { CompilerRange, CompilerPosition } from "../compiler/syntax/ranges";

export module EditorUtils {
    export function compilerPositionToEditorPosition(position: CompilerPosition): monaco.Position {
        return new monaco.Position(position.line + 1, position.column + 1);
    }

    export function editorPositionToCompilerPosition(position: monaco.Position): CompilerPosition {
        return new CompilerPosition(position.lineNumber - 1, position.column - 1);
    }

    export function compilerRangeToEditorRange(range: CompilerRange): monaco.Range {
        return monaco.Range.fromPositions(
            EditorUtils.compilerPositionToEditorPosition(range.start),
            EditorUtils.compilerPositionToEditorPosition(range.end));
    }

    export function editorRangeToCompilerRange(range: monaco.Range): CompilerRange {
        return CompilerRange.fromPositions(
            EditorUtils.editorPositionToCompilerPosition(range.getStartPosition()),
            EditorUtils.editorPositionToCompilerPosition(range.getEndPosition()));
    }
}
