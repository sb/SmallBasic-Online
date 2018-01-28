import { MasterLayout } from "../common/master-layout";
import { ToolbarButton } from "../common/toolbar-button";
import * as React from "react";
import { EditorResources } from "../../strings/editor";
import { RouteComponentProps } from "react-router";
import { Compilation } from "../../../compiler/compilation";
import { AppState } from "../../store";
import { Dispatch, connect } from "react-redux";
import { ExecutionMode, ExecutionEngine } from "../../../compiler/execution-engine";
import { TextWindowComponent } from "../common/text-window/index";

const StopIcon = require("./images/stop.png");

interface PropsFromState {
    compilation: Compilation;
}

interface PropsFromDispatch {
}

interface PropsFromReact extends RouteComponentProps<PropsFromReact> {
}

type PresentationalComponentProps = PropsFromState & PropsFromDispatch & PropsFromReact;

interface PresentationalComponentState {
}

class PresentationalComponent extends React.Component<PresentationalComponentProps, PresentationalComponentState> {
    private isAlreadyMounted: boolean;
    private tokens: string[];
    private engine: ExecutionEngine;

    public constructor(props: PresentationalComponentProps) {
        super(props);

        if (!this.props.compilation.isReadyToRun) {
            this.props.history.push("/editor");
        }

        this.engine = new ExecutionEngine(this.props.compilation);

        this.state = {
            isMounted: false
        };
    }

    public componentDidMount(): void {
        this.tokens = [];
        this.isAlreadyMounted = true;
        this.execute();
    }

    public componentWillUnmount(): void {
        this.tokens.forEach(PubSub.unsubscribe);
        this.isAlreadyMounted = false;
    }

    private execute(): void {
        if (this.isAlreadyMounted) {
            this.engine.execute(ExecutionMode.RunToEnd);
            setTimeout(this.execute.bind(this));
        }
    }

    public render(): JSX.Element {
        return (
            <MasterLayout
                toolbar={[
                    <ToolbarButton
                        title={EditorResources.ToolbarButton_Stop_Title}
                        description={EditorResources.ToolbarButton_Stop_Description}
                        image={StopIcon}
                        onClick={() => this.props.history.push("/editor")} />
                ]}
                masterContainer={
                    <TextWindowComponent engine={this.engine} />
                }
            />
        );
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

export const RunComponent = connect(mapStateToProps, mapDispatchToProps)(PresentationalComponent as any);
