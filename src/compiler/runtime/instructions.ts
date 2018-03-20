import { TextRange } from "../syntax/nodes/syntax-nodes";
import { ExecutionEngine, ExecutionMode, StackFrame } from "../execution-engine";
import { StringValue } from "./values/string-value";
import { ValueKind, BaseValue, Constants } from "./values/base-value";
import { NumberValue } from "./values/number-value";
import { ErrorCode, Diagnostic } from "../diagnostics";
import { Token, TokenKind } from "../syntax/nodes/tokens";
import { ArrayValue } from "./values/array-value";

export enum InstructionKind {
    TempLabel,
    TempJump,
    TempConditionalJump,
    Jump,
    ConditionalJump,
    CallSubModule,
    StoreVariable,
    StoreArrayElement,
    StoreProperty,
    LoadVariable,
    LoadArrayElement,
    LoadProperty,
    MethodCall,
    Negate,
    Equal,
    LessThan,
    GreaterThan,
    LessThanOrEqual,
    GreaterThanOrEqual,
    Add,
    Subtract,
    Multiply,
    Divide,
    PushNumber,
    PushString
}

export abstract class BaseInstruction {
    public constructor(
        public readonly kind: InstructionKind,
        public readonly sourceRange: TextRange) {
    }

    public abstract execute(engine: ExecutionEngine, mode: ExecutionMode, frame: StackFrame): void;
}

export class TempLabelInstruction extends BaseInstruction {
    public constructor(
        public readonly name: string,
        range: TextRange) {
        super(InstructionKind.TempLabel, range);
    }

    public execute(_1: ExecutionEngine, _2: ExecutionMode, _3: StackFrame): void {
        throw new Error("This should have been removed during emit");
    }
}

export class TempJumpInstruction extends BaseInstruction {
    public constructor(
        public readonly target: string,
        range: TextRange) {
        super(InstructionKind.TempJump, range);
    }

    public execute(_1: ExecutionEngine, _2: ExecutionMode, _3: StackFrame): void {
        throw new Error("This should have been removed during emit");
    }
}

export class TempConditionalJumpInstruction extends BaseInstruction {
    public constructor(
        public readonly trueTarget: string | undefined,
        public readonly falseTarget: string | undefined,
        range: TextRange) {
        super(InstructionKind.TempConditionalJump, range);
    }

    public execute(_1: ExecutionEngine, _2: ExecutionMode, _3: StackFrame): void {
        throw new Error("This should have been removed during emit");
    }
}

export class JumpInstruction extends BaseInstruction {
    public constructor(
        public readonly target: number,
        range: TextRange) {
        super(InstructionKind.Jump, range);
    }

    public execute(_1: ExecutionEngine, _2: ExecutionMode, frame: StackFrame): void {
        frame.instructionIndex = this.target;
    }
}

export class ConditionalJumpInstruction extends BaseInstruction {
    public constructor(
        public readonly trueTarget: number | undefined,
        public readonly falseTarget: number | undefined,
        range: TextRange) {
        super(InstructionKind.ConditionalJump, range);
    }

    public execute(engine: ExecutionEngine, _2: ExecutionMode, frame: StackFrame): void {
        const value = engine.popEvaluationStack();
        if (value.toBoolean()) {
            if (this.trueTarget) {
                frame.instructionIndex = this.trueTarget;
            } else {
                frame.instructionIndex++;
            }
        } else {
            if (this.falseTarget) {
                frame.instructionIndex = this.falseTarget;
            } else {
                frame.instructionIndex++;
            }
        }
    }
}

export class CallSubModuleInstruction extends BaseInstruction {
    public constructor(
        public readonly name: string,
        range: TextRange) {
        super(InstructionKind.CallSubModule, range);
    }

    public execute(engine: ExecutionEngine, _2: ExecutionMode, frame: StackFrame): void {
        frame.instructionIndex++;
        engine.pushSubModule(this.name);
    }
}

