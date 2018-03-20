import { MasterLayout } from "../common/master-layout";
import { ToolbarButton } from "../common/toolbar-button";
import * as React from "react";
import { EditorResources } from "../../strings/editor";
import { RouteComponentProps } from "react-router";
import { Compilation } from "../../../compiler/compilation";
import { AppState } from "../../store";
import { Dispatch, connect } from "react-redux";
import { ExecutionMode, ExecutionEngine, ExecutionState } from "../../../compiler/execution-engine";
import { TextWindowComponent } from "../common/text-window/index";
import { CallStackComponent } from "./callstack/index";
import { MemoryComponent } from "./memory/index";
import { CustomEditor } from "../common/custom-editor/index";

import "./style.css";

const RunIcon = require("../../content/buttons/run.png");
const StepIcon = require("../../content/buttons/step.png");
const StopIcon = require("../../content/buttons/stop.png");

interface PropsFromState {
    compilation: Compilation;
}

interface PropsFromDispatch {
}

interface PropsFromReact extends RouteComponentProps<PropsFromReact> {
}

type PresentationalComponentProps = PropsFromState & PropsFromDispatch & PropsFromReact;

interface PresentationalComponentState {
    mode?: ExecutionMode;
    engine: ExecutionEngine;
}

class PresentationalComponent extends React.Component<PresentationalComponentProps, PresentationalComponentState> {
    private editor?: CustomEditor;
    private isAlreadyMounted: boolean = false;

    public constructor(props: PresentationalComponentProps) {
        super(props);

        if (!this.props.compilation.isReadyToRun) {
            this.props.history.push("/editor");
        }

        this.state = {
            mode: undefined,
            engine: new ExecutionEngine(this.props.compilation)
        };
    }

    public componentDidMount(): void {
        this.isAlreadyMounted = true;
        this.execute();
    }

    public componentWillUnmount(): void {
        this.isAlreadyMounted = false;
    }

    public render(): JSX.Element {
        return (
            <MasterLayout
                toolbar={[
                    <ToolbarButton
                        title={EditorResources.ToolbarButton_Run_Title}
                        description={EditorResources.ToolbarButton_Run_Description}
                        image={RunIcon}
                        onClick={this.onRunClick.bind(this)} />,
                    <ToolbarButton
                        title={EditorResources.ToolbarButton_Step_Title}
                        description={EditorResources.ToolbarButton_Step_Description}
                        image={StepIcon}
                        onClick={this.onStepClick.bind(this)} />,
                    <ToolbarButton
                        title={EditorResources.ToolbarButton_Stop_Title}
                        description={EditorResources.ToolbarButton_Stop_Description}
                        image={StopIcon}
                        onClick={() => this.props.history.push("/editor")} />
                ]}
                masterContainer={
                    <div className="debug-component">
                        <div className="editor-container">
                            <CustomEditor initialValue={this.props.compilation.text} readOnly={true} ref={editor => this.editor = editor!} />
                        </div>
                        <div className="text-window-container">
                            <TextWindowComponent engine={this.state.engine} />
                        </div>
                    </div>
                }
                sideBar={
                    <div>
                        <CallStackComponent engine={this.state.engine} />
                        <MemoryComponent engine={this.state.engine} />
                    </div>
                }
            />
        );
    }

    private execute(): void {
        if (this.isAlreadyMounted) {
            if (this.state.mode) {
                this.state.engine.execute(this.state.mode);

                if (this.state.engine.state !== ExecutionState.Terminated) {
                    const frame = this.state.engine.executionStack[this.state.engine.executionStack.length - 1];
                    const instruction = this.state.engine.modules[frame.moduleName][frame.instructionIndex];
                    this.editor!.highlightLine(instruction.sourceRange.line);

                    if (this.state.engine.state === ExecutionState.Paused) {
                        this.setState({
                            mode: undefined
                        });
                    }

                    this.forceUpdate();
                }
            }

            setTimeout(this.execute.bind(this));
        }
    }

    private onRunClick(): void {
        this.setState({
            mode: ExecutionMode.Debug
        });
    }

    private onStepClick(): void {
        this.setState({
            mode: ExecutionMode.NextStatement
        });
    }
}

function mapStateToProps(state: AppState): PropsFromState {
    return {
        compilation: state.compilation
    };
}

function mapDispatchToProps(_: Dispatch<AppState>): PropsFromDispatch {
    return {
    };
}

export const DebugComponent = connect(mapStateToProps, mapDispatchToProps)(PresentationalComponent as any);
