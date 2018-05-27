import { ExecutionEngine } from "../../execution-engine";
import { StringValue } from "./string-value";
import { AddInstruction, DivideInstruction, MultiplyInstruction, SubtractInstruction } from "../instructions";
import { Diagnostic, ErrorCode } from "../../diagnostics";
import { BaseValue, ValueKind } from "./base-value";
import { TokenKind } from "../../syntax/tokens";
import { CompilerUtils } from "../../compiler-utils";

export class NumberValue extends BaseValue {
    public constructor(public readonly value: number) {
        super();
    }

    public toBoolean(): boolean {
        return false;
    }

    public toDebuggerString(): string {
        return this.value.toString();
    }

    public toValueString(): string {
        return this.toDebuggerString();
    }

    public get kind(): ValueKind {
        return ValueKind.Number;
    }

    public tryConvertToNumber(): BaseValue {
        return this;
    }

    public isEqualTo(other: BaseValue): boolean {
        other = other.tryConvertToNumber();

        switch (other.kind) {
            case ValueKind.String:
                return this.value.toString() === (other as StringValue).value;
            case ValueKind.Number:
                return this.value === (other as NumberValue).value;
            case ValueKind.Array:
                return false;
            default:
                throw new Error(`Unexpected value kind ${ValueKind[other.kind]}`);
        }
    }

    public isLessThan(other: BaseValue): boolean {
        other = other.tryConvertToNumber();

        switch (other.kind) {
            case ValueKind.String:
            case ValueKind.Array:
                return false;
            case ValueKind.Number:
                return this.value < (other as NumberValue).value;
            default:
                throw new Error(`Unexpected value kind ${ValueKind[other.kind]}`);
        }
    }

    public isGreaterThan(other: BaseValue): boolean {
        other = other.tryConvertToNumber();

        switch (other.kind) {
            case ValueKind.String:
            case ValueKind.Array:
                return false;
            case ValueKind.Number:
                return this.value > (other as NumberValue).value;
            default:
                throw new Error(`Unexpected value kind ${ValueKind[other.kind]}`);
        }
    }

    public add(other: BaseValue, engine: ExecutionEngine, instruction: AddInstruction): BaseValue {
        other = other.tryConvertToNumber();

        switch (other.kind) {
            case ValueKind.String:
                return new StringValue(this.value.toString() + (other as StringValue).value);
            case ValueKind.Number:
                return new NumberValue(this.value + (other as NumberValue).value);
            case ValueKind.Array:
                engine.terminate(new Diagnostic(ErrorCode.CannotUseOperatorWithAnArray, instruction.sourceRange, CompilerUtils.tokenToDisplayString(TokenKind.Plus)));
                return this;
            default:
                throw new Error(`Unexpected value kind ${ValueKind[other.kind]}`);
        }
    }

    public subtract(other: BaseValue, engine: ExecutionEngine, instruction: SubtractInstruction): BaseValue {
        other = other.tryConvertToNumber();

        switch (other.kind) {
            case ValueKind.String:
                engine.terminate(new Diagnostic(ErrorCode.CannotUseOperatorWithAString, instruction.sourceRange, CompilerUtils.tokenToDisplayString(TokenKind.Minus)));
                return this;
            case ValueKind.Number:
                return new NumberValue(this.value - (other as NumberValue).value);
            case ValueKind.Array:
                engine.terminate(new Diagnostic(ErrorCode.CannotUseOperatorWithAnArray, instruction.sourceRange, CompilerUtils.tokenToDisplayString(TokenKind.Minus)));
                return this;
            default:
                throw new Error(`Unexpected value kind ${ValueKind[other.kind]}`);
        }
    }

    public multiply(other: BaseValue, engine: ExecutionEngine, instruction: MultiplyInstruction): BaseValue {
        other = other.tryConvertToNumber();

        switch (other.kind) {
            case ValueKind.String:
                engine.terminate(new Diagnostic(ErrorCode.CannotUseOperatorWithAString, instruction.sourceRange, CompilerUtils.tokenToDisplayString(TokenKind.Multiply)));
                return this;
            case ValueKind.Number:
                return new NumberValue(this.value * (other as NumberValue).value);
            case ValueKind.Array:
                engine.terminate(new Diagnostic(ErrorCode.CannotUseOperatorWithAnArray, instruction.sourceRange, CompilerUtils.tokenToDisplayString(TokenKind.Multiply)));
                return this;
            default:
                throw new Error(`Unexpected value kind ${ValueKind[other.kind]}`);
        }
    }

    public divide(other: BaseValue, engine: ExecutionEngine, instruction: DivideInstruction): BaseValue {
        other = other.tryConvertToNumber();

        switch (other.kind) {
            case ValueKind.String:
                engine.terminate(new Diagnostic(ErrorCode.CannotUseOperatorWithAString, instruction.sourceRange, CompilerUtils.tokenToDisplayString(TokenKind.Divide)));
                return this;
            case ValueKind.Number:
                const otherValue = (other as NumberValue).value;
                if (otherValue === 0) {
                    engine.terminate(new Diagnostic(ErrorCode.CannotDivideByZero, instruction.sourceRange));
                    return this;
                } else {
                    return new NumberValue(this.value / otherValue);
                }
            case ValueKind.Array:
                engine.terminate(new Diagnostic(ErrorCode.CannotUseOperatorWithAnArray, instruction.sourceRange, CompilerUtils.tokenToDisplayString(TokenKind.Divide)));
                return this;
            default:
                throw new Error(`Unexpected value kind ${ValueKind[other.kind]}`);
        }
    }
}
