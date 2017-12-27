// This file is generated through a build task. Do not edit by hand.

import { TextRange } from "../syntax/text-markers";

export enum InstructionKind {
    StatementStart,
    TempLabel,
    TempJump,
    TempConditionalJump,
    Jump,
    ConditionalJump,
    CallSubModule,
    CallLibraryMethod,
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
    PushString,
    Return
}

export interface BaseInstruction {
    readonly kind: InstructionKind;
}

export interface StatementStartInstruction extends BaseInstruction {
    readonly line: number;
}

export interface TempLabelInstruction extends BaseInstruction {
    readonly name: string;
}

export interface TempJumpInstruction extends BaseInstruction {
    readonly target: string;
}

export interface TempConditionalJumpInstruction extends BaseInstruction {
    readonly trueTarget: string | undefined;
    readonly falseTarget: string | undefined;
}

export interface JumpInstruction extends BaseInstruction {
    readonly target: number;
}

export interface ConditionalJumpInstruction extends BaseInstruction {
    readonly trueTarget: number | undefined;
    readonly falseTarget: number | undefined;
}

export interface CallSubModuleInstruction extends BaseInstruction {
    readonly name: string;
}

export interface CallLibraryMethodInstruction extends BaseInstruction {
    readonly library: string;
    readonly method: string;
}

export interface StoreVariableInstruction extends BaseInstruction {
    readonly name: string;
}

export interface StoreArrayElementInstruction extends BaseInstruction {
    readonly name: string;
    readonly indices: number;
    readonly sourceRange: TextRange;
}

export interface StorePropertyInstruction extends BaseInstruction {
    readonly library: string;
    readonly property: string;
}

export interface LoadVariableInstruction extends BaseInstruction {
    readonly name: string;
}

export interface LoadArrayElementInstruction extends BaseInstruction {
    readonly name: string;
    readonly indices: number;
    readonly sourceRange: TextRange;
}

export interface LoadPropertyInstruction extends BaseInstruction {
    readonly library: string;
    readonly property: string;
}

export interface MethodCallInstruction extends BaseInstruction {
    readonly library: string;
    readonly method: string;
    readonly argumentsCount: number;
}

export interface NegateInstruction extends BaseInstruction {
    readonly sourceRange: TextRange;
}

export interface EqualInstruction extends BaseInstruction {
}

export interface LessThanInstruction extends BaseInstruction {
}

export interface GreaterThanInstruction extends BaseInstruction {
}

export interface LessThanOrEqualInstruction extends BaseInstruction {
}

export interface GreaterThanOrEqualInstruction extends BaseInstruction {
}

export interface AddInstruction extends BaseInstruction {
    readonly sourceRange: TextRange;
}

export interface SubtractInstruction extends BaseInstruction {
    readonly sourceRange: TextRange;
}

export interface MultiplyInstruction extends BaseInstruction {
    readonly sourceRange: TextRange;
}

export interface DivideInstruction extends BaseInstruction {
    readonly sourceRange: TextRange;
}

export interface PushNumberInstruction extends BaseInstruction {
    readonly value: number;
}

export interface PushStringInstruction extends BaseInstruction {
    readonly value: string;
}

export interface ReturnInstruction extends BaseInstruction {
}

export class InstructionFactory {
    private constructor() {
    }

    public static StatementStart(
        line: number)
        : StatementStartInstruction {
        return {
            kind: InstructionKind.StatementStart,
            line: line
        };
    }

    public static TempLabel(
        name: string)
        : TempLabelInstruction {
        return {
            kind: InstructionKind.TempLabel,
            name: name
        };
    }

    public static TempJump(
        target: string)
        : TempJumpInstruction {
        return {
            kind: InstructionKind.TempJump,
            target: target
        };
    }

    public static TempConditionalJump(
        trueTarget: string | undefined,
        falseTarget: string | undefined)
        : TempConditionalJumpInstruction {
        return {
            kind: InstructionKind.TempConditionalJump,
            trueTarget: trueTarget,
            falseTarget: falseTarget
        };
    }

    public static Jump(
        target: number)
        : JumpInstruction {
        return {
            kind: InstructionKind.Jump,
            target: target
        };
    }

