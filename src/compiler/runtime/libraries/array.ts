import { LibraryTypeDefinition, LibraryPropertyDefinition, LibraryMethodDefinition } from "../supported-libraries";
import { DocumentationResources } from "../../strings/documentation";
import { ValueKind, Constants, BaseValue } from "../values/base-value";
import { StringValue } from "../values/string-value";
import { ArrayValue } from "../values/array-value";
import { NumberValue } from "../values/number-value";
import { ExecutionEngine } from "../../execution-engine";

export class ArrayLibrary implements LibraryTypeDefinition {
    private _isArray: LibraryMethodDefinition = {
        description: DocumentationResources.Array_IsArray,
        parameters: {
            value: DocumentationResources.Array_IsArray_Value
        },
        returnsValue: true,
        execute: (engine: ExecutionEngine) => {
            const value = engine.popEvaluationStack();
            engine.pushEvaluationStack(new StringValue(value.kind === ValueKind.Array ? Constants.True : Constants.False));
            return true;
        }
    };

    private _getItemCount: LibraryMethodDefinition = {
        description: DocumentationResources.Array_GetItemCount,
        parameters: {
            array: DocumentationResources.Array_GetItemCount_Array
        },
        returnsValue: true,
        execute: (engine: ExecutionEngine) => {
            const array = engine.popEvaluationStack();
            const itemCount = array.kind === ValueKind.Array
                ? Object.keys((array as ArrayValue).values).length
                : 0;

            engine.pushEvaluationStack(new NumberValue(itemCount));
            return true;
        }
    };

    private _getAllIndices: LibraryMethodDefinition = {
        description: DocumentationResources.Array_GetAllIndices,
        parameters: {
            array: DocumentationResources.Array_GetAllIndices_Array
        },
        returnsValue: true,
        execute: (engine: ExecutionEngine) => {
            const array = engine.popEvaluationStack();
            const newArray: { [key: string]: BaseValue } = {};

            if (array.kind === ValueKind.Array) {
                Object.keys((array as ArrayValue).values).forEach((key, i) => {
                    newArray[i + 1] = new StringValue(key);
                });
            }

            engine.pushEvaluationStack(new ArrayValue(newArray));
            return true;
        }
    };

    private _containsValue: LibraryMethodDefinition = {
        description: DocumentationResources.Array_ContainsValue,
        parameters: {
            array: DocumentationResources.Array_ContainsValue_Array,
            index: DocumentationResources.Array_ContainsValue_Index
        },
        returnsValue: true,
        execute: (engine: ExecutionEngine) => {
            const value = engine.popEvaluationStack();
            const array = engine.popEvaluationStack();
            let result = Constants.False;

            if (array.kind === ValueKind.Array) {
                const arrayValue = (array as ArrayValue).values;
                for (let key in arrayValue) {
                    if (arrayValue[key].isEqualTo(value)) {
                        result = Constants.True;
                        break;
                    }
                }
            }

            engine.pushEvaluationStack(new StringValue(result));
            return true;
        }
    };

    private _containsIndex: LibraryMethodDefinition = {
        description: DocumentationResources.Array_ContainsIndex,
        parameters: {
            array: DocumentationResources.Array_ContainsIndex_Array,
            index: DocumentationResources.Array_ContainsIndex_Index
        },
        returnsValue: true,
        execute: (engine: ExecutionEngine) => {
            const index = engine.popEvaluationStack().tryConvertToNumber();
            const array = engine.popEvaluationStack();
            let result = Constants.False;

            if (array.kind === ValueKind.Array) {
                if (index.kind === ValueKind.Number || index.kind === ValueKind.String)
                    if ((array as ArrayValue).values[index.toValueString()]) {
                        result = Constants.True;
                    }
            }

            engine.pushEvaluationStack(new StringValue(result));
            return true;
        }
    };

    public readonly description: string = DocumentationResources.Clock;

    public readonly methods: { readonly [name: string]: LibraryMethodDefinition } = {
        ContainsIndex: this._containsIndex,
        ContainsValue: this._containsValue,
        GetAllIndices: this._getAllIndices,
        GetItemCount: this._getItemCount,
        IsArray: this._isArray
    };

    public readonly properties: { readonly [name: string]: LibraryPropertyDefinition } = {
    };
}
