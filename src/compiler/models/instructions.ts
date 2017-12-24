// This file is generated through a build task. Do not edit by hand.

import { TextRange } from "../syntax/text-markers";

export enum InstructionKind {
    StatementStart,
    TempLabel,
    TempJump,
    TempJumpIfFalse,
    Jump,
    JumpIfFalse,
    CallSubModule,
    CallLibraryMethod,
    StoreVariable,
    StoreArray,
    StoreProperty,
    LoadVariable,
    LoadArray,
    LoadProperty,
    MethodCall,
    Negate,
    Equal,
    LessThan,
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

export interface TempJumpIfFalseInstruction extends BaseInstruction {
    readonly target: string;
}

export interface JumpInstruction extends BaseInstruction {
    readonly target: number;
}

export interface JumpIfFalseInstruction extends BaseInstruction {
    readonly target: number;
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

export interface StoreArrayInstruction extends BaseInstruction {
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

export interface LoadArrayInstruction extends BaseInstruction {
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
}

export interface EqualInstruction extends BaseInstruction {
}

export interface LessThanInstruction extends BaseInstruction {
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

    public static TempJumpIfFalse(
        target: string)
        : TempJumpIfFalseInstruction {
        return {
            kind: InstructionKind.TempJumpIfFalse,
            target: target
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

    public static JumpIfFalse(
        target: number)
        : JumpIfFalseInstruction {
        return {
            kind: InstructionKind.JumpIfFalse,
            target: target
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

    public static StoreArray(
        name: string,
        indices: number,
        sourceRange: TextRange)
        : StoreArrayInstruction {
        return {
            kind: InstructionKind.StoreArray,
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

    public static LoadArray(
        name: string,
        indices: number,
        sourceRange: TextRange)
        : LoadArrayInstruction {
        return {
            kind: InstructionKind.LoadArray,
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

    public static Negate()
        : NegateInstruction {
        return {
            kind: InstructionKind.Negate
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
