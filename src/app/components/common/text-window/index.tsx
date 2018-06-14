import * as React from "react";

import "./style.css";
import { Scanner } from "../../../../compiler/syntax/scanner";
import { TextWindowColor } from "../../../../compiler/runtime/libraries/text-window";
import { ValueKind, BaseValue } from "../../../../compiler/runtime/values/base-value";
import { NumberValue } from "../../../../compiler/runtime/values/number-value";
import { StringValue } from "../../../../compiler/runtime/values/string-value";
import { EditorResources } from "../../../../strings/editor";
import { ExecutionEngine } from "../../../../compiler/execution-engine";

interface OutputChunk {
    text: string;
    color: TextWindowColor;
    appendNewLine: boolean;
}

interface TextWindowComponentProps {
    engine: ExecutionEngine;
}

interface TextWindowComponentState {
    isCursorVisible: boolean;

    foreground: TextWindowColor;
    background: TextWindowColor;

    inputBuffer: string;
    inputKind?: ValueKind;

    outputLines: OutputChunk[];
}

const inputColor: TextWindowColor = TextWindowColor.Gray;

function textWindowColorToCssColor(color: TextWindowColor): string {
    switch (color) {
        case TextWindowColor.Black: return "rgb(0, 0, 0)";
        case TextWindowColor.DarkBlue: return "rgb(0, 0, 128)";
        case TextWindowColor.DarkGreen: return "rgb(0, 128, 0)";
        case TextWindowColor.DarkCyan: return "rgb(0, 128, 128)";
        case TextWindowColor.DarkRed: return "rgb(128, 0, 0)";
        case TextWindowColor.DarkMagenta: return "rgb(128, 0, 128)";
        case TextWindowColor.DarkYellow: return "rgb(128, 128, 0)";
        case TextWindowColor.Gray: return "rgb(128, 128, 128)";
        case TextWindowColor.DarkGray: return "rgb(64, 64, 64)";
        case TextWindowColor.Blue: return "rgb(0, 0, 255)";
        case TextWindowColor.Green: return "rgb(0, 255, 0)";
        case TextWindowColor.Cyan: return "rgb(0, 255, 255)";
        case TextWindowColor.Red: return "rgb(255, 0, 0)";
        case TextWindowColor.Magenta: return "rgb(255, 0, 255)";
        case TextWindowColor.Yellow: return "rgb(255, 255, 0)";
        case TextWindowColor.White: return "rgb(255, 255, 255)";
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

            foreground: this.props.engine.libraries.TextWindow.foreground,
            background: this.props.engine.libraries.TextWindow.background,

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
                const value = this.props.engine.libraries.TextWindow.readValueFromBuffer();
                this.appendOutput({
                    text: value.value.toValueString(),
                    color: this.state.foreground,
                    appendNewLine: value.appendNewLine
                });
            }),
            this.props.engine.programTerminated.subscribe(exception => {
                this.appendOutput(exception
                    ? {
                        text: exception.toString(),
                        color: TextWindowColor.Red,
                        appendNewLine: true
                    } : {
                        text: EditorResources.TextWindow_TerminationMessage,
                        color: this.state.foreground,
                        appendNewLine: true
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

                {this.state.outputLines.map((line, i) => [
                    <span key={`span_${i}`} style={{ color: textWindowColorToCssColor(line.color) }}>{line.text}</span>,
                    line.appendNewLine ? <br key={`br_${i}`} /> : null
                ])}

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

                this.props.engine.libraries.TextWindow.writeValueToBuffer(input, true);
                this.setState({
                    inputBuffer: "",
                    inputKind: undefined
                });

                this.appendOutput({
                    text: this.state.inputBuffer,
                    color: inputColor,
                    appendNewLine: true
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

    private appendOutput(output: OutputChunk): void {
        this.setState({
            outputLines: this.state.outputLines.concat([output])
        });

        this.inputDiv!.scrollIntoView({
            behavior: "smooth"
        });
    }
}
