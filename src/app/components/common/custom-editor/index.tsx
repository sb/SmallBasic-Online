/// <reference path="../../../../../node_modules/monaco-editor/monaco.d.ts" />

import "@timkendrick/monaco-editor";
import * as React from "react";

declare module window {
    const monaco: {
        editor: {
            create(domElement: HTMLElement, options?: monaco.editor.IEditorConstructionOptions, override?: monaco.editor.IEditorOverrideServices): monaco.editor.IStandaloneCodeEditor;
        }
    };
}

interface CustomEditorProps {
    readOnly: boolean;
    initialValue: string;
    onChange: (value: string) => void;
}

declare module window {
    const require: any;
}

export class CustomEditor extends React.Component<CustomEditorProps> {
    private _editor: monaco.editor.IStandaloneCodeEditor;

    public render(): JSX.Element {
        return <div ref="editor" style={{
            height: "100%",
            width: "100%"
        }} />;
    }

    public get editor(): monaco.editor.IStandaloneCodeEditor {
        return this._editor;
    }

    public componentDidMount(): void {
        this._editor = window.monaco.editor.create(this.refs["editor"] as HTMLElement, {
            language: "sb",
            scrollBeyondLastLine: false,
            readOnly: this.props.readOnly,
            value: this.props.initialValue,
            fontFamily: "Consolas, monospace, Hack",
            fontSize: 18,
            minimap: { enabled: false }
        });

        this._editor.onDidChangeModelContent(() => {
            this.props.onChange(this._editor.getValue());
        });

        monaco.languages.registerCompletionItemProvider("sb", {
            provideCompletionItems: () => {
                return [
                    {
                        label: "option 1",
                        kind: monaco.languages.CompletionItemKind.Function,
                        documentation: "Description 1",
                        insertText: `option1()`
                    },
                    {
                        label: "option 2",
                        kind: monaco.languages.CompletionItemKind.Field,
                        documentation: "Description 2",
                        insertText: `option2()`
                    }
                ];
            }
        });
    }
}
