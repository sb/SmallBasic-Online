// This file is generated through a build task. Do not edit by hand.

export enum InstructionKind {
    TempLabel,
    TempJump,
    TempJumpIfFalse,
    Jump,
    JumpIfFalse,
    CallSubModule,
    CallLibraryMethod,
    Pause,
    Halt,
    StoreVariable,
    StoreArray,
    StoreProperty,
    LoadVariable,
    LoadArray,
    LoadProperty,
    LoadMethodCall,
    Negate,
    Equal,
    LessThan,
    Add,
    Subtract,
    Multiply,
    Divide,
    PushNumber,
    PushString
}

export interface BaseInstruction {
    readonly kind: InstructionKind;
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

export interface PauseInstruction extends BaseInstruction {
    readonly line: number;
    readonly userDefined: boolean;
}

export interface HaltInstruction extends BaseInstruction {
}

export interface StoreVariableInstruction extends BaseInstruction {
    readonly name: string;
}

export interface StoreArrayInstruction extends BaseInstruction {
    readonly name: string;
    readonly indices: number;
}

export interface StorePropertyInstruction extends BaseInstruction {
    readonly type: string;
    readonly name: string;
}

export interface LoadVariableInstruction extends BaseInstruction {
    readonly name: string;
}

export interface LoadArrayInstruction extends BaseInstruction {
    readonly name: string;
    readonly indices: number;
}

export interface LoadPropertyInstruction extends BaseInstruction {
    readonly type: string;
    readonly name: string;
}

export interface LoadMethodCallInstruction extends BaseInstruction {
    readonly type: string;
    readonly name: string;
    readonly argumentsCount: number;
}

export interface NegateInstruction extends BaseInstruction {
}

export interface EqualInstruction extends BaseInstruction {
}

export interface LessThanInstruction extends BaseInstruction {
}

export interface AddInstruction extends BaseInstruction {
}

export interface SubtractInstruction extends BaseInstruction {
}

export interface MultiplyInstruction extends BaseInstruction {
}

export interface DivideInstruction extends BaseInstruction {
}

export interface PushNumberInstruction extends BaseInstruction {
    readonly value: number;
}

export interface PushStringInstruction extends BaseInstruction {
    readonly value: string;
}

export class InstructionFactory {
    private constructor() {
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

    public static Pause(
        line: number,
        userDefined: boolean)
        : PauseInstruction {
        return {
            kind: InstructionKind.Pause,
            line: line,
            userDefined: userDefined
        };
    }

    public static Halt()
        : HaltInstruction {
        return {
            kind: InstructionKind.Halt
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
        indices: number)
        : StoreArrayInstruction {
        return {
            kind: InstructionKind.StoreArray,
            name: name,
            indices: indices
        };
    }

    public static StoreProperty(
        type: string,
        name: string)
        : StorePropertyInstruction {
        return {
            kind: InstructionKind.StoreProperty,
            type: type,
            name: name
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
        indices: number)
        : LoadArrayInstruction {
        return {
            kind: InstructionKind.LoadArray,
            name: name,
            indices: indices
        };
    }

    public static LoadProperty(
        type: string,
        name: string)
        : LoadPropertyInstruction {
        return {
            kind: InstructionKind.LoadProperty,
            type: type,
            name: name
        };
    }

    public static LoadMethodCall(
        type: string,
        name: string,
        argumentsCount: number)
        : LoadMethodCallInstruction {
        return {
            kind: InstructionKind.LoadMethodCall,
            type: type,
            name: name,
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

    public static Add()
        : AddInstruction {
        return {
            kind: InstructionKind.Add
        };
    }

    public static Subtract()
        : SubtractInstruction {
        return {
            kind: InstructionKind.Subtract
        };
    }

    public static Multiply()
        : MultiplyInstruction {
        return {
            kind: InstructionKind.Multiply
        };
    }

    public static Divide()
        : DivideInstruction {
        return {
            kind: InstructionKind.Divide
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
}
