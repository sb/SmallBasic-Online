import { TextRange } from "../syntax/nodes/syntax-nodes";

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
}

export class TempLabelInstruction extends BaseInstruction {
    public constructor(
        public readonly name: string,
        range: TextRange) {
        super(InstructionKind.TempLabel, range);
    }
}

export class TempJumpInstruction extends BaseInstruction {
    public constructor(
        public readonly target: string,
        range: TextRange) {
        super(InstructionKind.TempJump, range);
    }
}

export class TempConditionalJumpInstruction extends BaseInstruction {
    public constructor(
        public readonly trueTarget: string | undefined,
        public readonly falseTarget: string | undefined,
        range: TextRange) {
        super(InstructionKind.TempConditionalJump, range);
    }
}

export class JumpInstruction extends BaseInstruction {
    public constructor(
        public readonly target: number,
        range: TextRange) {
        super(InstructionKind.Jump, range);
    }
}

export class ConditionalJumpInstruction extends BaseInstruction {
    public constructor(
        public readonly trueTarget: number | undefined,
        public readonly falseTarget: number | undefined,
        range: TextRange) {
        super(InstructionKind.ConditionalJump, range);
    }
}

export class CallSubModuleInstruction extends BaseInstruction {
    public constructor(
        public readonly name: string,
        range: TextRange) {
        super(InstructionKind.CallSubModule, range);
    }
}

export class StoreVariableInstruction extends BaseInstruction {
    public constructor(
        public readonly name: string,
        range: TextRange) {
        super(InstructionKind.StoreVariable, range);
    }
}

export class StoreArrayElementInstruction extends BaseInstruction {
    public constructor(
        public readonly name: string,
        public readonly indices: number,
        range: TextRange) {
        super(InstructionKind.StoreArrayElement, range);
    }
}

export class StorePropertyInstruction extends BaseInstruction {
    public constructor(
        public readonly library: string,
        public readonly property: string,
        range: TextRange) {
        super(InstructionKind.StoreProperty, range);
    }
}

export class LoadVariableInstruction extends BaseInstruction {
    public constructor(
        public readonly name: string,
        range: TextRange) {
        super(InstructionKind.LoadVariable, range);
    }
}

export class LoadArrayElementInstruction extends BaseInstruction {
    public constructor(
        public readonly name: string,
        public readonly indices: number,
        range: TextRange) {
        super(InstructionKind.LoadArrayElement, range);
    }
}

export class LoadPropertyInstruction extends BaseInstruction {
    public constructor(
        public readonly library: string,
        public readonly property: string,
        range: TextRange) {
        super(InstructionKind.LoadProperty, range);
    }
}

export class MethodCallInstruction extends BaseInstruction {
    public constructor(
        public readonly library: string,
        public readonly method: string,
        range: TextRange) {
        super(InstructionKind.MethodCall, range);
    }
}

export class NegateInstruction extends BaseInstruction {
    public constructor(
        range: TextRange) {
        super(InstructionKind.Negate, range);
    }
}

export class EqualInstruction extends BaseInstruction {
    public constructor(
        range: TextRange) {
        super(InstructionKind.Equal, range);
    }
}

export class LessThanInstruction extends BaseInstruction {
    public constructor(
        range: TextRange) {
        super(InstructionKind.LessThan, range);
    }
}

export class GreaterThanInstruction extends BaseInstruction {
    public constructor(
        range: TextRange) {
        super(InstructionKind.GreaterThan, range);
    }
}

export class LessThanOrEqualInstruction extends BaseInstruction {
    public constructor(
        range: TextRange) {
        super(InstructionKind.LessThanOrEqual, range);
    }
}

export class GreaterThanOrEqualInstruction extends BaseInstruction {
    public constructor(
        range: TextRange) {
        super(InstructionKind.GreaterThanOrEqual, range);
    }
}

export class AddInstruction extends BaseInstruction {
    public constructor(
        range: TextRange) {
        super(InstructionKind.Add, range);
    }
}

export class SubtractInstruction extends BaseInstruction {
    public constructor(
        range: TextRange) {
        super(InstructionKind.Subtract, range);
    }
}

export class MultiplyInstruction extends BaseInstruction {
    public constructor(
        range: TextRange) {
        super(InstructionKind.Multiply, range);
    }
}

export class DivideInstruction extends BaseInstruction {
    public constructor(
        range: TextRange) {
        super(InstructionKind.Divide, range);
    }
}

export class PushNumberInstruction extends BaseInstruction {
    public constructor(
        public readonly value: number,
        range: TextRange) {
        super(InstructionKind.PushNumber, range);
    }
}

export class PushStringInstruction extends BaseInstruction {
    public constructor(
        public readonly value: string,
        range: TextRange) {
        super(InstructionKind.PushString, range);
    }
}
