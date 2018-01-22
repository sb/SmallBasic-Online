import { Compilation } from "../../../compiler/compilation";
import { ToolbarButton } from "../common/toolbar-button";
import { ToolbarDivider } from "../common/toolbar-divider";
import { CustomEditor } from "../common/custom-editor";
import * as React from "react";
import { EditorResources } from "../../strings/editor";
import { Documentation } from "./documentation";
import { MasterLayout } from "../common/master-layout";
import { Modal } from "../common/modal";

const NewIcon = require("./images/new.png");
const CutIcon = require("./images/cut.png");
const CopyIcon = require("./images/copy.png");
const PasteIcon = require("./images/paste.png");
const UndoIcon = require("./images/undo.png");
const RedoIcon = require("./images/redo.png");
const RunIcon = require("./images/run.png");

interface EditorComponentProps {
}

interface EditorComponentState {
    compilation: Compilation;
}

export class EditorComponent extends React.Component<EditorComponentProps, EditorComponentState> {
    private editor: CustomEditor;
    private clipboard: string | undefined;

    public constructor(props: EditorComponentProps) {
        super(props);
        this.state = {
            compilation: new Compilation([
                `' A new Program!`,
                `TextWindow.WriteLine("Hello World!")`
            ].join("\n"))
        };
    }

    public render(): JSX.Element {
        return (
            <div>
                <MasterLayout
                    toolbar={[
                        <ToolbarButton
                            title={EditorResources.ToolbarButton_New_Title}
                            description={EditorResources.ToolbarButton_New_Description}
                            image={NewIcon}
                            onClick={() => (this.refs["new-modal"] as Modal).open()} />,
                        <ToolbarDivider />,
                        <ToolbarButton
                            title={EditorResources.ToolbarButton_Cut_Title}
                            description={EditorResources.ToolbarButton_Cut_Description}
                            image={CutIcon}
                            onClick={this.onCut.bind(this)} />,
                        <ToolbarButton
                            title={EditorResources.ToolbarButton_Copy_Title}
                            description={EditorResources.ToolbarButton_Copy_Description}
                            image={CopyIcon}
                            onClick={this.onCopy.bind(this)} />,
                        <ToolbarButton
                            title={EditorResources.ToolbarButton_Paste_Title}
                            description={EditorResources.ToolbarButton_Paste_Description}
                            image={PasteIcon}
                            onClick={this.onPaste.bind(this)} />,
                        <ToolbarDivider />,
                        <ToolbarButton
                            title={EditorResources.ToolbarButton_Undo_Title}
                            description={EditorResources.ToolbarButton_Undo_Description}
                            image={UndoIcon}
                            onClick={() => this.editor.undo()} />,
                        <ToolbarButton
                            title={EditorResources.ToolbarButton_Redo_Title}
                            description={EditorResources.ToolbarButton_Redo_Description}
                            image={RedoIcon}
                            onClick={() => this.editor.redo()} />,
                        <ToolbarDivider />,
                        <ToolbarButton
                            title={EditorResources.ToolbarButton_Run_Title}
                            description={EditorResources.ToolbarButton_Run_Description}
                            image={RunIcon}
                            disabled={this.state.compilation.diagnostics.length > 0} />
                    ]}
                    leftContainer={
                        <CustomEditor
                            ref="editor"
                            readOnly={false}
                            initialValue={this.state.compilation.text} />
                    }
                    rightContainer={
                        <Documentation />
                    }
                />
                <Modal
                    ref="new-modal"
                    text={EditorResources.Modal_ConfirmNew_Text}
                    onClick={this.onNewModalButtonClick.bind(this)}
                    buttons={[
                        { text: EditorResources.Modal_Button_Yes, color: "red" },
                        { text: EditorResources.Modal_Button_No, color: "gray" }
                    ]} />
            </div>
        );
    }

    public componentDidMount(): void {
        this.editor = this.refs["editor"] as CustomEditor;
        this.editor.editor.onDidChangeModelContent(() => {
            const code = this.editor.editor.getValue();
            const compilation = new Compilation(code);

            this.editor.setDiagnostics(compilation.diagnostics);
            this.setState({
                compilation: compilation
            });
        });
    }

    private onNewModalButtonClick(button: number): void {
        switch (button) {
            case 0:
                this.editor.editor.setValue("");
                break;
            case 1:
                // do nothing
                break;
            default:
                throw new Error(`Unsupported button ${button}`);
        }
    }

    private onCut(): void {
        this.clipboard = this.editor.editor.getModel().getValueInRange(this.editor.editor.getSelection());

        this.editor.editor.executeEdits("", [{
            identifier: { major: 1, minor: 1 },
            range: this.editor.editor.getSelection(),
            text: "",
            forceMoveMarkers: true
        }]);
    }

    private onCopy(): void {
        this.clipboard = this.editor.editor.getModel().getValueInRange(this.editor.editor.getSelection());
    }

    private onPaste(): void {
        this.editor.editor.executeEdits("", [{
            identifier: { major: 1, minor: 1 },
            range: this.editor.editor.getSelection(),
            text: this.clipboard || "",
            forceMoveMarkers: true
        }]);
    }
}