export class StoreVariableInstruction extends BaseInstruction {
    public constructor(
        public readonly name: string,
        range: TextRange) {
        super(InstructionKind.StoreVariable, range);
    }

    public execute(engine: ExecutionEngine, _2: ExecutionMode, frame: StackFrame): void {
        const value = engine.popEvaluationStack();
        engine.memory.setIndex(this.name, value);
        frame.instructionIndex++;
    }
}

export class StoreArrayElementInstruction extends BaseInstruction {
    public constructor(
        public readonly name: string,
        public readonly indices: number,
        range: TextRange) {
        super(InstructionKind.StoreArrayElement, range);
    }

    public execute(engine: ExecutionEngine, _2: ExecutionMode, frame: StackFrame): void {
        const value = engine.popEvaluationStack();

        let index = this.name;
        let current = engine.memory;
        let remainingIndices = this.indices;

        while (remainingIndices-- > 0) {
            if (!current.values[index] || current.values[index].kind !== ValueKind.Array) {
                current.setIndex(index, new ArrayValue());
            }

            current = current.values[index] as ArrayValue;

            const indexValue = engine.popEvaluationStack();
            switch (indexValue.kind) {
                case ValueKind.Number:
                case ValueKind.String:
                    index = indexValue.toValueString();
                    break;
                case ValueKind.Array:
                    engine.terminate(new Diagnostic(ErrorCode.CannotUseAnArrayAsAnIndexToAnotherArray, this.sourceRange));
                    return;
                default:
                    throw new Error(`Unexpected value kind ${ValueKind[indexValue.kind]}`);
            }
        }

        current.setIndex(index, value);
        frame.instructionIndex++;
    }
}

export class StorePropertyInstruction extends BaseInstruction {
    public constructor(
        public readonly library: string,
        public readonly property: string,
        range: TextRange) {
        super(InstructionKind.StoreProperty, range);
    }

    public execute(engine: ExecutionEngine, _2: ExecutionMode, frame: StackFrame): void {
        const setter = engine.libraries[this.library].properties[this.property].setter;

        if (!setter) {
            throw new Error(`Property ${this.library}.${this.property} has no setter`);
        }

        const value = engine.popEvaluationStack();
        setter(value);
        frame.instructionIndex++;
    }
}

export class LoadVariableInstruction extends BaseInstruction {
    public constructor(
        public readonly name: string,
        range: TextRange) {
        super(InstructionKind.LoadVariable, range);
    }

    public execute(engine: ExecutionEngine, _2: ExecutionMode, frame: StackFrame): void {
        let value = engine.memory.values[this.name];

        if (!value) {
            value = new StringValue("");
        }

        engine.pushEvaluationStack(value);
        frame.instructionIndex++;
    }
}

export class LoadArrayElementInstruction extends BaseInstruction {
    public constructor(
        public readonly name: string,
        public readonly indices: number,
        range: TextRange) {
        super(InstructionKind.LoadArrayElement, range);
    }

    public execute(engine: ExecutionEngine, _2: ExecutionMode, frame: StackFrame): void {
        let index = this.name;
        let remainingIndices = this.indices;
        let current = engine.memory;

        while (remainingIndices-- > 0) {
            if (!current.values[index] || current.values[index].kind !== ValueKind.Array) {
                current.setIndex(index, new ArrayValue());
            }

            current = current.values[index] as ArrayValue;

            const indexValue = engine.popEvaluationStack();
            switch (indexValue.kind) {
                case ValueKind.Number:
                case ValueKind.String:
                    index = indexValue.toValueString();
                    break;
                case ValueKind.Array:
                    engine.terminate(new Diagnostic(ErrorCode.CannotUseAnArrayAsAnIndexToAnotherArray, this.sourceRange));
                    return;
                default:
                    throw new Error(`Unexpected value kind ${ValueKind[indexValue.kind]}`);
            }
        }

        if (!current.values[index]) {
            current.setIndex(index, new StringValue(""));
        }

        engine.pushEvaluationStack(current.values[index]);
        frame.instructionIndex++;
    }
}

