import { MasterLayout } from "../common/master-layout";
import { ToolbarButton } from "../common/toolbar-button";
import * as React from "react";
import { EditorResources } from "../../strings/editor";
import { RouteComponentProps } from "react-router";
import { Compilation } from "../../../compiler/compilation";
import { AppState } from "../../store";
import { Dispatch, connect } from "react-redux";

const StopIcon = require("./images/stop.png");

interface PropsFromState {
    compilation: Compilation;
}

interface PropsFromDispatch {
}

interface PropsFromReact extends RouteComponentProps<PropsFromReact> {
}

type PresentationalComponentProps = PropsFromState & PropsFromDispatch & PropsFromReact;

class PresentationalComponent extends React.Component<PresentationalComponentProps> {
    public constructor(props: PresentationalComponentProps) {
        super(props);

        if (!this.props.compilation.isReadyToRun) {
            this.props.history.push("/editor");
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
                    <div>{this.props.compilation.text}</div>
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
