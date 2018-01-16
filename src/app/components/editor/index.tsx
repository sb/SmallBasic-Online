import * as React from "react";
import { ToolbarButton, ToolbarDivider, CustomEditor } from "../common";
import { EditorResources } from "../../strings/editor";
import { Documentation } from "./documentation";

const NewIcon = require("../../content/images/toolbar/new.png");
const CutIcon = require("../../content/images/toolbar/cut.png");
const CopyIcon = require("../../content/images/toolbar/copy.png");
const PasteIcon = require("../../content/images/toolbar/paste.png");
const UndoIcon = require("../../content/images/toolbar/undo.png");
const RedoIcon = require("../../content/images/toolbar/redo.png");
const RunIcon = require("../../content/images/toolbar/run.png");

interface EditorComponentProps {
}

interface EditorComponentState {
    code: string;
}

export class EditorComponent extends React.Component<EditorComponentProps, EditorComponentState> {
    public constructor(props: EditorComponentProps) {
        super(props);
        this.state = {
            code: [
                `' A new Program!`,
                `TextWindow.WriteLine("Hello World!")`
            ].join("\n")
        };
    }

    private onEditorChange(code: string): void {
        this.setState({
            code: code
        });
    }

    public render(): JSX.Element {
        return (
            <div className="content">
                <div className="toolbar body-box">
                    <ToolbarButton title={EditorResources.ToolbarButton_New_Title} description={EditorResources.ToolbarButton_New_Description} image={NewIcon} />
                    <ToolbarDivider />

                    <ToolbarButton title={EditorResources.ToolbarButton_Cut_Title} description={EditorResources.ToolbarButton_Cut_Description} image={CutIcon} />
                    <ToolbarButton title={EditorResources.ToolbarButton_Copy_Title} description={EditorResources.ToolbarButton_Copy_Description} image={CopyIcon} />
                    <ToolbarButton title={EditorResources.ToolbarButton_Paste_Title} description={EditorResources.ToolbarButton_Paste_Description} image={PasteIcon} />
                    <ToolbarDivider />

                    <ToolbarButton title={EditorResources.ToolbarButton_Undo_Title} description={EditorResources.ToolbarButton_Undo_Description} image={UndoIcon} />
                    <ToolbarButton title={EditorResources.ToolbarButton_Redo_Title} description={EditorResources.ToolbarButton_Redo_Description} image={RedoIcon} />
                    <ToolbarDivider />

                    <ToolbarButton title={EditorResources.ToolbarButton_Run_Title} description={EditorResources.ToolbarButton_Run_Description} image={RunIcon} />
                </div>

                <div className="container-left body-box">
                    <CustomEditor
                        id="code-editor-page-editor-id"
                        initialValue={this.state.code}
                        onChange={this.onEditorChange.bind(this)}
                    />
                </div>

                <div className="container-right body-box">
                    <Documentation />
                </div>
            </div>
        );
    }
}
