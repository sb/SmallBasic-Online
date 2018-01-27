import { HoverService } from "../../../services/hover";
import * as React from "react";
import { Diagnostic } from "../../../../compiler/utils/diagnostics";
import { EditorUtils } from "../../../services/utils";
import { CompletionService } from "../../../services/completion";

import "./style.css";

interface CustomEditorProps {
    readOnly: boolean;
    initialValue: string;
}

export class CustomEditor extends React.Component<CustomEditorProps> {
    private onResize: () => void;
    private decorations: string[];

    public editor: monaco.editor.IStandaloneCodeEditor;

    public render(): JSX.Element {
        return <div ref="editor" style={{ height: "100%", width: "100%" }} />;
    }

    public componentDidMount(): void {
        this.decorations = [];

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

        this.editor = (window as any).monaco.editor.create(this.refs["editor"], options);

        monaco.languages.registerCompletionItemProvider("sb", new CompletionService());
        monaco.languages.registerHoverProvider("sb", new HoverService());

        this.onResize = () => {
            this.editor.layout();
        };

        window.addEventListener("resize", this.onResize);
    }

    public componentWillUnmount(): void {
        window.removeEventListener("resize", this.onResize);
    }

    public undo(): void {
        this.editor.trigger("", "undo", "");
    }

    public redo(): void {
        this.editor.trigger("", "redo", "");
    }

    public setDiagnostics(diagnostics: ReadonlyArray<Diagnostic>): void {
        this.decorations = this.editor.deltaDecorations(this.decorations, diagnostics.map(diagnostic => {
            return {
                range: EditorUtils.textRangeToEditorRange(diagnostic.range),
                options: {
                    className: "wavy-line",
                    glyphMarginClassName: "error-line-glyph"
                }
            };
        }));
    }
}
