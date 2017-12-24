import { ExecutionEngine, ExecutionState } from "../execution-engine";
import { StringValue } from "./string-value";
import { AddInstruction, DivideInstruction, MultiplyInstruction, SubtractInstruction } from "../../models/instructions";
import { Diagnostic, ErrorCode } from "../../utils/diagnostics";
import { TokenKindToString } from "../../utils/string-factories";
import { TokenKind } from "../../syntax/tokens";
import { BaseValue, ValueKind, Constants } from "./base-value";

export class NumberValue extends BaseValue {
    public constructor(public readonly value: number) {
        super();
    }

    public toBoolean(): boolean {
        return this.value !== 0;
    }

    public toDisplayString(): string {
        return `"${this.value.toString()}"`;
    }

    public kind(): ValueKind {
        return ValueKind.Number;
    }

    public isEqualTo(other: BaseValue, engine: ExecutionEngine): void {
        let isEqual: boolean | undefined;

        switch (other.kind()) {
            case ValueKind.String:
                isEqual = this.value.toString() === (other as StringValue).value;
                break;
            case ValueKind.Number:
                isEqual = this.value === (other as NumberValue).value;
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

    public isLessThan(other: BaseValue, engine: ExecutionEngine): void {
        let isLessThan: boolean | undefined;

        switch (other.kind()) {
            case ValueKind.String:
                isLessThan = false;
                break;
            case ValueKind.Number:
                isLessThan = this.value < (other as NumberValue).value;
                break;
            case ValueKind.Array:
                isLessThan = false;
                break;
            default:
                throw `Unexpected value kind ${ValueKind[other.kind()]}`;
        }

        engine.evaluationStack.push(new StringValue(isLessThan ? Constants.True : Constants.False));
        engine.executionStack.peek().instructionCounter++;
    }

    public add(other: BaseValue, engine: ExecutionEngine, instruction: AddInstruction): void {
        let result: BaseValue | undefined;

        switch (other.kind()) {
            case ValueKind.String:
                result = new StringValue(this.value.toString() + (other as StringValue).value);
                break;
            case ValueKind.Number:
                result = new NumberValue(this.value + (other as NumberValue).value);
                break;
            case ValueKind.Array:
                engine.context.exception = new Diagnostic(ErrorCode.CannotUseOperatorWithAnArray, instruction.sourceRange, TokenKindToString(TokenKind.Plus));
                engine.context.state = ExecutionState.Terminated;
                return;
            default:
                throw `Unexpected value kind ${ValueKind[other.kind()]}`;
        }

        engine.evaluationStack.push(result);
        engine.executionStack.peek().instructionCounter++;
    }

    public subtract(other: BaseValue, engine: ExecutionEngine, instruction: SubtractInstruction): void {
        switch (other.kind()) {
            case ValueKind.String:
                engine.context.exception = new Diagnostic(ErrorCode.CannotUseOperatorWithAString, instruction.sourceRange, TokenKindToString(TokenKind.Minus));
                engine.context.state = ExecutionState.Terminated;
                return;
            case ValueKind.Number:
                engine.evaluationStack.push(new NumberValue(this.value - (other as NumberValue).value));
                engine.executionStack.peek().instructionCounter++;
                return;
            case ValueKind.Array:
                engine.context.exception = new Diagnostic(ErrorCode.CannotUseOperatorWithAnArray, instruction.sourceRange, TokenKindToString(TokenKind.Minus));
                engine.context.state = ExecutionState.Terminated;
                return;
            default:
                throw `Unexpected value kind ${ValueKind[other.kind()]}`;
        }
    }

    public multiply(other: BaseValue, engine: ExecutionEngine, instruction: MultiplyInstruction): void {
        switch (other.kind()) {
            case ValueKind.String:
                engine.context.exception = new Diagnostic(ErrorCode.CannotUseOperatorWithAString, instruction.sourceRange, TokenKindToString(TokenKind.Multiply));
                engine.context.state = ExecutionState.Terminated;
                return;
            case ValueKind.Number:
                engine.evaluationStack.push(new NumberValue(this.value * (other as NumberValue).value));
                engine.executionStack.peek().instructionCounter++;
                return;
            case ValueKind.Array:
                engine.context.exception = new Diagnostic(ErrorCode.CannotUseOperatorWithAnArray, instruction.sourceRange, TokenKindToString(TokenKind.Multiply));
                engine.context.state = ExecutionState.Terminated;
                return;
            default:
                throw `Unexpected value kind ${ValueKind[other.kind()]}`;
        }
    }

    public divide(other: BaseValue, engine: ExecutionEngine, instruction: DivideInstruction): void {
        switch (other.kind()) {
            case ValueKind.String:
                engine.context.exception = new Diagnostic(ErrorCode.CannotUseOperatorWithAString, instruction.sourceRange, TokenKindToString(TokenKind.Divide));
                engine.context.state = ExecutionState.Terminated;
                return;
            case ValueKind.Number:
                const otherValue = (other as NumberValue).value;
                if (otherValue === 0) {
                    engine.context.exception = new Diagnostic(ErrorCode.CannotDivideByZero, instruction.sourceRange);
                    engine.context.state = ExecutionState.Terminated;
                } else {
                    engine.evaluationStack.push(new NumberValue(this.value / otherValue));
                    engine.executionStack.peek().instructionCounter++;
                }
                return;
            case ValueKind.Array:
                engine.context.exception = new Diagnostic(ErrorCode.CannotUseOperatorWithAnArray, instruction.sourceRange, TokenKindToString(TokenKind.Divide));
                engine.context.state = ExecutionState.Terminated;
                return;
            default:
                throw `Unexpected value kind ${ValueKind[other.kind()]}`;
        }
    }
}
