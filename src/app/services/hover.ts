import { Compilation } from "../../compiler/compilation";
import { EditorUtils } from "./utils";

export class HoverService implements monaco.languages.HoverProvider {
    public provideHover(model: monaco.editor.IReadOnlyModel, position: monaco.Position): monaco.languages.Hover {
        const compilation = new Compilation(model.getValue());

        for (let i = 0; i < compilation.diagnostics.length; i++) {
            const diagnostic = compilation.diagnostics[i];

            if (EditorUtils.isPositionInTextRange(position, diagnostic.range)) {
                return {
                    range: EditorUtils.textRangeToEditorRange(diagnostic.range),
                    contents: [diagnostic.toString()]
                };
            }
        }

        return <any>null;
    }
}
