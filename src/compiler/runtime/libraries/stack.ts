import { LibraryTypeDefinition, LibraryMethodDefinition, LibraryPropertyDefinition } from "../supported-libraries";
import { DocumentationResources } from "../../strings/documentation";
import { ExecutionEngine, ExecutionMode } from "../../execution-engine";
import { BaseValue } from "../values/base-value";
import { NumberValue } from "../values/number-value";
import { Diagnostic, ErrorCode } from "../../utils/diagnostics";
import { BaseInstruction, MethodCallInstruction } from "../../models/instructions";

export class StackLibrary implements LibraryTypeDefinition {
    private _stacks: { [name: string]: BaseValue[] } = {};

    public readonly description: string = DocumentationResources.Stack;

    public readonly methods: { readonly [name: string]: LibraryMethodDefinition } = {
        PushValue: {
            description: DocumentationResources.Stack_PushValue,
            parameters: {
                "stackName": DocumentationResources.Stack_PushValue_StackName,
                "value": DocumentationResources.Stack_PushValue_Value
            },
            returnsValue: false,
            execute: (engine: ExecutionEngine) => {
                const value = engine.evaluationStack.pop()!;
                const stackName = engine.evaluationStack.pop()!.toValueString();

                if (!this._stacks[stackName]) {
                    this._stacks[stackName] = [];
                }

                this._stacks[stackName].push(value);
                engine.moveToNextInstruction();
            }
        },
        GetCount: {
            description: DocumentationResources.Stack_GetCount,
            parameters: {
                "stackName": DocumentationResources.Stack_GetCount_StackName
            },
            returnsValue: true,
            execute: (engine: ExecutionEngine) => {
                const stackName = engine.evaluationStack.pop()!.toValueString();
                const count = this._stacks[stackName] ? this._stacks[stackName].length : 0;

                engine.evaluationStack.push(new NumberValue(count));
                engine.moveToNextInstruction();
            }
        },
        PopValue: {
            description: DocumentationResources.Stack_PopValue,
            parameters: {
                "stackName": DocumentationResources.Stack_PopValue_StackName
            },
            returnsValue: true,
            execute: (engine: ExecutionEngine, _: ExecutionMode, instruction: BaseInstruction) => {
                const stackName = engine.evaluationStack.pop()!.toValueString();

                if (this._stacks[stackName] && this._stacks[stackName].length) {
                    engine.evaluationStack.push(this._stacks[stackName].pop()!);
                    engine.moveToNextInstruction();
                } else {
                    engine.terminate(new Diagnostic(ErrorCode.PoppingAnEmptyStack, (instruction as MethodCallInstruction).sourceRange));
                }
            }
        }
    };

    public readonly properties: { readonly [name: string]: LibraryPropertyDefinition } = {
    };
}
