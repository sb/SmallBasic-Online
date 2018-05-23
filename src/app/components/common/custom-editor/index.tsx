import * as React from "react";
import { Diagnostic } from "../../../../compiler/diagnostics";

import "./style.css";
import { provideCompletion, CompilerCompletionItemKind } from "../../../../compiler/services/completion-service";
import { provideHover } from "../../../../compiler/services/hover-service";
import { EditorUtils } from "../../../editor-utils";
import { CompilerRange } from "../../../../compiler/syntax/ranges";

interface CustomEditorProps {
    readOnly: boolean;
    initialValue: string;
}

export class CustomEditor extends React.Component<CustomEditorProps> {
    public editor?: monaco.editor.IStandaloneCodeEditor;
    private editorDiv?: HTMLDivElement;
    private onResize?: () => void;

    private decorations: string[] = [];

    public render(): JSX.Element {
        return <div ref={div => this.editorDiv = div!} style={{ height: "100%", width: "100%" }} />;
    }

    public componentDidMount(): void {
        const options: monaco.editor.IEditorConstructionOptions = {
            language: "sb",
            scrollBeyondLastLine: false,
            readOnly: this.props.readOnly,
            value: this.props.initialValue,
            fontFamily: "Consolas, monospace, Hack",
            fontSize: 18,
            glyphMargin: true,
            minimap: {
                enabled: false
            }
        };

        this.editor = (window as any).monaco.editor.create(this.editorDiv, options);

        monaco.languages.registerCompletionItemProvider("sb", new CompletionService());
        monaco.languages.registerHoverProvider("sb", new HoverService());

        this.onResize = () => {
            this.editor!.layout();
        };

        window.addEventListener("resize", this.onResize);
    }

    public componentWillUnmount(): void {
        window.removeEventListener("resize", this.onResize!);
    }

    public undo(): void {
        this.editor!.trigger("", "undo", "");
    }

    public redo(): void {
        this.editor!.trigger("", "redo", "");
    }

    public setDiagnostics(diagnostics: ReadonlyArray<Diagnostic>): void {
        this.decorations = this.editor!.deltaDecorations(this.decorations, diagnostics.map(diagnostic => {
            return {
                range: EditorUtils.compilerRangeToEditorRange(diagnostic.range),
                options: {
                    className: "wavy-line",
                    glyphMarginClassName: "error-line-glyph"
                }
            };
        }));
    }

    public highlightLine(line: number): void {
        const range = EditorUtils.compilerRangeToEditorRange(CompilerRange.fromValues(line, 0, line, Number.MAX_VALUE));

        this.decorations = this.editor!.deltaDecorations(this.decorations, [{
            range: range,
            options: {
                className: "debugger-line-highlight"
            }
        }]);

        this.editor!.revealLine(range.startLineNumber);
    }
}

class CompletionService implements monaco.languages.CompletionItemProvider {
    public readonly triggerCharacters: string[] = [
        "."
    ];

    public provideCompletionItems(model: monaco.editor.IReadOnlyModel, position: monaco.Position): monaco.languages.CompletionItem[] {
        const line = model.getLineContent(position.lineNumber);
        return provideCompletion(line, EditorUtils.editorPositionToCompilerPosition(position)).map(item => {
            let kind: monaco.languages.CompletionItemKind;
            switch (item.kind) {
                case CompilerCompletionItemKind.Class: kind = monaco.languages.CompletionItemKind.Class; break;
                case CompilerCompletionItemKind.Method: kind = monaco.languages.CompletionItemKind.Method; break;
                case CompilerCompletionItemKind.Property: kind = monaco.languages.CompletionItemKind.Property; break;
                default: throw new Error(`Unrecognized CompilerCompletionItemKind '${CompilerCompletionItemKind[item.kind]}'`);
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

class HoverService implements monaco.languages.HoverProvider {
    public provideHover(model: monaco.editor.IReadOnlyModel, position: monaco.Position): monaco.languages.Hover {
        const result = provideHover(model.getValue(), EditorUtils.editorPositionToCompilerPosition(position));
        if (result) {
            return {
                contents: [result.text],
                range: EditorUtils.compilerRangeToEditorRange(result.range)
            };
        } else {
            return null as any;
        }
    }
}