export class LoadPropertyInstruction extends BaseInstruction {
    public constructor(
        public readonly library: string,
        public readonly property: string,
        range: TextRange) {
        super(InstructionKind.LoadProperty, range);
    }

    public execute(engine: ExecutionEngine, _2: ExecutionMode, frame: StackFrame): void {
        const getter = engine.libraries[this.library].properties[this.property].getter;

        if (!getter) {
            throw new Error(`Property ${this.library}.${this.property} has no getter`);
        }

        const value = getter();
        engine.pushEvaluationStack(value);
        frame.instructionIndex++;
    }
}

export class MethodCallInstruction extends BaseInstruction {
    public constructor(
        public readonly library: string,
        public readonly method: string,
        range: TextRange) {
        super(InstructionKind.MethodCall, range);
    }

    public execute(engine: ExecutionEngine, mode: ExecutionMode, frame: StackFrame): void {
        const shouldContinue = engine.libraries[this.library].methods[this.method].execute(engine, mode, this.sourceRange);
        if (shouldContinue) {
            frame.instructionIndex++;
        }
    }
}

export class NegateInstruction extends BaseInstruction {
    public constructor(
        range: TextRange) {
        super(InstructionKind.Negate, range);
    }

    public execute(engine: ExecutionEngine, _2: ExecutionMode, frame: StackFrame): void {
        const value = engine.popEvaluationStack().tryConvertToNumber();
        switch (value.kind) {
            case ValueKind.Number:
                engine.pushEvaluationStack(new NumberValue(-(value as NumberValue).value));
                frame.instructionIndex++;
                break;
            case ValueKind.String:
                engine.terminate(new Diagnostic(ErrorCode.CannotUseOperatorWithAString, this.sourceRange, Token.toDisplayString(TokenKind.Minus)));
                break;
            case ValueKind.Array:
                engine.terminate(new Diagnostic(ErrorCode.CannotUseOperatorWithAnArray, this.sourceRange, Token.toDisplayString(TokenKind.Minus)));
                break;
            default:
                throw new Error(`Unexpected value kind ${ValueKind[value.kind]}`);
        }
    }
}

export abstract class BaseBinaryInstruction extends BaseInstruction {
    public constructor(
        public readonly kind: InstructionKind,
        public readonly sourceRange: TextRange) {
        super(kind, sourceRange);
    }

    public execute(engine: ExecutionEngine, _2: ExecutionMode, frame: StackFrame): void {
        const rightHandSide = engine.popEvaluationStack();
        const leftHandSide = engine.popEvaluationStack();
        const result = this.calculateResult(engine, rightHandSide, leftHandSide);

        engine.pushEvaluationStack(result);
        frame.instructionIndex++;
    }

    protected abstract calculateResult(engine: ExecutionEngine, rightHandSide: BaseValue, leftHandSide: BaseValue): BaseValue;
}

export class EqualInstruction extends BaseBinaryInstruction {
    public constructor(
        range: TextRange) {
        super(InstructionKind.Equal, range);
    }

    protected calculateResult(_: ExecutionEngine, rightHandSide: BaseValue, leftHandSide: BaseValue): BaseValue {
        if (leftHandSide.isEqualTo(rightHandSide)) {
            return new StringValue(Constants.True);
        } else {
            return new StringValue(Constants.False);
        }
    }
}

export class LessThanInstruction extends BaseBinaryInstruction {
    public constructor(
        range: TextRange) {
        super(InstructionKind.LessThan, range);
    }

    protected calculateResult(_: ExecutionEngine, rightHandSide: BaseValue, leftHandSide: BaseValue): BaseValue {
        if (leftHandSide.isLessThan(rightHandSide)) {
            return new StringValue(Constants.True);
        } else {
            return new StringValue(Constants.False);
        }
    }
}

