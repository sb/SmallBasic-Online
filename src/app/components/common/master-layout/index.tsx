import * as React from "react";

import "./style.css";

interface MasterLayoutProps {
    toolbar: JSX.Element[];
    leftContainer: JSX.Element;
    rightContainer: JSX.Element;
}

export class MasterLayout extends React.Component<MasterLayoutProps> {
    public render(): JSX.Element {
        return (
            <div className="content">
                <div className="toolbar body-box">
                    {this.props.toolbar.map((item, i) => <div key={i}>{item}</div>)}
                </div>

                <div className="container-left body-box">
                    {this.props.leftContainer}
                </div>

                <div className="container-right body-box">
                    {this.props.rightContainer}
                </div>
            </div>
        );
    }
}
