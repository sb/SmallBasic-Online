import { LibraryTypeDefinition, LibraryMethodDefinition, LibraryPropertyDefinition } from "../supported-libraries";
import { DocumentationResources } from "../../../strings/documentation";
import { ExecutionEngine, ExecutionMode } from "../../execution-engine";
import { BaseValue } from "../values/base-value";
import { NumberValue } from "../values/number-value";
import { Diagnostic, ErrorCode } from "../../diagnostics";
import { TextRange } from "../../syntax/nodes/syntax-nodes";

export class StackLibrary implements LibraryTypeDefinition {
    private _stacks: { [name: string]: BaseValue[] } = {};

    private _pushValue: LibraryMethodDefinition = {
        description: DocumentationResources.Stack_PushValue,
        parameters: {
            "stackName": DocumentationResources.Stack_PushValue_StackName,
            "value": DocumentationResources.Stack_PushValue_Value
        },
        returnsValue: false,
        execute: (engine: ExecutionEngine) => {
            const value = engine.popEvaluationStack();
            const stackName = engine.popEvaluationStack().toValueString();

            if (!this._stacks[stackName]) {
                this._stacks[stackName] = [];
            }

            this._stacks[stackName].push(value);
            return true;
        }
    };

    private _getCount: LibraryMethodDefinition = {
        description: DocumentationResources.Stack_GetCount,
        parameters: {
            "stackName": DocumentationResources.Stack_GetCount_StackName
        },
        returnsValue: true,
        execute: (engine: ExecutionEngine) => {
            const stackName = engine.popEvaluationStack().toValueString();
            const count = this._stacks[stackName] ? this._stacks[stackName].length : 0;

            engine.pushEvaluationStack(new NumberValue(count));
            return true;
        }
    };

    private _popValue: LibraryMethodDefinition = {
        description: DocumentationResources.Stack_PopValue,
        parameters: {
            "stackName": DocumentationResources.Stack_PopValue_StackName
        },
        returnsValue: true,
        execute: (engine: ExecutionEngine, _: ExecutionMode, range: TextRange) => {
            const stackName = engine.popEvaluationStack().toValueString();

            if (this._stacks[stackName] && this._stacks[stackName].length) {
                engine.pushEvaluationStack(this._stacks[stackName].pop()!);
            } else {
                engine.terminate(new Diagnostic(ErrorCode.PoppingAnEmptyStack, range));
            }

            return true;
        }
    };

    public readonly description: string = DocumentationResources.Stack;

    public readonly methods: { readonly [name: string]: LibraryMethodDefinition } = {
        PushValue: this._pushValue,
        GetCount: this._getCount,
        PopValue: this._popValue
    };

    public readonly properties: { readonly [name: string]: LibraryPropertyDefinition } = {
    };
}
