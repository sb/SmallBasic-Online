import { NumberValue } from "./number-value";
import { ExecutionEngine } from "../../execution-engine";
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
        return `"${this.value.toString()}"`;
    }

    public get kind(): ValueKind {
        return ValueKind.String;
    }

    public tryConvertToNumber(): BaseValue {
        const number = parseFloat(this.value.trim());
        if (isNaN(number)) {
            return this;
        } else {
            return new NumberValue(number);
        }
    }

    public isEqualTo(other: BaseValue): boolean {
        switch (other.kind) {
            case ValueKind.String:
                return this.value === (other as StringValue).value;
            case ValueKind.Number:
                return this.value.trim() === (other as NumberValue).value.toString();
            case ValueKind.Array:
                return false;
            default:
                throw new Error(`Unexpected value kind ${ValueKind[other.kind]}`);
        }
    }

    public isLessThan(other: BaseValue): boolean {
        const thisConverted = this.tryConvertToNumber();
        if (thisConverted.tryConvertToNumber().kind === ValueKind.String) {
            return false;
        } else {
            return thisConverted.isLessThan(other);
        }
    }

    public isGreaterThan(other: BaseValue): boolean {
        const thisConverted = this.tryConvertToNumber();
        if (thisConverted.tryConvertToNumber().kind === ValueKind.String) {
            return false;
        } else {
            return thisConverted.isGreaterThan(other);
        }
    }

    public add(other: BaseValue, engine: ExecutionEngine, instruction: AddInstruction): void {
        const thisConverted = this.tryConvertToNumber();
        if (thisConverted.tryConvertToNumber().kind !== ValueKind.String) {
            return thisConverted.add(other, engine, instruction);
        }

        let result: BaseValue | undefined;
        other = other.tryConvertToNumber();

        switch (other.kind) {
            case ValueKind.String:
                result = new StringValue(this.value + (other as StringValue).value);
                break;
            case ValueKind.Number:
                result = new StringValue(this.value + (other as NumberValue).value.toString());
                break;
            case ValueKind.Array:
                engine.terminate(new Diagnostic(ErrorCode.CannotUseOperatorWithAnArray, instruction.sourceRange, TokenKindToString(TokenKind.Plus)));
                return;
            default:
                throw new Error(`Unexpected value kind ${ValueKind[other.kind]}`);
        }

        engine.evaluationStack.push(result);
        engine.executionStack.peek().instructionCounter++;
    }

    public subtract(other: BaseValue, engine: ExecutionEngine, instruction: SubtractInstruction): void {
        const thisConverted = this.tryConvertToNumber();
        if (thisConverted.tryConvertToNumber().kind === ValueKind.String) {
            engine.terminate(new Diagnostic(ErrorCode.CannotUseOperatorWithAString, instruction.sourceRange, TokenKindToString(TokenKind.Minus)));
        } else {
            return thisConverted.subtract(other, engine, instruction);
        }
    }

    public multiply(other: BaseValue, engine: ExecutionEngine, instruction: MultiplyInstruction): void {
        const thisConverted = this.tryConvertToNumber();
        if (thisConverted.tryConvertToNumber().kind === ValueKind.String) {
            engine.terminate(new Diagnostic(ErrorCode.CannotUseOperatorWithAString, instruction.sourceRange, TokenKindToString(TokenKind.Multiply)));
        } else {
            return thisConverted.multiply(other, engine, instruction);
        }
    }

    public divide(other: BaseValue, engine: ExecutionEngine, instruction: DivideInstruction): void {
        const thisConverted = this.tryConvertToNumber();
        if (thisConverted.tryConvertToNumber().kind === ValueKind.String) {
            engine.terminate(new Diagnostic(ErrorCode.CannotUseOperatorWithAString, instruction.sourceRange, TokenKindToString(TokenKind.Divide)));
        } else {
            return thisConverted.divide(other, engine, instruction);
        }
    }
}
