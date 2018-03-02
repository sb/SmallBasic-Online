import { ExecutionEngine } from "../../execution-engine";
import { AddInstruction, DivideInstruction, MultiplyInstruction, SubtractInstruction } from "../../models/instructions";
import { Diagnostic, ErrorCode } from "../../diagnostics";
import { BaseValue, ValueKind } from "./base-value";
import { Token, TokenKind } from "../../syntax/nodes/tokens";

export class ArrayValue extends BaseValue {
    public readonly value: { [key: string]: BaseValue };

    public constructor(value : { [key: string]: BaseValue } = {}) {
        super();
        this.value = value;
    }

    public toBoolean(): boolean {
        return false;
    }

    public toDebuggerString(): string {
        return `[${Object.keys(this.value).map(key => `${key}=${this.value[key].toDebuggerString()}`).join(", ")}]`;
    }

    public toValueString(): string {
        return this.toDebuggerString();
    }

    public get kind(): ValueKind {
        return ValueKind.Array;
    }
    
    public tryConvertToNumber(): BaseValue {
        return this;
    }

    public isEqualTo(other: BaseValue): boolean {
        switch (other.kind) {
            case ValueKind.String:
            case ValueKind.Number:
                return false;
            case ValueKind.Array:
                return this.toDebuggerString() === other.toDebuggerString();
            default:
                throw new Error(`Unexpected value kind ${ValueKind[other.kind]}`);
        }
    }

    public isLessThan(_: BaseValue): boolean {
        return false;
    }

    public isGreaterThan(_: BaseValue): boolean {
        return false;
    }

    public add(_: BaseValue, engine: ExecutionEngine, instruction: AddInstruction): void {
        engine.terminate(new Diagnostic(ErrorCode.CannotUseOperatorWithAnArray, instruction.sourceRange, Token.toDisplayString(TokenKind.Plus)));
    }

    public subtract(_: BaseValue, engine: ExecutionEngine, instruction: SubtractInstruction): void {
        engine.terminate(new Diagnostic(ErrorCode.CannotUseOperatorWithAnArray, instruction.sourceRange, Token.toDisplayString(TokenKind.Minus)));
    }

    public multiply(_: BaseValue, engine: ExecutionEngine, instruction: MultiplyInstruction): void {
        engine.terminate(new Diagnostic(ErrorCode.CannotUseOperatorWithAnArray, instruction.sourceRange, Token.toDisplayString(TokenKind.Multiply)));
    }

    public divide(_: BaseValue, engine: ExecutionEngine, instruction: DivideInstruction): void {
        engine.terminate(new Diagnostic(ErrorCode.CannotUseOperatorWithAnArray, instruction.sourceRange, Token.toDisplayString(TokenKind.Divide)));
    }
}
