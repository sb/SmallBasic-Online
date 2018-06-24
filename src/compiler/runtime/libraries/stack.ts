import { LibraryTypeInstance, LibraryMethodInstance, LibraryPropertyInstance } from "../libraries";
import { ExecutionEngine, ExecutionMode } from "../../execution-engine";
import { BaseValue } from "../values/base-value";
import { NumberValue } from "../values/number-value";
import { Diagnostic, ErrorCode } from "../../utils/diagnostics";
import { CompilerRange } from "../../syntax/ranges";

export class StackLibrary implements LibraryTypeInstance {
    private _stacks: { [name: string]: BaseValue[] } = {};

    private executePushValue(engine: ExecutionEngine): boolean {
        const value = engine.popEvaluationStack();
        const stackName = engine.popEvaluationStack().toValueString();

        if (!this._stacks[stackName]) {
            this._stacks[stackName] = [];
        }

        this._stacks[stackName].push(value);
        return true;
    }

    private executeGetCount(engine: ExecutionEngine): boolean {
        const stackName = engine.popEvaluationStack().toValueString();
        const count = this._stacks[stackName] ? this._stacks[stackName].length : 0;

        engine.pushEvaluationStack(new NumberValue(count));
        return true;
    }

    private executePopValue(engine: ExecutionEngine, _: ExecutionMode, range: CompilerRange): boolean {
        const stackName = engine.popEvaluationStack().toValueString();

        if (this._stacks[stackName] && this._stacks[stackName].length) {
            engine.pushEvaluationStack(this._stacks[stackName].pop()!);
        } else {
            engine.terminate(new Diagnostic(ErrorCode.PoppingAnEmptyStack, range));
        }

        return true;
    }

    public readonly methods: { readonly [name: string]: LibraryMethodInstance } = {
        PushValue: { execute: this.executePushValue.bind(this) },
        GetCount: { execute: this.executeGetCount.bind(this) },
        PopValue: { execute: this.executePopValue.bind(this) }
    };

    public readonly properties: { readonly [name: string]: LibraryPropertyInstance } = {
    };
}
