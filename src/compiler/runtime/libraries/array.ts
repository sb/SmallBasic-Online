import { ValueKind, Constants, BaseValue } from "../values/base-value";
import { StringValue } from "../values/string-value";
import { ArrayValue } from "../values/array-value";
import { NumberValue } from "../values/number-value";
import { ExecutionEngine } from "../../execution-engine";
import { LibraryMethodInstance, LibraryTypeInstance, LibraryPropertyInstance } from "../libraries";

export class ArrayLibrary implements LibraryTypeInstance {
    private executeIsArray(engine: ExecutionEngine): boolean {
        const value = engine.popEvaluationStack();
        engine.pushEvaluationStack(new StringValue(value.kind === ValueKind.Array ? Constants.True : Constants.False));
        return true;
    }

    private executeGetItemCount(engine: ExecutionEngine): boolean {
        const array = engine.popEvaluationStack();
        const itemCount = array.kind === ValueKind.Array
            ? Object.keys((array as ArrayValue).values).length
            : 0;

        engine.pushEvaluationStack(new NumberValue(itemCount));
        return true;
    }

    private executeGetAllIndices(engine: ExecutionEngine): boolean {
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

    private executeContainsValue(engine: ExecutionEngine): boolean {
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

    private executeContainsIndex(engine: ExecutionEngine): boolean {
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

    public readonly methods: { readonly [name: string]: LibraryMethodInstance } = {
        IsArray: { execute: this.executeIsArray },
        GetItemCount: { execute: this.executeGetItemCount },
        GetAllIndices: { execute: this.executeGetAllIndices },
        ContainsValue: { execute: this.executeContainsValue },
        ContainsIndex: { execute: this.executeContainsIndex }
    };

    public readonly properties: { readonly [name: string]: LibraryPropertyInstance } = {
    };
}
