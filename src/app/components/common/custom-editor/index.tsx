/// <reference path="../../../../../node_modules/monaco-editor/monaco.d.ts" />
import "@timkendrick/monaco-editor";

import * as React from "react";
import { CompletionService } from "../../../../compiler/services/completion";

interface CustomEditorProps {
    readOnly: boolean;
    initialValue: string;
    onChange: (value: string) => void;
}

export class CustomEditor extends React.Component<CustomEditorProps> {
    private onResize: () => void;
    private editor: monaco.editor.IStandaloneCodeEditor;

    public constructor(props: CustomEditorProps) {
        super(props);
        this.onResize = () => {
            this.editor.layout();
        };
    }

    public render(): JSX.Element {
        return <div ref="editor" style={{ height: "100%", width: "100%" }} />;
    }

    public componentDidMount(): void {
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
            this.props.onChange(this.editor.getValue());
        });

        monaco.languages.registerCompletionItemProvider("sb", new CompletionService());

        window.addEventListener("resize", this.onResize);
    }

    public componentWillUnmount(): void {
        window.removeEventListener("resize", this.onResize);
    }
}
