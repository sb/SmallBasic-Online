import { ExecutionEngine } from "../../execution-engine";
import { StringValue } from "./string-value";
import { AddInstruction, DivideInstruction, MultiplyInstruction, SubtractInstruction } from "../instructions";
import { Diagnostic, ErrorCode } from "../../diagnostics";
import { BaseValue, ValueKind } from "./base-value";
import { TokenKind, Token } from "../../syntax/nodes/tokens";

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

    public add(other: BaseValue, engine: ExecutionEngine, instruction: AddInstruction): void {
        let result: BaseValue | undefined;
        other = other.tryConvertToNumber();

        switch (other.kind) {
            case ValueKind.String:
                result = new StringValue(this.value.toString() + (other as StringValue).value);
                break;
            case ValueKind.Number:
                result = new NumberValue(this.value + (other as NumberValue).value);
                break;
            case ValueKind.Array:
                engine.terminate(new Diagnostic(ErrorCode.CannotUseOperatorWithAnArray, instruction.sourceRange, Token.toDisplayString(TokenKind.Plus)));
                return;
            default:
                throw new Error(`Unexpected value kind ${ValueKind[other.kind]}`);
        }

        engine.evaluationStack.push(result);
        engine.moveToNextInstruction();
    }

    public subtract(other: BaseValue, engine: ExecutionEngine, instruction: SubtractInstruction): void {
        other = other.tryConvertToNumber();

        switch (other.kind) {
            case ValueKind.String:
                engine.terminate(new Diagnostic(ErrorCode.CannotUseOperatorWithAString, instruction.sourceRange, Token.toDisplayString(TokenKind.Minus)));
                return;
            case ValueKind.Number:
                engine.evaluationStack.push(new NumberValue(this.value - (other as NumberValue).value));
                engine.moveToNextInstruction();
                return;
            case ValueKind.Array:
                engine.terminate(new Diagnostic(ErrorCode.CannotUseOperatorWithAnArray, instruction.sourceRange, Token.toDisplayString(TokenKind.Minus)));
                return;
            default:
                throw new Error(`Unexpected value kind ${ValueKind[other.kind]}`);
        }
    }

    public multiply(other: BaseValue, engine: ExecutionEngine, instruction: MultiplyInstruction): void {
        other = other.tryConvertToNumber();

        switch (other.kind) {
            case ValueKind.String:
                engine.terminate(new Diagnostic(ErrorCode.CannotUseOperatorWithAString, instruction.sourceRange, Token.toDisplayString(TokenKind.Multiply)));
                return;
            case ValueKind.Number:
                engine.evaluationStack.push(new NumberValue(this.value * (other as NumberValue).value));
                engine.moveToNextInstruction();
                return;
            case ValueKind.Array:
                engine.terminate(new Diagnostic(ErrorCode.CannotUseOperatorWithAnArray, instruction.sourceRange, Token.toDisplayString(TokenKind.Multiply)));
                return;
            default:
                throw new Error(`Unexpected value kind ${ValueKind[other.kind]}`);
        }
    }

    public divide(other: BaseValue, engine: ExecutionEngine, instruction: DivideInstruction): void {
        other = other.tryConvertToNumber();
        
        switch (other.kind) {
            case ValueKind.String:
                engine.terminate(new Diagnostic(ErrorCode.CannotUseOperatorWithAString, instruction.sourceRange, Token.toDisplayString(TokenKind.Divide)));
                return;
            case ValueKind.Number:
                const otherValue = (other as NumberValue).value;
                if (otherValue === 0) {
                    engine.terminate(new Diagnostic(ErrorCode.CannotDivideByZero, instruction.sourceRange));
                } else {
                    engine.evaluationStack.push(new NumberValue(this.value / otherValue));
                    engine.moveToNextInstruction();
                }
                return;
            case ValueKind.Array:
                engine.terminate(new Diagnostic(ErrorCode.CannotUseOperatorWithAnArray, instruction.sourceRange, Token.toDisplayString(TokenKind.Divide)));
                return;
            default:
                throw new Error(`Unexpected value kind ${ValueKind[other.kind]}`);
        }
    }
}
