import * as React from "react";

import "./style.css";
import { Scanner } from "../../../../compiler/syntax/scanner";
import { TextWindowColors } from "../../../../compiler/runtime/libraries/text-window";
import { ValueKind, BaseValue } from "../../../../compiler/runtime/values/base-value";
import { NumberValue } from "../../../../compiler/runtime/values/number-value";
import { StringValue } from "../../../../compiler/runtime/values/string-value";
import { EditorResources } from "../../../strings/editor";
import { ExecutionEngine } from "../../../../compiler/execution-engine";

interface OutputLine {
    text: string;
    color: TextWindowColors;
}

interface TextWindowComponentProps {
    engine: ExecutionEngine;
}

interface TextWindowComponentState {
    isCursorVisible: boolean;

    foreground: TextWindowColors;
    background: TextWindowColors;

    inputBuffer: string;
    inputKind?: ValueKind;

    outputLines: OutputLine[];
}

const inputColor: TextWindowColors = TextWindowColors.Gray;

function textWindowColorToCssColor(color: TextWindowColors): string {
    switch (color) {
        case TextWindowColors.Black: return "rgb(0, 0, 0)";
        case TextWindowColors.DarkBlue: return "rgb(0, 0, 128)";
        case TextWindowColors.DarkGreen: return "rgb(0, 128, 0)";
        case TextWindowColors.DarkCyan: return "rgb(0, 128, 128)";
        case TextWindowColors.DarkRed: return "rgb(128, 0, 0)";
        case TextWindowColors.DarkMagenta: return "rgb(128, 0, 128)";
        case TextWindowColors.DarkYellow: return "rgb(128, 128, 0)";
        case TextWindowColors.Gray: return "rgb(128, 128, 128)";
        case TextWindowColors.DarkGray: return "rgb(64, 64, 64)";
        case TextWindowColors.Blue: return "rgb(0, 0, 255)";
        case TextWindowColors.Green: return "rgb(0, 255, 0)";
        case TextWindowColors.Cyan: return "rgb(0, 255, 255)";
        case TextWindowColors.Red: return "rgb(255, 0, 0)";
        case TextWindowColors.Magenta: return "rgb(255, 0, 255)";
        case TextWindowColors.Yellow: return "rgb(255, 255, 0)";
        case TextWindowColors.White: return "rgb(255, 255, 255)";
        default: throw new Error("Unsupported color: " + TextWindowColors[color]);
    }
}

export class TextWindowComponent extends React.Component<TextWindowComponentProps, TextWindowComponentState> {
    private isAlreadyMounted: boolean;
    private tokens: string[] = [];
    private inputDiv?: HTMLDivElement;

    public constructor(props: TextWindowComponentProps) {
        super(props);
        this.isAlreadyMounted = false;

        this.state = {
            isCursorVisible: true,

            foreground: TextWindowColors.White,
            background: TextWindowColors.Black,

            inputBuffer: "",
            inputKind: undefined,

            outputLines: []
        };
    }

    public componentDidMount(): void {
        this.tokens = [
            this.props.engine.libraries.TextWindow.backgroundColorChanged.subscribe(color => {
                this.setState({
                    background: color
                });
            }),
            this.props.engine.libraries.TextWindow.foregroundColorChanged.subscribe(color => {
                this.setState({
                    foreground: color
                });
            }),
            this.props.engine.libraries.TextWindow.blockedOnInput.subscribe(kind => {
                this.setState({
                    inputKind: kind
                });
            }),
            this.props.engine.libraries.TextWindow.producedOutput.subscribe(() => {
                this.appendOutput({
                    text: this.props.engine.buffer.readValue().toValueString(),
                    color: this.state.foreground
                });
            }),
            this.props.engine.programTerminated.subscribe(exception => {
                this.appendOutput(exception
                    ? {
                        text: exception.toString(),
                        color: TextWindowColors.Red
                    } : {
                        text: EditorResources.TextWindow_TerminationMessage,
                        color: this.state.foreground
                    });
            })
        ];

        this.isAlreadyMounted = true;
        this.blink();
    }

    public componentWillUnmount(): void {
        this.tokens.forEach(PubSub.unsubscribe);
        this.isAlreadyMounted = false;
    }

    public render(): JSX.Element {
        return (
            <div
                className="text-window"
                onKeyDown={this.onKeyPress.bind(this)}
                tabIndex={0}
                style={{ backgroundColor: textWindowColorToCssColor(this.state.background) }}>

                {this.state.outputLines.map((line, i) =>
                    <div key={i}>
                        <span style={{ color: textWindowColorToCssColor(line.color) }}>{line.text}</span>
                        <br />
                    </div>
                )}

                <div style={{ color: textWindowColorToCssColor(inputColor) }} ref={inputDiv => this.inputDiv = inputDiv!}>
                    <span>{this.state.inputBuffer}</span>
                    <span style={{ visibility: this.state.isCursorVisible ? "visible" : "hidden" }}>&#x2588;</span>
                </div>
            </div>
        );
    }

    private blink(): void {
        if (this.isAlreadyMounted) {
            this.setState({
                isCursorVisible: !this.state.isCursorVisible
            }, () => {
                setTimeout(this.blink.bind(this), 500);
            });
        }
    }

    private onKeyPress(e: React.KeyboardEvent<HTMLDivElement>): void {
        if (e.key === "Backspace") {
            this.setState({
                inputBuffer: this.state.inputBuffer.substr(0, this.state.inputBuffer.length - 1)
            });
        } else if (e.key === "Enter") {
            if (this.state.inputBuffer) {
                let input: BaseValue;
                switch (this.state.inputKind) {
                    case ValueKind.String: input = new StringValue(this.state.inputBuffer); break;
                    case ValueKind.Number: input = new NumberValue(parseFloat(this.state.inputBuffer)); break;
                    default: return;
                }

                this.props.engine.buffer.writeValue(input);
                this.setState({
                    inputBuffer: "",
                    inputKind: undefined
                });

                this.appendOutput({
                    text: this.state.inputBuffer,
                    color: inputColor
                });
            }
        } else if (e.key.length === 1) {
            switch (this.state.inputKind) {
                case ValueKind.Number:
                    if (!/[0-9\.]/.test(e.key)) {
                        return;
                    }
                    const floatValue = parseFloat(this.state.inputBuffer + e.key);
                    if (isNaN(floatValue) || !isFinite(floatValue)) {
                        return;
                    }
                    break;
                case ValueKind.String:
                    if (!Scanner.isSupportedCharacter(e.key)) {
                        return;
                    }
                    break;
                default:
                    return;
            }

            this.setState({
                inputBuffer: this.state.inputBuffer + e.key
            });
        }
    }

    private appendOutput(output: OutputLine): void {
        this.setState({
            outputLines: this.state.outputLines.concat([output])
        });

        this.inputDiv!.scrollIntoView({
            behavior: "smooth"
        });
    }
}
