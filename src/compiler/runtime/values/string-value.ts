import { NumberValue } from "./number-value";
import { ExecutionEngine } from "../../execution-engine";
import { AddInstruction, DivideInstruction, MultiplyInstruction, SubtractInstruction } from "../../emitting/instructions";
import { BaseValue, ValueKind, Constants } from "./base-value";
import { TokenKind } from "../../syntax/tokens";
import { ErrorCode, Diagnostic } from "../../utils/diagnostics";
import { CompilerUtils } from "../../utils/compiler-utils";

export class StringValue extends BaseValue {
    public constructor(public readonly value: string) {
        super();
    }

    public toBoolean(): boolean {
        return this.value.toLowerCase() === Constants.True.toLowerCase();
    }

    public toDebuggerString(): string {
        return `"${this.value.toString()}"`;
    }

    public toValueString(): string {
        return this.value;
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

    public add(other: BaseValue, engine: ExecutionEngine, instruction: AddInstruction): BaseValue {
        const thisConverted = this.tryConvertToNumber();
        if (thisConverted.tryConvertToNumber().kind !== ValueKind.String) {
            return thisConverted.add(other, engine, instruction);
        }

        other = other.tryConvertToNumber();
        switch (other.kind) {
            case ValueKind.String:
                return new StringValue(this.value + (other as StringValue).value);
            case ValueKind.Number:
                return new StringValue(this.value + (other as NumberValue).value.toString());
            case ValueKind.Array:
                engine.terminate(new Diagnostic(ErrorCode.CannotUseOperatorWithAnArray, instruction.sourceRange, CompilerUtils.tokenToDisplayString(TokenKind.Plus)));
                return this;
            default:
                throw new Error(`Unexpected value kind ${ValueKind[other.kind]}`);
        }
    }

    public subtract(other: BaseValue, engine: ExecutionEngine, instruction: SubtractInstruction): BaseValue {
        const thisConverted = this.tryConvertToNumber();
        if (thisConverted.tryConvertToNumber().kind === ValueKind.String) {
            engine.terminate(new Diagnostic(ErrorCode.CannotUseOperatorWithAString, instruction.sourceRange, CompilerUtils.tokenToDisplayString(TokenKind.Minus)));
            return this;
        } else {
            return thisConverted.subtract(other, engine, instruction);
        }
    }

    public multiply(other: BaseValue, engine: ExecutionEngine, instruction: MultiplyInstruction): BaseValue {
        const thisConverted = this.tryConvertToNumber();
        if (thisConverted.tryConvertToNumber().kind === ValueKind.String) {
            engine.terminate(new Diagnostic(ErrorCode.CannotUseOperatorWithAString, instruction.sourceRange, CompilerUtils.tokenToDisplayString(TokenKind.Multiply)));
            return this;
        } else {
            return thisConverted.multiply(other, engine, instruction);
        }
    }

    public divide(other: BaseValue, engine: ExecutionEngine, instruction: DivideInstruction): BaseValue {
        const thisConverted = this.tryConvertToNumber();
        if (thisConverted.tryConvertToNumber().kind === ValueKind.String) {
            engine.terminate(new Diagnostic(ErrorCode.CannotUseOperatorWithAString, instruction.sourceRange, CompilerUtils.tokenToDisplayString(TokenKind.Divide)));
            return this;
        } else {
            return thisConverted.divide(other, engine, instruction);
        }
    }
}
