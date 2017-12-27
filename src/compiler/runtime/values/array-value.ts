import { ExecutionEngine } from "../../execution-engine";
import { AddInstruction, DivideInstruction, MultiplyInstruction, SubtractInstruction } from "../../models/instructions";
import { Diagnostic, ErrorCode } from "../../utils/diagnostics";
import { TokenKindToString } from "../../utils/string-factories";
import { TokenKind } from "../../syntax/tokens";
import { BaseValue, ValueKind } from "./base-value";

export class ArrayValue extends BaseValue {
    public readonly value: { [key: string]: BaseValue } = {};

    public constructor() {
        super();
    }

    public toBoolean(): boolean {
        return false;
    }

    public toDisplayString(): string {
        return `[${Object.keys(this.value).map(key => `${key}=${this.value[key].toDisplayString()}`).join(", ")}]`;
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
                return this.toDisplayString() === other.toDisplayString();
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
        engine.terminate(new Diagnostic(ErrorCode.CannotUseOperatorWithAnArray, instruction.sourceRange, TokenKindToString(TokenKind.Plus)));
    }

    public subtract(_: BaseValue, engine: ExecutionEngine, instruction: SubtractInstruction): void {
        engine.terminate(new Diagnostic(ErrorCode.CannotUseOperatorWithAnArray, instruction.sourceRange, TokenKindToString(TokenKind.Minus)));
    }

    public multiply(_: BaseValue, engine: ExecutionEngine, instruction: MultiplyInstruction): void {
        engine.terminate(new Diagnostic(ErrorCode.CannotUseOperatorWithAnArray, instruction.sourceRange, TokenKindToString(TokenKind.Multiply)));
    }

    public divide(_: BaseValue, engine: ExecutionEngine, instruction: DivideInstruction): void {
        engine.terminate(new Diagnostic(ErrorCode.CannotUseOperatorWithAnArray, instruction.sourceRange, TokenKindToString(TokenKind.Divide)));
    }
}
