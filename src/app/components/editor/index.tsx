import { ToolbarButton } from "../common/toolbar-button";
import { ToolbarDivider } from "../common/toolbar-divider";
import { CustomEditor } from "../common/custom-editor";
import * as React from "react";
import { EditorResources } from "../../strings/editor";
import { Documentation } from "./documentation";
import { MasterLayout } from "../common/master-layout/index";

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
            <MasterLayout
                toolbar={[
                    <ToolbarButton title={EditorResources.ToolbarButton_New_Title} description={EditorResources.ToolbarButton_New_Description} image={NewIcon} />,
                    <ToolbarDivider />,
                    <ToolbarButton title={EditorResources.ToolbarButton_Cut_Title} description={EditorResources.ToolbarButton_Cut_Description} image={CutIcon} />,
                    <ToolbarButton title={EditorResources.ToolbarButton_Copy_Title} description={EditorResources.ToolbarButton_Copy_Description} image={CopyIcon} />,
                    <ToolbarButton title={EditorResources.ToolbarButton_Paste_Title} description={EditorResources.ToolbarButton_Paste_Description} image={PasteIcon} />,
                    <ToolbarDivider />,
                    <ToolbarButton title={EditorResources.ToolbarButton_Undo_Title} description={EditorResources.ToolbarButton_Undo_Description} image={UndoIcon} />,
                    <ToolbarButton title={EditorResources.ToolbarButton_Redo_Title} description={EditorResources.ToolbarButton_Redo_Description} image={RedoIcon} />,
                    <ToolbarDivider />,
                    <ToolbarButton title={EditorResources.ToolbarButton_Run_Title} description={EditorResources.ToolbarButton_Run_Description} image={RunIcon} />
                ]}
                leftContainer={
                    <CustomEditor
                        id="code-editor-page-editor-id"
                        initialValue={this.state.code}
                        onChange={this.onEditorChange.bind(this)}
                    />
                }
                rightContainer={
                    <Documentation />
                }
            />
        );
    }
}
