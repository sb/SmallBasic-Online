import * as React from "react";

import "./style.css";

interface ModalProps {
    text: string;
    buttons: {
        text: string;
        color: string;
    }[];
    onClick(button: number): void;
}

interface ModalState {
    hidden: boolean;
}

export class Modal extends React.Component<ModalProps, ModalState> {
    public constructor(props: ModalProps) {
        super(props);
        this.state = {
            hidden: true
        };
    }

    public render(): JSX.Element {
        return (
            <div className="modal" style={{ display: this.state.hidden ? "none" : "block" }}>
                <div className="content">
                    <span className="close-button" onClick={this.close.bind(this)}>&times;</span>
                    <p>{this.props.text}</p>
                    <div>
                        {this.props.buttons.map((button, i) =>
                            <div
                                key={i}
                                className="user-button"
                                style={{ backgroundColor: button.color }}
                                onClick={() => this.onClick(i)}>
                                {button.text}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    public open(): void {
        this.setState({
            hidden: false
        });
    }

    public close(): void {
        this.setState({
            hidden: true
        });
    }

    private onClick(button: number): void {
        this.close();
        this.props.onClick(button);
    }
}
