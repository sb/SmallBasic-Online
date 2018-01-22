import * as React from "react";

interface ToolbarButtonProps {
    title: string;
    description: string;
    image: string;
    onClick?: React.EventHandler<React.MouseEvent<HTMLDivElement>>;
    disabled?: boolean;
}

export class ToolbarButton extends React.Component<ToolbarButtonProps> {

    private onClick(e: React.MouseEvent<HTMLDivElement>): void {
        if (!this.props.disabled && this.props.onClick) {
            this.props.onClick(e);
        }
    }

    public render(): JSX.Element {
        const buttonStyle: React.CSSProperties = {
            position: "relative",
            backgroundImage: `url('${this.props.image}')`,
            height: "70px",
            width: "70px",
            minWidth: "50px",
            marginLeft: "5px",
            marginRight: "5px",
            backgroundPosition: "top",
            backgroundRepeat: "no-repeat",
            backgroundSize: "50px",
            cursor: "pointer"
        };

        const labelStyle: React.CSSProperties = {
            height: "auto",
            width: "100%",
            textAlign: "center",
            margin: "0px",
            position: "absolute",
            bottom: 0,
            left: 0
        };

        if (this.props.disabled) {
            buttonStyle.opacity = 0.5;
            buttonStyle.cursor = "not-allowed";
        }

        return (
            <div title={this.props.description} style={buttonStyle} onClick={this.onClick.bind(this)}>
                <div style={labelStyle}>{this.props.title}</div>
            </div>
        );
    }
}