export class GreaterThanInstruction extends BaseBinaryInstruction {
    public constructor(
        range: TextRange) {
        super(InstructionKind.GreaterThan, range);
    }

    protected calculateResult(_: ExecutionEngine, rightHandSide: BaseValue, leftHandSide: BaseValue): BaseValue {
        if (leftHandSide.isGreaterThan(rightHandSide)) {
            return new StringValue(Constants.True);
        } else {
            return new StringValue(Constants.False);
        }
    }
}

export class LessThanOrEqualInstruction extends BaseBinaryInstruction {
    public constructor(
        range: TextRange) {
        super(InstructionKind.LessThanOrEqual, range);
    }

    protected calculateResult(_: ExecutionEngine, rightHandSide: BaseValue, leftHandSide: BaseValue): BaseValue {
        if (leftHandSide.isLessThan(rightHandSide) || leftHandSide.isEqualTo(rightHandSide)) {
            return new StringValue(Constants.True);
        } else {
            return new StringValue(Constants.False);
        }
    }
}

export class GreaterThanOrEqualInstruction extends BaseBinaryInstruction {
    public constructor(
        range: TextRange) {
        super(InstructionKind.GreaterThanOrEqual, range);
    }

    protected calculateResult(_: ExecutionEngine, rightHandSide: BaseValue, leftHandSide: BaseValue): BaseValue {
        if (leftHandSide.isGreaterThan(rightHandSide) || leftHandSide.isEqualTo(rightHandSide)) {
            return new StringValue(Constants.True);
        } else {
            return new StringValue(Constants.False);
        }
    }
}

export class AddInstruction extends BaseBinaryInstruction {
    public constructor(
        range: TextRange) {
        super(InstructionKind.Add, range);
    }

    protected calculateResult(engine: ExecutionEngine, rightHandSide: BaseValue, leftHandSide: BaseValue): BaseValue {
        return leftHandSide.add(rightHandSide, engine, this);
    }
}

export class SubtractInstruction extends BaseBinaryInstruction {
    public constructor(
        range: TextRange) {
        super(InstructionKind.Subtract, range);
    }

    protected calculateResult(engine: ExecutionEngine, rightHandSide: BaseValue, leftHandSide: BaseValue): BaseValue {
        return leftHandSide.subtract(rightHandSide, engine, this);
    }
}

export class MultiplyInstruction extends BaseBinaryInstruction {
    public constructor(
        range: TextRange) {
        super(InstructionKind.Multiply, range);
    }

    protected calculateResult(engine: ExecutionEngine, rightHandSide: BaseValue, leftHandSide: BaseValue): BaseValue {
        return leftHandSide.multiply(rightHandSide, engine, this);
    }
}

export class DivideInstruction extends BaseBinaryInstruction {
    public constructor(
        range: TextRange) {
        super(InstructionKind.Divide, range);
    }

    protected calculateResult(engine: ExecutionEngine, rightHandSide: BaseValue, leftHandSide: BaseValue): BaseValue {
        return leftHandSide.divide(rightHandSide, engine, this);
    }
}

export class PushNumberInstruction extends BaseInstruction {
    public constructor(
        public readonly value: number,
        range: TextRange) {
        super(InstructionKind.PushNumber, range);
    }

    public execute(engine: ExecutionEngine, _2: ExecutionMode, frame: StackFrame): void {
        engine.pushEvaluationStack(new NumberValue(this.value));
        frame.instructionIndex++;
    }
}

export class PushStringInstruction extends BaseInstruction {
    public constructor(
        public readonly value: string,
        range: TextRange) {
        super(InstructionKind.PushString, range);
    }

    public execute(engine: ExecutionEngine, _2: ExecutionMode, frame: StackFrame): void {
        engine.pushEvaluationStack(new StringValue(this.value));
        frame.instructionIndex++;
    }
}
