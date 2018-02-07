import * as React from "react";

import "./style.css";

interface MasterLayoutProps {
    toolbar: JSX.Element[];
    masterContainer: JSX.Element;
    sideBar?: JSX.Element;
}

export class MasterLayout extends React.Component<MasterLayoutProps> {
    public render(): JSX.Element {
        return (
            <div className="content">
                <div className="toolbar body-box">
                    {this.props.toolbar.map((item, i) => <div key={i}>{item}</div>)}
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
}
