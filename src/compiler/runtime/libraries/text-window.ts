import { LibraryTypeDefinition } from "../supported-libraries";
import { ValueKind } from "../values/base-value";
import { StringValue } from "../values/string-value";
import { NumberValue } from "../values/number-value";
import { DocumentationResources } from "../../strings/documentation";
import { Diagnostic, ErrorCode } from "../../utils/diagnostics";
import { StorePropertyInstruction } from "../../models/instructions";
import { ExecutionState } from "../../execution-engine";

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

export const TextWindowLibrary: LibraryTypeDefinition = {
    description: DocumentationResources.TextWindow_Description,
    methods: {
        "Read": {
            description: DocumentationResources.TextWindow_Read_Description,
            parameters: {},
            returnsValue: true,
            execute: (engine) => {
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
                    engine.notifications.blockedOnInput.publish(ValueKind.String);
                }
            }
        },
        "ReadNumber": {
            description: DocumentationResources.TextWindow_ReadNumber_Description,
            parameters: {},
            returnsValue: true,
            execute: (engine) => {
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
                    engine.notifications.blockedOnInput.publish(ValueKind.Number);
                }
            }
        },
        "WriteLine": {
            description: DocumentationResources.TextWindow_WriteLine_Description,
            parameters: {
                "data": DocumentationResources.TextWindow_WriteLine_Data_Description
            },
            returnsValue: false,
            execute: (engine) => {
                if (engine.state === ExecutionState.BlockedOnOutput) {
                    if (!engine.buffer.hasValue()) {
                        engine.state = ExecutionState.Running;
                        engine.moveToNextInstruction();
                    }
                } else {
                    engine.buffer.writeValue(new StringValue(engine.evaluationStack.pop()!.toValueString()));
                    engine.state = ExecutionState.BlockedOnOutput;
                    engine.notifications.producedOutput.publish();
                }
            }
        }
    },
    properties: {
        "ForegroundColor": {
            description: DocumentationResources.TextWindow_ForegroundColor_Description,
            getter: (engine) => {
                engine.evaluationStack.push(new StringValue(TextWindowColors[engine.buffer.foreground]));
                engine.moveToNextInstruction();
            },
            setter: (engine, _, instruction) => {
                const color = engine.evaluationStack.pop()!;
                engine.moveToNextInstruction();

                switch (color.kind) {
                    case ValueKind.Number: {
                        const numberValue = (color as NumberValue).value;
                        if (TextWindowColors[numberValue]) {
                            engine.buffer.foreground = numberValue;
                            engine.notifications.foregroundColorChanged.publish(engine.buffer.foreground);
                            return;
                        }
                        break;
                    }
                    case ValueKind.String: {
                        const stringValue = (color as StringValue).value.toLowerCase();
                        for (let color in TextWindowColors) {
                            if (color.toLowerCase() === stringValue) {
                                engine.buffer.foreground = <any>TextWindowColors[color];
                                engine.notifications.foregroundColorChanged.publish(engine.buffer.foreground);
                                return;
                            }
                        }
                        break;
                    }
                }

                engine.terminate(new Diagnostic(ErrorCode.UnsupportedTextWindowColor, (instruction as StorePropertyInstruction).sourceRange, color.toValueString()));
            }
        },
        "BackgroundColor": {
            description: DocumentationResources.TextWindow_BackgroundColor_Description,
            getter: (engine) => {
                engine.evaluationStack.push(new StringValue(TextWindowColors[engine.buffer.background]));
                engine.moveToNextInstruction();
            },
            setter: (engine, _, instruction) => {
                const color = engine.evaluationStack.pop()!;
                engine.moveToNextInstruction();

                switch (color.kind) {
                    case ValueKind.Number: {
                        const numberValue = (color as NumberValue).value;
                        if (TextWindowColors[numberValue]) {
                            engine.buffer.background = numberValue;
                            engine.notifications.backgroundColorChanged.publish(engine.buffer.background);
                            return;
                        }
                        break;
                    }
                    case ValueKind.String: {
                        const stringValue = (color as StringValue).value.toLowerCase();
                        for (let color in TextWindowColors) {
                            if (color.toLowerCase() === stringValue) {
                                engine.buffer.background = <any>TextWindowColors[color];
                                engine.notifications.backgroundColorChanged.publish(engine.buffer.background);
                                return;
                            }
                        }
                        break;
                    }
                }

                engine.terminate(new Diagnostic(ErrorCode.UnsupportedTextWindowColor, (instruction as StorePropertyInstruction).sourceRange, color.toValueString()));
            }
        }
    }
};
