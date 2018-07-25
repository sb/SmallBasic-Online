import { CompilerRange, CompilerPosition } from "../compiler/syntax/ranges";
import { TextWindowColor } from "../compiler/runtime/libraries/text-window";

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

    export function textWindowColorToCssColor(color: TextWindowColor): string {
        switch (color) {
            case TextWindowColor.Black: return "rgb(0, 0, 0)";
            case TextWindowColor.DarkBlue: return "rgb(0, 0, 128)";
            case TextWindowColor.DarkGreen: return "rgb(0, 128, 0)";
            case TextWindowColor.DarkCyan: return "rgb(0, 128, 128)";
            case TextWindowColor.DarkRed: return "rgb(128, 0, 0)";
            case TextWindowColor.DarkMagenta: return "rgb(128, 0, 128)";
            case TextWindowColor.DarkYellow: return "rgb(128, 128, 0)";
            case TextWindowColor.Gray: return "rgb(128, 128, 128)";
            case TextWindowColor.DarkGray: return "rgb(64, 64, 64)";
            case TextWindowColor.Blue: return "rgb(0, 0, 255)";
            case TextWindowColor.Green: return "rgb(0, 255, 0)";
            case TextWindowColor.Cyan: return "rgb(0, 255, 255)";
            case TextWindowColor.Red: return "rgb(255, 0, 0)";
            case TextWindowColor.Magenta: return "rgb(255, 0, 255)";
            case TextWindowColor.Yellow: return "rgb(255, 255, 0)";
            case TextWindowColor.White: return "rgb(255, 255, 255)";
        }
    }
}