    public static ConditionalJump(
        trueTarget: number | undefined,
        falseTarget: number | undefined)
        : ConditionalJumpInstruction {
        return {
            kind: InstructionKind.ConditionalJump,
            trueTarget: trueTarget,
            falseTarget: falseTarget
        };
    }

    public static CallSubModule(
        name: string)
        : CallSubModuleInstruction {
        return {
            kind: InstructionKind.CallSubModule,
            name: name
        };
    }

    public static CallLibraryMethod(
        library: string,
        method: string)
        : CallLibraryMethodInstruction {
        return {
            kind: InstructionKind.CallLibraryMethod,
            library: library,
            method: method
        };
    }

    public static StoreVariable(
        name: string)
        : StoreVariableInstruction {
        return {
            kind: InstructionKind.StoreVariable,
            name: name
        };
    }

    public static StoreArrayElement(
        name: string,
        indices: number,
        sourceRange: TextRange)
        : StoreArrayElementInstruction {
        return {
            kind: InstructionKind.StoreArrayElement,
            name: name,
            indices: indices,
            sourceRange: sourceRange
        };
    }

    public static StoreProperty(
        library: string,
        property: string)
        : StorePropertyInstruction {
        return {
            kind: InstructionKind.StoreProperty,
            library: library,
            property: property
        };
    }

    public static LoadVariable(
        name: string)
        : LoadVariableInstruction {
        return {
            kind: InstructionKind.LoadVariable,
            name: name
        };
    }

    public static LoadArrayElement(
        name: string,
        indices: number,
        sourceRange: TextRange)
        : LoadArrayElementInstruction {
        return {
            kind: InstructionKind.LoadArrayElement,
            name: name,
            indices: indices,
            sourceRange: sourceRange
        };
    }

    public static LoadProperty(
        library: string,
        property: string)
        : LoadPropertyInstruction {
        return {
            kind: InstructionKind.LoadProperty,
            library: library,
            property: property
        };
    }

    public static MethodCall(
        library: string,
        method: string,
        argumentsCount: number)
        : MethodCallInstruction {
        return {
            kind: InstructionKind.MethodCall,
            library: library,
            method: method,
            argumentsCount: argumentsCount
        };
    }

    public static Negate(
        sourceRange: TextRange)
        : NegateInstruction {
        return {
            kind: InstructionKind.Negate,
            sourceRange: sourceRange
        };
    }

    public static Equal()
        : EqualInstruction {
        return {
            kind: InstructionKind.Equal
        };
    }

    public static LessThan()
        : LessThanInstruction {
        return {
            kind: InstructionKind.LessThan
        };
    }

    public static GreaterThan()
        : GreaterThanInstruction {
        return {
            kind: InstructionKind.GreaterThan
        };
    }

    public static LessThanOrEqual()
        : LessThanOrEqualInstruction {
        return {
            kind: InstructionKind.LessThanOrEqual
        };
    }

    public static GreaterThanOrEqual()
        : GreaterThanOrEqualInstruction {
        return {
            kind: InstructionKind.GreaterThanOrEqual
        };
    }

    public static Add(
        sourceRange: TextRange)
        : AddInstruction {
        return {
            kind: InstructionKind.Add,
            sourceRange: sourceRange
        };
    }

    public static Subtract(
        sourceRange: TextRange)
        : SubtractInstruction {
        return {
            kind: InstructionKind.Subtract,
            sourceRange: sourceRange
        };
    }

    public static Multiply(
        sourceRange: TextRange)
        : MultiplyInstruction {
        return {
            kind: InstructionKind.Multiply,
            sourceRange: sourceRange
        };
    }

    public static Divide(
        sourceRange: TextRange)
        : DivideInstruction {
        return {
            kind: InstructionKind.Divide,
            sourceRange: sourceRange
        };
    }

    public static PushNumber(
        value: number)
        : PushNumberInstruction {
        return {
            kind: InstructionKind.PushNumber,
            value: value
        };
    }

    public static PushString(
        value: string)
        : PushStringInstruction {
        return {
            kind: InstructionKind.PushString,
            value: value
        };
    }

    public static Return()
        : ReturnInstruction {
        return {
            kind: InstructionKind.Return
        };
    }
}
