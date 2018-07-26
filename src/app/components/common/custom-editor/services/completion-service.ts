import { CompletionService } from "../../../../../compiler/services/completion-service";
import { Compilation } from "../../../../../compiler/compilation";
import { EditorUtils } from "../../../../editor-utils";

export class EditorCompletionService implements monaco.languages.CompletionItemProvider {
    public readonly triggerCharacters: string[] = [
        "."
    ];

    public provideCompletionItems(model: monaco.editor.IReadOnlyModel, position: monaco.Position): monaco.languages.CompletionItem[] {
        return CompletionService.provideCompletion(new Compilation(model.getValue()), EditorUtils.editorPositionToCompilerPosition(position)).map(item => {
            let kind: monaco.languages.CompletionItemKind;
            switch (item.kind) {
                case CompletionService.ResultKind.Class: kind = monaco.languages.CompletionItemKind.Class; break;
                case CompletionService.ResultKind.Method: kind = monaco.languages.CompletionItemKind.Method; break;
                case CompletionService.ResultKind.Property: kind = monaco.languages.CompletionItemKind.Property; break;
                default: throw new Error(`Unrecognized CompletionService.CompletionItemKind '${CompletionService.ResultKind[item.kind]}'`);
            }

            return {
                label: item.title,
                kind: kind,
                detail: item.description,
                insertText: item.title
            };
        });
    }
}
