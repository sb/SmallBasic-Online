import { ExecutionEngine } from "../../execution-engine";
import { AddInstruction, DivideInstruction, MultiplyInstruction, SubtractInstruction } from "../../models/instructions";

export module Constants {
    export const True = "True";
    export const False = "False";
}

export enum ValueKind {
    String,
    Number,
    Array
}

export abstract class BaseValue {
    public abstract toBoolean(): boolean;
    public abstract toDebuggerString(): string;
    public abstract toValueString(): string;
    public abstract get kind(): ValueKind;

    public abstract tryConvertToNumber(): BaseValue;

    public abstract isEqualTo(other: BaseValue): boolean;
    public abstract isLessThan(other: BaseValue): boolean;
    public abstract isGreaterThan(other: BaseValue): boolean;

    public abstract add(other: BaseValue, engine: ExecutionEngine, instruction: AddInstruction): void;
    public abstract subtract(other: BaseValue, engine: ExecutionEngine, instruction: SubtractInstruction): void;
    public abstract multiply(other: BaseValue, engine: ExecutionEngine, instruction: MultiplyInstruction): void;
    public abstract divide(other: BaseValue, engine: ExecutionEngine, instruction: DivideInstruction): void;
}
