/// <reference path="../../../../../node_modules/monaco-editor/monaco.d.ts" />
import { HoverService } from "../../../services/hover";
import "@timkendrick/monaco-editor";

import * as React from "react";

import "./style.css";
import { Diagnostic } from "../../../../compiler/utils/diagnostics";
import { EditorUtils } from "../../../services/utils";
import { CompletionService } from "../../../services/completion";

interface CustomEditorProps {
    readOnly: boolean;
    initialValue: string;
    onChange: (editor: CustomEditor) => void;
}

export class CustomEditor extends React.Component<CustomEditorProps> {
    private onResize: () => void;
    private decorations: string[];
    private editor: monaco.editor.IStandaloneCodeEditor;

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
            minimap: { enabled: false }
        };

        this.editor = (window as any).monaco.editor.create(this.refs["editor"], options);

        this.editor.onDidChangeModelContent(() => {
            this.props.onChange(this);
        });

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

    public getValue(): string {
        return this.editor.getValue();
    }

    public setDiagnostics(diagnostics: ReadonlyArray<Diagnostic>): void {
        this.decorations = this.editor.deltaDecorations(this.decorations, diagnostics.map(diagnostic => {
            return {
                range: EditorUtils.textRangeToEditorRange(diagnostic.range),
                options: {
                    className: "wavy-line"
                }
            };
        }));
    }
}
