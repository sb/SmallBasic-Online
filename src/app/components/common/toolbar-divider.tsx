import * as React from "react";

export class ToolbarDivider extends React.Component {
    public render(): JSX.Element {
        const style: React.CSSProperties = {
            width: "1px",
            minWidth: "1px",
            background: "#bcbcbc"
        };

        return <div style={style} />;
    }
}
