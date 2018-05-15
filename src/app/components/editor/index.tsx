import { Compilation } from "../../../compiler/compilation";
import { ToolbarButton } from "../common/toolbar-button";
import { ToolbarDivider } from "../common/toolbar-divider";
import { CustomEditor } from "../common/custom-editor";
import * as React from "react";
import { EditorResources } from "../../../strings/editor";
import { DocumentationComponent } from "./documentation";
import { MasterLayoutComponent } from "../common/master-layout";
import { Modal } from "../common/modal";
import { AppState, ActionFactory, SetTextAction } from "../../store";
import { RouteComponentProps, withRouter } from "react-router";
import { Dispatch, connect } from "react-redux";

const NewIcon = require("../../content/buttons/new.png");
const CutIcon = require("../../content/buttons/cut.png");
const CopyIcon = require("../../content/buttons/copy.png");
const PasteIcon = require("../../content/buttons/paste.png");
const UndoIcon = require("../../content/buttons/undo.png");
const RedoIcon = require("../../content/buttons/redo.png");
const RunIcon = require("../../content/buttons/run.png");
const DebugIcon = require("../../content/buttons/debug.png");

interface PropsFromState {
    storeCompilation: Compilation;
}

interface PropsFromDispatch {
    setStoreText: (text: string) => SetTextAction;
}

interface PropsFromReact {
}

type PresentationalComponentProps = PropsFromState & PropsFromDispatch & PropsFromReact & RouteComponentProps<PropsFromReact>;

interface PresentationalComponentState {
    compilation: Compilation;
}

class PresentationalComponent extends React.Component<PresentationalComponentProps, PresentationalComponentState> {
    private newModal?: Modal;
    private editor?: CustomEditor;
    private clipboard?: string;

    public constructor(props: PresentationalComponentProps) {
        super(props);
        this.state = {
            compilation: props.storeCompilation
        };
    }

    public render(): JSX.Element {
        return (
            <div>
                <MasterLayoutComponent
                    toolbar={[
                        <ToolbarButton
                            title={EditorResources.ToolbarButton_New_Title}
                            description={EditorResources.ToolbarButton_New_Description}
                            image={NewIcon}
                            onClick={() => this.newModal!.open()} />,
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
                            onClick={() => this.editor!.undo()} />,
                        <ToolbarButton
                            title={EditorResources.ToolbarButton_Redo_Title}
                            description={EditorResources.ToolbarButton_Redo_Description}
                            image={RedoIcon}
                            onClick={() => this.editor!.redo()} />,
                        <ToolbarDivider />,
                        <ToolbarButton
                            title={EditorResources.ToolbarButton_Run_Title}
                            description={EditorResources.ToolbarButton_Run_Description}
                            image={RunIcon}
                            onClick={() => this.props.history.push("/run")}
                            disabled={!this.state.compilation.isReadyToRun} />,
                        <ToolbarButton
                            title={EditorResources.ToolbarButton_Debug_Title}
                            description={EditorResources.ToolbarButton_Debug_Description}
                            image={DebugIcon}
                            onClick={() => this.props.history.push("/debug")}
                            disabled={!this.state.compilation.isReadyToRun} />
                    ]}
                    masterContainer={
                        <CustomEditor
                            ref={editor => this.editor = editor!}
                            readOnly={false}
                            initialValue={this.state.compilation.text} />
                    }
                    sideBar={
                        <DocumentationComponent />
                    }
                />
                <Modal
                    ref={newModal => this.newModal = newModal!}
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
        this.editor!.setDiagnostics(this.state.compilation.diagnostics);

        this.editor!.editor!.onDidChangeModelContent(() => {
            const code = this.editor!.editor!.getValue();
            this.props.setStoreText(code);
            this.setState({
                compilation: new Compilation(code)
            });

            this.editor!.setDiagnostics(this.state.compilation.diagnostics);
        });
    }

    private onNewModalButtonClick(button: number): void {
        switch (button) {
            case 0:
                this.editor!.editor!.setValue("");
                break;
            case 1:
                // do nothing
                break;
            default:
                throw new Error(`Unsupported button ${button}`);
        }
    }

    private onCut(): void {
        this.clipboard = this.editor!.editor!.getModel().getValueInRange(this.editor!.editor!.getSelection());

        this.editor!.editor!.executeEdits("", [{
            identifier: { major: 1, minor: 1 },
            range: this.editor!.editor!.getSelection(),
            text: "",
            forceMoveMarkers: true
        }]);
    }

    private onCopy(): void {
        this.clipboard = this.editor!.editor!.getModel().getValueInRange(this.editor!.editor!.getSelection());
    }

    private onPaste(): void {
        this.editor!.editor!.executeEdits("", [{
            identifier: { major: 1, minor: 1 },
            range: this.editor!.editor!.getSelection(),
            text: this.clipboard || "",
            forceMoveMarkers: true
        }]);
    }
}

function mapStateToProps(state: AppState): PropsFromState {
    return {
        storeCompilation: state.compilation
    };
}

function mapDispatchToProps(dispatch: Dispatch<AppState>): PropsFromDispatch {
    return {
        setStoreText: (text: string) => dispatch(ActionFactory.setText(text))
    };
}

export const EditorComponent = connect<PropsFromState, PropsFromDispatch, PropsFromReact, AppState>(mapStateToProps, mapDispatchToProps)(withRouter(PresentationalComponent as any));
