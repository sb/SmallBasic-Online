import { Compilation } from "../../../../../compiler/compilation";
import { HoverService } from "../../../../../compiler/services/hover-service";
import { EditorUtils } from "../../../../editor-utils";

export class EditorHoverService implements monaco.languages.HoverProvider {
    public provideHover(model: monaco.editor.IReadOnlyModel, position: monaco.Position): monaco.languages.Hover {
        const result = HoverService.provideHover(new Compilation(model.getValue()), EditorUtils.editorPositionToCompilerPosition(position));
        if (result) {
            return {
                contents: result.text,
                range: EditorUtils.compilerRangeToEditorRange(result.range)
            };
        } else {
            return null as any;
        }
    }
}
