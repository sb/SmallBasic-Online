import { detect } from "detect-browser";
import * as React from "react";
import { Diagnostic } from "../../../../compiler/utils/diagnostics";
import { EditorUtils } from "../../../editor-utils";
import { CompilerRange } from "../../../../compiler/syntax/ranges";

import "./styles/style.css";
import "./styles/monaco-override.css";
import { EditorCompletionService } from "./services/completion-service";
import { EditorHoverService } from "./services/hover-service";

interface CustomEditorProps {
    readOnly: boolean;
    initialValue: string;
}

// TODO: review and fix for all browsers
const browser = detect();
let displayNewStyle = false;
switch (browser && browser.name) {
    case "chrome":
    case "firefox":
        displayNewStyle = true;
        break;
}

monaco.languages.registerCompletionItemProvider("sb", new EditorCompletionService());
monaco.languages.registerHoverProvider("sb", new EditorHoverService());

export class CustomEditor extends React.Component<CustomEditorProps> {
    public editor?: monaco.editor.IStandaloneCodeEditor;
    private editorDiv?: HTMLDivElement;
    private onResize?: () => void;

    private decorations: string[] = [];

    public render(): JSX.Element {
        return <div
            className={displayNewStyle ? "new-style" : ""}
            ref={div => this.editorDiv = div!}
            style={{ height: "100%", width: "100%" }} />;
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

        this.onResize = () => {
            this.editor!.layout();
        };

        window.addEventListener("resize", this.onResize);
    }

    public componentWillUnmount(): void {
        this.editor!.dispose();
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
