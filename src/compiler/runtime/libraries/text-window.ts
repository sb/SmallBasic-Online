import { LibraryTypeDefinition, LibraryMethodDefinition, LibraryPropertyDefinition } from "../supported-libraries";
import { ValueKind } from "../values/base-value";
import { StringValue } from "../values/string-value";
import { NumberValue } from "../values/number-value";
import { DocumentationResources } from "../../strings/documentation";
import { Diagnostic, ErrorCode } from "../../diagnostics";
import { StorePropertyInstruction, BaseInstruction } from "../instructions";
import { ExecutionState, ExecutionEngine, ExecutionMode } from "../../execution-engine";
import { PubSubPayloadChannel, PubSubChannel } from "../../notifications";

export enum TextWindowColors {
    Black = 0,
    DarkBlue = 1,
    DarkGreen = 2,
    DarkCyan = 3,
    DarkRed = 4,
    DarkMagenta = 5,
    DarkYellow = 6,
    Gray = 7,
    DarkGray = 8,
    Blue = 9,
    Green = 10,
    Cyan = 11,
    Red = 12,
    Magenta = 13,
    Yellow = 14,
    White = 15
}

export class TextWindowLibrary implements LibraryTypeDefinition {
    public readonly blockedOnInput: PubSubPayloadChannel<ValueKind> = new PubSubPayloadChannel<ValueKind>("blockedOnInput");
    public readonly producedOutput: PubSubChannel = new PubSubChannel("producedOutput");

    public readonly backgroundColorChanged: PubSubPayloadChannel<TextWindowColors> = new PubSubPayloadChannel<TextWindowColors>("backgroundColorChanged");
    public readonly foregroundColorChanged: PubSubPayloadChannel<TextWindowColors> = new PubSubPayloadChannel<TextWindowColors>("foregroundColorChanged");

    public readonly description: string = DocumentationResources.TextWindow;

    public readonly methods: { readonly [name: string]: LibraryMethodDefinition } = {
        Read: {
            description: DocumentationResources.TextWindow_Read,
            parameters: {},
            returnsValue: true,
            execute: (engine: ExecutionEngine) => {
                if (engine.buffer.hasValue()) {
                    const value = engine.buffer.readValue();
                    if (value.kind !== ValueKind.String) {
                        throw new Error(`Unexpected value kind: ${ValueKind[value.kind]}`);
                    }

                    engine.evaluationStack.push(value);
                    engine.moveToNextInstruction();

                    engine.state = ExecutionState.Running;
                } else {
                    engine.state = ExecutionState.BlockedOnStringInput;
                    this.blockedOnInput.publish(ValueKind.String);
                }
            }
        },
        ReadNumber: {
            description: DocumentationResources.TextWindow_ReadNumber,
            parameters: {},
            returnsValue: true,
            execute: (engine: ExecutionEngine) => {
                if (engine.buffer.hasValue()) {
                    const value = engine.buffer.readValue();
                    if (value.kind !== ValueKind.Number) {
                        throw new Error(`Unexpected value kind: ${ValueKind[value.kind]}`);
                    }

                    engine.evaluationStack.push(value);
                    engine.moveToNextInstruction();

                    engine.state = ExecutionState.Running;
                } else {
                    engine.state = ExecutionState.BlockedOnNumberInput;
                    this.blockedOnInput.publish(ValueKind.Number);
                }
            }
        },
        WriteLine: {
            description: DocumentationResources.TextWindow_WriteLine,
            parameters: {
                data: DocumentationResources.TextWindow_WriteLine_Data
            },
            returnsValue: false,
            execute: (engine: ExecutionEngine) => {
                if (engine.state === ExecutionState.BlockedOnOutput) {
                    if (!engine.buffer.hasValue()) {
                        engine.state = ExecutionState.Running;
                        engine.moveToNextInstruction();
                    }
                } else {
                    engine.buffer.writeValue(new StringValue(engine.evaluationStack.pop()!.toValueString()));
                    engine.state = ExecutionState.BlockedOnOutput;
                    this.producedOutput.publish();
                }
            }
        }
    };

    public readonly properties: { readonly [name: string]: LibraryPropertyDefinition } = {
        ForegroundColor: {
            description: DocumentationResources.TextWindow_ForegroundColor,
            getter: (engine: ExecutionEngine) => {
                engine.evaluationStack.push(new StringValue(TextWindowColors[engine.buffer.foreground]));
                engine.moveToNextInstruction();
            },
            setter: (engine: ExecutionEngine, _: ExecutionMode, instruction: BaseInstruction) => {
                const color = engine.evaluationStack.pop()!;
                engine.moveToNextInstruction();

                switch (color.kind) {
                    case ValueKind.Number: {
                        const numberValue = (color as NumberValue).value;
                        if (TextWindowColors[numberValue]) {
                            engine.buffer.foreground = numberValue;
                            this.foregroundColorChanged.publish(engine.buffer.foreground);
                            return;
                        }
                        break;
                    }
                    case ValueKind.String: {
                        const stringValue = (color as StringValue).value.toLowerCase();
                        for (let color in TextWindowColors) {
                            if (color.toLowerCase() === stringValue) {
                                engine.buffer.foreground = <any>TextWindowColors[color];
                                this.foregroundColorChanged.publish(engine.buffer.foreground);
                                return;
                            }
                        }
                        break;
                    }
                }

                engine.terminate(new Diagnostic(ErrorCode.UnsupportedTextWindowColor, (instruction as StorePropertyInstruction).sourceRange, color.toValueString()));
            }
        },
        BackgroundColor: {
            description: DocumentationResources.TextWindow_BackgroundColor,
            getter: (engine: ExecutionEngine) => {
                engine.evaluationStack.push(new StringValue(TextWindowColors[engine.buffer.background]));
                engine.moveToNextInstruction();
            },
            setter: (engine: ExecutionEngine, _: ExecutionMode, instruction: BaseInstruction) => {
                const color = engine.evaluationStack.pop()!;
                engine.moveToNextInstruction();

                switch (color.kind) {
                    case ValueKind.Number: {
                        const numberValue = (color as NumberValue).value;
                        if (TextWindowColors[numberValue]) {
                            engine.buffer.background = numberValue;
                            this.backgroundColorChanged.publish(engine.buffer.background);
                            return;
                        }
                        break;
                    }
                    case ValueKind.String: {
                        const stringValue = (color as StringValue).value.toLowerCase();
                        for (let color in TextWindowColors) {
                            if (color.toLowerCase() === stringValue) {
                                engine.buffer.background = <any>TextWindowColors[color];
                                this.backgroundColorChanged.publish(engine.buffer.background);
                                return;
                            }
                        }
                        break;
                    }
                }

                engine.terminate(new Diagnostic(ErrorCode.UnsupportedTextWindowColor, (instruction as StorePropertyInstruction).sourceRange, color.toValueString()));
            }
        }
    };
}
