import { LibraryTypeDefinition, LibraryPropertyDefinition, LibraryMethodDefinition } from "../supported-libraries";
import { DocumentationResources } from "../../strings/documentation";
import { ValueKind, Constants, BaseValue } from "../values/base-value";
import { StringValue } from "../values/string-value";
import { ArrayValue } from "../values/array-value";
import { NumberValue } from "../values/number-value";
import { ExecutionEngine } from "../../execution-engine";

export class ArrayLibrary implements LibraryTypeDefinition {
    public readonly description: string = DocumentationResources.Clock;

    public readonly methods: { readonly [name: string]: LibraryMethodDefinition } = {
        ContainsIndex: {
            description: DocumentationResources.Array_ContainsIndex,
            parameters: {
                array: DocumentationResources.Array_ContainsIndex_Array,
                index: DocumentationResources.Array_ContainsIndex_Index
            },
            returnsValue: true,
            execute: (engine: ExecutionEngine) => {
                const index = engine.evaluationStack.pop()!.tryConvertToNumber();
                const array = engine.evaluationStack.pop()!;
                let result = Constants.False;

                if (array.kind === ValueKind.Array) {
                    if (index.kind === ValueKind.Number || index.kind === ValueKind.String)
                        if ((array as ArrayValue).value[index.toValueString()]) {
                            result = Constants.True;
                        }
                }

                engine.evaluationStack.push(new StringValue(result));
                engine.moveToNextInstruction();
            }
        },
        ContainsValue: {
            description: DocumentationResources.Array_ContainsValue,
            parameters: {
                array: DocumentationResources.Array_ContainsValue_Array,
                index: DocumentationResources.Array_ContainsValue_Index
            },
            returnsValue: true,
            execute: (engine: ExecutionEngine) => {
                const value = engine.evaluationStack.pop()!;
                const array = engine.evaluationStack.pop()!;
                let result = Constants.False;

                if (array.kind === ValueKind.Array) {
                    const arrayValue = (array as ArrayValue).value;
                    for (let key in arrayValue) {
                        if (arrayValue[key].isEqualTo(value)) {
                            result = Constants.True;
                            break;
                        }
                    }
                }

                engine.evaluationStack.push(new StringValue(result));
                engine.moveToNextInstruction();
            }
        },
        GetAllIndices: {
            description: DocumentationResources.Array_GetAllIndices,
            parameters: {
                array: DocumentationResources.Array_GetAllIndices_Array
            },
            returnsValue: true,
            execute: (engine: ExecutionEngine) => {
                const array = engine.evaluationStack.pop()!;
                const newArray: { [key: string]: BaseValue } = {};

                if (array.kind === ValueKind.Array) {
                    Object.keys((array as ArrayValue).value).forEach((key, i) => {
                        newArray[i + 1] = new StringValue(key);
                    });
                }

                engine.evaluationStack.push(new ArrayValue(newArray));
                engine.moveToNextInstruction();
            }
        },
        GetItemCount: {
            description: DocumentationResources.Array_GetItemCount,
            parameters: {
                array: DocumentationResources.Array_GetItemCount_Array
            },
            returnsValue: true,
            execute: (engine: ExecutionEngine) => {
                const array = engine.evaluationStack.pop()!;
                const itemCount = array.kind === ValueKind.Array
                    ? Object.keys((array as ArrayValue).value).length
                    : 0;

                engine.evaluationStack.push(new NumberValue(itemCount));
                engine.moveToNextInstruction();
            }
        },
        IsArray: {
            description: DocumentationResources.Array_IsArray,
            parameters: {
                value: DocumentationResources.Array_IsArray_Value
            },
            returnsValue: true,
            execute: (engine: ExecutionEngine) => {
                const value = engine.evaluationStack.pop()!;

                engine.evaluationStack.push(new StringValue(value.kind === ValueKind.Array ? Constants.True : Constants.False));
                engine.moveToNextInstruction();
            }
        }
    };

    public readonly properties: { readonly [name: string]: LibraryPropertyDefinition } = {
    };
}
