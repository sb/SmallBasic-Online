import { ExecutionEngine, ExecutionMode, ExecutionState } from "../../execution-engine";
import { LibraryTypeDefinition } from "../supported-libraries";
import { ValueKind } from "../values/base-value";
import { StringValue } from "../values/string-value";
import { NumberValue } from "../values/number-value";

export const TextWindowLibrary: LibraryTypeDefinition = {
    methods: {
        "Read": {
            argumentsCount: 0,
            returnsValue: true,
            execute: (engine: ExecutionEngine, _: ExecutionMode) => {
                if (engine.buffer.hasValue()) {
                    const value = engine.buffer.readValue();
                    if (value.kind !== ValueKind.String) {
                        throw new Error(`Unexpected value kind: ${ValueKind[value.kind]}`);
                    }

                    engine.evaluationStack.push(value);
                    engine.executionStack.peek().instructionCounter++;

                    engine.state = ExecutionState.Running;
                } else {
                    engine.state = ExecutionState.BlockedOnStringInput;
                }
            }
        },
        "ReadNumber": {
            argumentsCount: 0,
            returnsValue: true,
            execute: (engine: ExecutionEngine, _: ExecutionMode) => {
                if (engine.buffer.hasValue()) {
                    const value = engine.buffer.readValue();
                    if (value.kind !== ValueKind.Number) {
                        throw new Error(`Unexpected value kind: ${ValueKind[value.kind]}`);
                    }

                    engine.evaluationStack.push(value);
                    engine.executionStack.peek().instructionCounter++;

                    engine.state = ExecutionState.Running;
                } else {
                    engine.state = ExecutionState.BlockedOnNumberInput;
                }
            }
        },
        "WriteLine": {
            argumentsCount: 1,
            returnsValue: false,
            execute: (engine: ExecutionEngine, _: ExecutionMode) => {
                if (engine.state === ExecutionState.BlockedOnOutput) {
                    if (!engine.buffer.hasValue()) {
                        engine.state = ExecutionState.Running;
                        engine.executionStack.peek().instructionCounter++;
                    }
                } else {
                    const value = engine.evaluationStack.pop();
                    engine.state = ExecutionState.BlockedOnOutput;

                    switch (value.kind) {
                        case ValueKind.Number:
                            engine.buffer.writeValue(new StringValue((value as NumberValue).value.toString()));
                            break;
                        case ValueKind.String:
                            engine.buffer.writeValue(value);
                            break;
                        case ValueKind.Array:
                            engine.buffer.writeValue(new StringValue(value.toDisplayString()));
                            break;
                    }
                }
            }
        }
    },
    properties: {
    }
};
