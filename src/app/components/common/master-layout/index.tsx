import * as React from "react";

import "./style.css";
import { RouteComponentProps, withRouter } from "react-router";
import { AppState } from "../../../store";
import { Dispatch, connect } from "react-redux";

interface PropsFromState {
}

interface PropsFromDispatch {
}

interface PropsFromReact {
    toolbar: JSX.Element[];
    masterContainer: JSX.Element;
    sideBar?: JSX.Element;
}

const isChrome = navigator.userAgent.indexOf("Chrome")!==-1 || navigator.userAgent.indexOf("Firefox") != -1;

type PresentationalComponentProps = PropsFromState & PropsFromDispatch & PropsFromReact & RouteComponentProps<PropsFromReact>;

class PresentationalComponent extends React.Component<PresentationalComponentProps> {
    public constructor(props: PresentationalComponentProps) {
        super(props);
    }

    public render(): JSX.Element {
        const classNameWithChrome = isChrome? "content new-style" : "content";

        return (
            <div className={classNameWithChrome}>
                <div className="toolbar body-box">
                    <div className="toolbar-buttons">
                        {this.props.toolbar.map((item, i) => <div key={i}>{item}</div>)}
                    </div>
                    <div className="toolbar-logo" onClick={this.onLogoClick.bind(this)} />
                </div>

                {this.props.sideBar ?
                    <div>
                        <div className="master-container body-box">
                            {this.props.masterContainer}
                        </div>

                        <div className="sidebar-container body-box">
                            {this.props.sideBar}
                        </div>
                    </div>
                    :
                    <div className="full-container body-box">
                        {this.props.masterContainer}
                    </div>
                }
            </div>
        );
    }

    private onLogoClick(): void {
        if (this.props.location.pathname !== "/editor") {
            this.props.history.push("/editor");
        }
    }
}

function mapStateToProps(_: AppState): PropsFromState {
    return {
    };
}

function mapDispatchToProps(_: Dispatch<AppState>): PropsFromDispatch {
    return {
    };
}

export const MasterLayoutComponent = connect<PropsFromState, PropsFromDispatch, PropsFromReact, AppState>(mapStateToProps, mapDispatchToProps)(withRouter(PresentationalComponent as any));
