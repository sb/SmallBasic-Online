import { StringValue } from "../values/string-value";
import { NumberValue } from "../values/number-value";
import { ExecutionEngine } from "../../execution-engine";
import { LibraryMethodInstance, LibraryTypeInstance, LibraryPropertyInstance, LibraryEventInstance } from "../libraries";

export class TextLibrary implements LibraryTypeInstance {
    private executeAppend(engine: ExecutionEngine): void {
        const text2 = engine.popEvaluationStack();
        const text1 = engine.popEvaluationStack();
        engine.pushEvaluationStack(new StringValue(text1.toValueString() + text2.toValueString()));
    }

    private executeGetLength(engine: ExecutionEngine): void {
        const text = engine.popEvaluationStack();
        engine.pushEvaluationStack(new NumberValue(text.toValueString().length));
    }

    public readonly methods: { readonly [name: string]: LibraryMethodInstance } = {
        Append: { execute: this.executeAppend.bind(this) },
        GetLength: { execute: this.executeGetLength.bind(this) }
    };

    public readonly properties: { readonly [name: string]: LibraryPropertyInstance } = {};

    public readonly events: { readonly [name: string]: LibraryEventInstance } = {};
}
