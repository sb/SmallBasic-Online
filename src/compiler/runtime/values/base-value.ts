import { ExecutionEngine } from "../../execution-engine";
import { SubtractInstruction, AddInstruction, MultiplyInstruction, DivideInstruction } from "../../emitting/instructions";

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

    // TODO: add another helper that just returns a number and review callers?
    public abstract tryConvertToNumber(): BaseValue;

    public abstract isEqualTo(other: BaseValue): boolean;
    public abstract isLessThan(other: BaseValue): boolean;
    public abstract isGreaterThan(other: BaseValue): boolean;

    public abstract add(other: BaseValue, engine: ExecutionEngine, instruction: AddInstruction): BaseValue;
    public abstract subtract(other: BaseValue, engine: ExecutionEngine, instruction: SubtractInstruction): BaseValue;
    public abstract multiply(other: BaseValue, engine: ExecutionEngine, instruction: MultiplyInstruction): BaseValue;
    public abstract divide(other: BaseValue, engine: ExecutionEngine, instruction: DivideInstruction): BaseValue;
}
