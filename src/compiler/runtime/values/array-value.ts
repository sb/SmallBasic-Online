import { ExecutionEngine, ExecutionState } from "../execution-engine";
import { StringValue } from "./string-value";
import { AddInstruction, DivideInstruction, MultiplyInstruction, SubtractInstruction } from "../../models/instructions";
import { Diagnostic, ErrorCode } from "../../utils/diagnostics";
import { TokenKindToString } from "../../utils/string-factories";
import { TokenKind } from "../../syntax/tokens";
import { BaseValue, ValueKind, Constants } from "./base-value";

export class ArrayValue extends BaseValue {
    public readonly value: { [key: string]: BaseValue } = {};

    public constructor() {
        super();
    }

    public toBoolean(): boolean {
        return Object.keys(this.value).length !== 0;
    }

    public toDisplayString(): string {
        return `[${Object.keys(this.value).map(key => `${key}=${this.value[key].toDisplayString()}`).join(" ")}]`;
    }

    public kind(): ValueKind {
        return ValueKind.Array;
    }

    public isEqualTo(other: BaseValue, engine: ExecutionEngine): void {
        let isEqual: boolean | undefined;

        switch (other.kind()) {
            case ValueKind.String:
                isEqual = false;
                break;
            case ValueKind.Number:
                isEqual = false;
                break;
            case ValueKind.Array:
                isEqual = this.toDisplayString() === other.toDisplayString();
                break;
            default:
                throw `Unexpected value kind ${ValueKind[other.kind()]}`;
        }

        engine.evaluationStack.push(new StringValue(isEqual ? Constants.True : Constants.False));
        engine.executionStack.peek().instructionCounter++;
    }

    public isLessThan(_: BaseValue, engine: ExecutionEngine): void {
        engine.evaluationStack.push(new StringValue(Constants.False));
        engine.executionStack.peek().instructionCounter++;
    }

    public add(_: BaseValue, engine: ExecutionEngine, instruction: AddInstruction): void {
        engine.context.exception = new Diagnostic(ErrorCode.CannotUseOperatorWithAnArray, instruction.sourceRange, TokenKindToString(TokenKind.Plus));
        engine.context.state = ExecutionState.Terminated;
    }

    public subtract(_: BaseValue, engine: ExecutionEngine, instruction: SubtractInstruction): void {
        engine.context.exception = new Diagnostic(ErrorCode.CannotUseOperatorWithAnArray, instruction.sourceRange, TokenKindToString(TokenKind.Minus));
        engine.context.state = ExecutionState.Terminated;
    }

    public multiply(_: BaseValue, engine: ExecutionEngine, instruction: MultiplyInstruction): void {
        engine.context.exception = new Diagnostic(ErrorCode.CannotUseOperatorWithAnArray, instruction.sourceRange, TokenKindToString(TokenKind.Multiply));
        engine.context.state = ExecutionState.Terminated;
    }

    public divide(_: BaseValue, engine: ExecutionEngine, instruction: DivideInstruction): void {
        engine.context.exception = new Diagnostic(ErrorCode.CannotUseOperatorWithAnArray, instruction.sourceRange, TokenKindToString(TokenKind.Divide));
        engine.context.state = ExecutionState.Terminated;
    }
}
