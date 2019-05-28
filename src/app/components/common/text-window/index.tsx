import * as React from "react";

import "./style.css";
import { Scanner } from "../../../../compiler/syntax/scanner";
import { TextWindowColor, ITextWindowLibraryPlugin } from "../../../../compiler/runtime/libraries/text-window";
import { ValueKind, BaseValue } from "../../../../compiler/runtime/values/base-value";
import { EditorResources } from "../../../../strings/editor";
import { ExecutionEngine } from "../../../../compiler/execution-engine";
import { EditorUtils } from "../../../editor-utils";
import { StringValue } from "../../../../compiler/runtime/values/string-value";
import { NumberValue } from "../../../../compiler/runtime/values/number-value";

interface TextWindowComponentProps {
    engine: ExecutionEngine;
}

interface TextWindowComponentState {
    isVisible: boolean;

    isCursorVisible: boolean;

    foreground: TextWindowColor;
    background: TextWindowColor;

    inputBuffer: string;
    inputKind: ValueKind | undefined;

    inputLines: BaseValue[];
    outputLines: OutputChunk[];

    title: string;
}

const inputColor: TextWindowColor = TextWindowColor.Gray;

interface OutputChunk {
    text: string;
    color: TextWindowColor;
    appendNewLine: boolean;
}

export class TextWindowComponent extends React.Component<TextWindowComponentProps, TextWindowComponentState> implements ITextWindowLibraryPlugin {
    private isAlreadyMounted: boolean;
    private tokens: string[] = [];
    private inputDiv?: HTMLDivElement;

    public constructor(props: TextWindowComponentProps) {
        super(props);
        this.isAlreadyMounted = false;

        this.state = {
            isVisible: true,

            isCursorVisible: true,

            foreground: TextWindowColor.White,
            background: TextWindowColor.Black,

            inputBuffer: "",
            inputKind: undefined,

            inputLines: [],
            outputLines: [],

            title: ""
        };

        this.props.engine.libraries.TextWindow.plugin = this;
    }

    public componentDidMount(): void {
        this.tokens = [
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

    public render(): JSX.Element | null {
        return (
            this.state.isVisible ?
            <div
                className="text-window"
                onKeyDown={this.onKeyPress.bind(this)}
                tabIndex={0}
                style={{ backgroundColor: EditorUtils.textWindowColorToCssColor(this.state.background) }}
                >
                <div className="text-window-title">
                    {this.state.title}
                </div>
                <div className="text-window-body">
                    {this.state.outputLines.map((line, i) => [
                        <span key={`span_${i}`} style={{ color: EditorUtils.textWindowColorToCssColor(line.color) }}>{line.text}</span>,
                        line.appendNewLine ? <br key={`br_${i}`} /> : null
                    ])}

                    <div style={{ color: EditorUtils.textWindowColorToCssColor(inputColor) }} ref={inputDiv => this.inputDiv = inputDiv!}>
                        <span>{this.state.inputBuffer}</span>
                        <span style={{ visibility: this.state.isCursorVisible ? "visible" : "hidden" }}>&#x2588;</span>
                    </div>
                </div>
            </div> : null
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
                switch (this.state.inputKind) {
                    case ValueKind.String:
                        this.state.inputLines.push(new StringValue(this.state.inputBuffer));
                        break;
                    case ValueKind.Number:
                        this.state.inputLines.push(new NumberValue(parseFloat(this.state.inputBuffer)));
                        break;
                    default:
                        throw new Error(`Unexpected value kind: '${ValueKind[this.state.inputKind!]}'`);
                }

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

    public setVisibility(isVisible: boolean): void {
        this.setState({
            isVisible
        });
    }

    public getIsVisible(): boolean {
        return this.state.isVisible;
    }

    public clearOutput(): void {
        this.setState({
            outputLines: []
        });
    }

    public appendOutput(output: OutputChunk): void {
        this.setState({
            outputLines: this.state.outputLines.concat([output])
        });

        this.inputDiv!.scrollIntoView({
            behavior: "smooth"
        });
    }

    public inputIsNeeded(kind: ValueKind): void {
        this.setState({
            inputKind: kind
        });
    }

    public clearInputBuffer(): void {
        this.setState({
            inputBuffer: ""
        });
    }

    public checkInputBuffer(): string {
        return this.state.inputBuffer;
    }

    public checkInputLines(): BaseValue | undefined {
        const first = this.state.inputLines.shift();

        if (first) {
            this.setState({
                inputLines: this.state.inputLines
            });
        }

        return first;
    }

    public writeText(value: string, appendNewLine: boolean): void {
        this.appendOutput({
            text: value,
            color: this.getForegroundColor(),
            appendNewLine: appendNewLine
        });
    }

    public getForegroundColor(): TextWindowColor {
        return this.state.foreground;
    }

    public setForegroundColor(color: TextWindowColor): void {
        this.setState({
            foreground: color
        });
    }

    public getBackgroundColor(): TextWindowColor {
        return this.state.background;
    }

    public setBackgroundColor(color: TextWindowColor): void {
        this.setState({
            background: color
        });
    }

    public setTitle(title: string): void {
        this.setState({
            title
        });
    }

    public getTitle(): string {
        return this.state.title;
    }
}
