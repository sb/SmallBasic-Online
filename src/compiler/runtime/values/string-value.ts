import { NumberValue } from "./number-value";
import { ExecutionEngine, ExecutionState } from "../execution-engine";
import { AddInstruction, DivideInstruction, MultiplyInstruction, SubtractInstruction } from "../../models/instructions";
import { Diagnostic, ErrorCode } from "../../utils/diagnostics";
import { TokenKindToString } from "../../utils/string-factories";
import { TokenKind } from "../../syntax/tokens";
import { BaseValue, ValueKind, Constants } from "./base-value";

export class StringValue extends BaseValue {
    public constructor(public readonly value: string) {
        super();
    }

    public toBoolean(): boolean {
        return this.value.toLowerCase() === Constants.True.toLowerCase();
    }

    public toDisplayString(): string {
        return this.value;
    }

    public kind(): ValueKind {
        return ValueKind.String;
    }

    public isEqualTo(other: BaseValue, engine: ExecutionEngine): void {
        let isEqual: boolean | undefined;

        switch (other.kind()) {
            case ValueKind.String:
                isEqual = this.value === (other as StringValue).value;
                break;
            case ValueKind.Number:
                isEqual = this.value === (other as NumberValue).value.toString();
                break;
            case ValueKind.Array:
                isEqual = false;
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

    public add(other: BaseValue, engine: ExecutionEngine, instruction: AddInstruction): void {
        let result: string | undefined;

        switch (other.kind()) {
            case ValueKind.String:
                result = this.value + (other as StringValue).value;
                break;
            case ValueKind.Number:
                result = this.value + (other as NumberValue).value.toString();
                break;
            case ValueKind.Array:
                engine.context.exception = new Diagnostic(ErrorCode.CannotUseOperatorWithAnArray, instruction.sourceRange, TokenKindToString(TokenKind.Plus));
                engine.context.state = ExecutionState.Terminated;
                return;
            default:
                throw `Unexpected value kind ${ValueKind[other.kind()]}`;
        }

        engine.evaluationStack.push(new StringValue(result));
        engine.executionStack.peek().instructionCounter++;
    }

    public subtract(_: BaseValue, engine: ExecutionEngine, instruction: SubtractInstruction): void {
        engine.context.exception = new Diagnostic(ErrorCode.CannotUseOperatorWithAString, instruction.sourceRange, TokenKindToString(TokenKind.Minus));
        engine.context.state = ExecutionState.Terminated;
    }

    public multiply(_: BaseValue, engine: ExecutionEngine, instruction: MultiplyInstruction): void {
        engine.context.exception = new Diagnostic(ErrorCode.CannotUseOperatorWithAString, instruction.sourceRange, TokenKindToString(TokenKind.Multiply));
        engine.context.state = ExecutionState.Terminated;
    }

    public divide(_: BaseValue, engine: ExecutionEngine, instruction: DivideInstruction): void {
        engine.context.exception = new Diagnostic(ErrorCode.CannotUseOperatorWithAString, instruction.sourceRange, TokenKindToString(TokenKind.Divide));
        engine.context.state = ExecutionState.Terminated;
    }
}
