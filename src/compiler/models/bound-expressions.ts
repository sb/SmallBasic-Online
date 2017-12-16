// This file is generated through a build task. Do not edit by hand.

import { BaseExpressionSyntax } from "./syntax-expressions";
import { ExpressionInfo } from "../binding/expression-binder";

export enum BoundExpressionKind {
    Negation,
    Or,
    And,
    NotEqual,
    Equal,
    LessThan,
    GreaterThan,
    LessThanOrEqual,
    GreaterThanOrEqual,
    Addition,
    Subtraction,
    Multiplication,
    Division,
    ArrayAccess,
    LibraryType,
    LibraryProperty,
    LibraryMethod,
    LibraryMethodCall,
    SubModule,
    SubModuleCall,
    Variable,
    StringLiteral,
    NumberLiteral,
    Parenthesis
}

export interface BaseBoundExpression {
    readonly kind: BoundExpressionKind;
    readonly syntax: BaseExpressionSyntax;
    readonly info: ExpressionInfo;
}

export interface NegationBoundExpression extends BaseBoundExpression {
    readonly expression: BaseBoundExpression;
}

export interface OrBoundExpression extends BaseBoundExpression {
    readonly leftExpression: BaseBoundExpression;
    readonly rightExpression: BaseBoundExpression;
}

export interface AndBoundExpression extends BaseBoundExpression {
    readonly leftExpression: BaseBoundExpression;
    readonly rightExpression: BaseBoundExpression;
}

export interface NotEqualBoundExpression extends BaseBoundExpression {
    readonly leftExpression: BaseBoundExpression;
    readonly rightExpression: BaseBoundExpression;
}

export interface EqualBoundExpression extends BaseBoundExpression {
    readonly leftExpression: BaseBoundExpression;
    readonly rightExpression: BaseBoundExpression;
}

export interface LessThanBoundExpression extends BaseBoundExpression {
    readonly leftExpression: BaseBoundExpression;
    readonly rightExpression: BaseBoundExpression;
}

export interface GreaterThanBoundExpression extends BaseBoundExpression {
    readonly leftExpression: BaseBoundExpression;
    readonly rightExpression: BaseBoundExpression;
}

export interface LessThanOrEqualBoundExpression extends BaseBoundExpression {
    readonly leftExpression: BaseBoundExpression;
    readonly rightExpression: BaseBoundExpression;
}

export interface GreaterThanOrEqualBoundExpression extends BaseBoundExpression {
    readonly leftExpression: BaseBoundExpression;
    readonly rightExpression: BaseBoundExpression;
}

export interface AdditionBoundExpression extends BaseBoundExpression {
    readonly leftExpression: BaseBoundExpression;
    readonly rightExpression: BaseBoundExpression;
}

export interface SubtractionBoundExpression extends BaseBoundExpression {
    readonly leftExpression: BaseBoundExpression;
    readonly rightExpression: BaseBoundExpression;
}

export interface MultiplicationBoundExpression extends BaseBoundExpression {
    readonly leftExpression: BaseBoundExpression;
    readonly rightExpression: BaseBoundExpression;
}

export interface DivisionBoundExpression extends BaseBoundExpression {
    readonly leftExpression: BaseBoundExpression;
    readonly rightExpression: BaseBoundExpression;
}

export interface ArrayAccessBoundExpression extends BaseBoundExpression {
    readonly name: string;
    readonly indices: BaseBoundExpression[];
}

export interface LibraryTypeBoundExpression extends BaseBoundExpression {
    readonly library: string;
}

export interface LibraryPropertyBoundExpression extends BaseBoundExpression {
    readonly library: string;
    readonly name: string;
}

export interface LibraryMethodBoundExpression extends BaseBoundExpression {
    readonly library: string;
    readonly name: string;
}

export interface LibraryMethodCallBoundExpression extends BaseBoundExpression {
    readonly library: string;
    readonly name: string;
    readonly argumentsList: BaseBoundExpression[];
}

export interface SubModuleBoundExpression extends BaseBoundExpression {
    readonly name: string;
}

export interface SubModuleCallBoundExpression extends BaseBoundExpression {
    readonly name: string;
}

export interface VariableBoundExpression extends BaseBoundExpression {
    readonly name: string;
}

export interface StringLiteralBoundExpression extends BaseBoundExpression {
    readonly value: string;
}

export interface NumberLiteralBoundExpression extends BaseBoundExpression {
    readonly value: number;
}

export interface ParenthesisBoundExpression extends BaseBoundExpression {
    readonly expression: BaseBoundExpression;
}

export class BoundExpressionFactory {
    private constructor() {
    }

    public static Negation(
        syntax: BaseExpressionSyntax,
        info: ExpressionInfo,
        expression: BaseBoundExpression)
        : NegationBoundExpression {
        return {
            kind: BoundExpressionKind.Negation,
            syntax: syntax,
            info: info,
            expression: expression
        };
    }

    public static Or(
        syntax: BaseExpressionSyntax,
        info: ExpressionInfo,
        leftExpression: BaseBoundExpression,
        rightExpression: BaseBoundExpression)
        : OrBoundExpression {
        return {
            kind: BoundExpressionKind.Or,
            syntax: syntax,
            info: info,
            leftExpression: leftExpression,
            rightExpression: rightExpression
        };
    }

    public static And(
        syntax: BaseExpressionSyntax,
        info: ExpressionInfo,
        leftExpression: BaseBoundExpression,
        rightExpression: BaseBoundExpression)
        : AndBoundExpression {
        return {
            kind: BoundExpressionKind.And,
            syntax: syntax,
            info: info,
            leftExpression: leftExpression,
            rightExpression: rightExpression
        };
    }

    public static NotEqual(
        syntax: BaseExpressionSyntax,
        info: ExpressionInfo,
        leftExpression: BaseBoundExpression,
        rightExpression: BaseBoundExpression)
        : NotEqualBoundExpression {
        return {
            kind: BoundExpressionKind.NotEqual,
            syntax: syntax,
            info: info,
            leftExpression: leftExpression,
            rightExpression: rightExpression
        };
    }

    public static Equal(
        syntax: BaseExpressionSyntax,
        info: ExpressionInfo,
        leftExpression: BaseBoundExpression,
        rightExpression: BaseBoundExpression)
        : EqualBoundExpression {
        return {
            kind: BoundExpressionKind.Equal,
            syntax: syntax,
            info: info,
            leftExpression: leftExpression,
            rightExpression: rightExpression
        };
    }

    public static LessThan(
        syntax: BaseExpressionSyntax,
        info: ExpressionInfo,
        leftExpression: BaseBoundExpression,
        rightExpression: BaseBoundExpression)
        : LessThanBoundExpression {
        return {
            kind: BoundExpressionKind.LessThan,
            syntax: syntax,
            info: info,
            leftExpression: leftExpression,
            rightExpression: rightExpression
        };
    }

    public static GreaterThan(
        syntax: BaseExpressionSyntax,
        info: ExpressionInfo,
        leftExpression: BaseBoundExpression,
        rightExpression: BaseBoundExpression)
        : GreaterThanBoundExpression {
        return {
            kind: BoundExpressionKind.GreaterThan,
            syntax: syntax,
            info: info,
            leftExpression: leftExpression,
            rightExpression: rightExpression
        };
    }

    public static LessThanOrEqual(
        syntax: BaseExpressionSyntax,
        info: ExpressionInfo,
        leftExpression: BaseBoundExpression,
        rightExpression: BaseBoundExpression)
        : LessThanOrEqualBoundExpression {
        return {
            kind: BoundExpressionKind.LessThanOrEqual,
            syntax: syntax,
            info: info,
            leftExpression: leftExpression,
            rightExpression: rightExpression
        };
    }

    public static GreaterThanOrEqual(
        syntax: BaseExpressionSyntax,
        info: ExpressionInfo,
        leftExpression: BaseBoundExpression,
        rightExpression: BaseBoundExpression)
        : GreaterThanOrEqualBoundExpression {
        return {
            kind: BoundExpressionKind.GreaterThanOrEqual,
            syntax: syntax,
            info: info,
            leftExpression: leftExpression,
            rightExpression: rightExpression
        };
    }

    public static Addition(
        syntax: BaseExpressionSyntax,
        info: ExpressionInfo,
        leftExpression: BaseBoundExpression,
        rightExpression: BaseBoundExpression)
        : AdditionBoundExpression {
        return {
            kind: BoundExpressionKind.Addition,
            syntax: syntax,
            info: info,
            leftExpression: leftExpression,
            rightExpression: rightExpression
        };
    }

    public static Subtraction(
        syntax: BaseExpressionSyntax,
        info: ExpressionInfo,
        leftExpression: BaseBoundExpression,
        rightExpression: BaseBoundExpression)
        : SubtractionBoundExpression {
        return {
            kind: BoundExpressionKind.Subtraction,
            syntax: syntax,
            info: info,
            leftExpression: leftExpression,
            rightExpression: rightExpression
        };
    }

    public static Multiplication(
        syntax: BaseExpressionSyntax,
        info: ExpressionInfo,
        leftExpression: BaseBoundExpression,
        rightExpression: BaseBoundExpression)
        : MultiplicationBoundExpression {
        return {
            kind: BoundExpressionKind.Multiplication,
            syntax: syntax,
            info: info,
            leftExpression: leftExpression,
            rightExpression: rightExpression
        };
    }

    public static Division(
        syntax: BaseExpressionSyntax,
        info: ExpressionInfo,
        leftExpression: BaseBoundExpression,
        rightExpression: BaseBoundExpression)
        : DivisionBoundExpression {
        return {
            kind: BoundExpressionKind.Division,
            syntax: syntax,
            info: info,
            leftExpression: leftExpression,
            rightExpression: rightExpression
        };
    }

    public static ArrayAccess(
        syntax: BaseExpressionSyntax,
        info: ExpressionInfo,
        name: string,
        indices: BaseBoundExpression[])
        : ArrayAccessBoundExpression {
        return {
            kind: BoundExpressionKind.ArrayAccess,
            syntax: syntax,
            info: info,
            name: name,
            indices: indices
        };
    }

    public static LibraryType(
        syntax: BaseExpressionSyntax,
        info: ExpressionInfo,
        library: string)
        : LibraryTypeBoundExpression {
        return {
            kind: BoundExpressionKind.LibraryType,
            syntax: syntax,
            info: info,
            library: library
        };
    }

    public static LibraryProperty(
        syntax: BaseExpressionSyntax,
        info: ExpressionInfo,
        library: string,
        name: string)
        : LibraryPropertyBoundExpression {
        return {
            kind: BoundExpressionKind.LibraryProperty,
            syntax: syntax,
            info: info,
            library: library,
            name: name
        };
    }

    public static LibraryMethod(
        syntax: BaseExpressionSyntax,
        info: ExpressionInfo,
        library: string,
        name: string)
        : LibraryMethodBoundExpression {
        return {
            kind: BoundExpressionKind.LibraryMethod,
            syntax: syntax,
            info: info,
            library: library,
            name: name
        };
    }

    public static LibraryMethodCall(
        syntax: BaseExpressionSyntax,
        info: ExpressionInfo,
        library: string,
        name: string,
        argumentsList: BaseBoundExpression[])
        : LibraryMethodCallBoundExpression {
        return {
            kind: BoundExpressionKind.LibraryMethodCall,
            syntax: syntax,
            info: info,
            library: library,
            name: name,
            argumentsList: argumentsList
        };
    }

    public static SubModule(
        syntax: BaseExpressionSyntax,
        info: ExpressionInfo,
        name: string)
        : SubModuleBoundExpression {
        return {
            kind: BoundExpressionKind.SubModule,
            syntax: syntax,
            info: info,
            name: name
        };
    }

    public static SubModuleCall(
        syntax: BaseExpressionSyntax,
        info: ExpressionInfo,
        name: string)
        : SubModuleCallBoundExpression {
        return {
            kind: BoundExpressionKind.SubModuleCall,
            syntax: syntax,
            info: info,
            name: name
        };
    }

    public static Variable(
        syntax: BaseExpressionSyntax,
        info: ExpressionInfo,
        name: string)
        : VariableBoundExpression {
        return {
            kind: BoundExpressionKind.Variable,
            syntax: syntax,
            info: info,
            name: name
        };
    }

    public static StringLiteral(
        syntax: BaseExpressionSyntax,
        info: ExpressionInfo,
        value: string)
        : StringLiteralBoundExpression {
        return {
            kind: BoundExpressionKind.StringLiteral,
            syntax: syntax,
            info: info,
            value: value
        };
    }

    public static NumberLiteral(
        syntax: BaseExpressionSyntax,
        info: ExpressionInfo,
        value: number)
        : NumberLiteralBoundExpression {
        return {
            kind: BoundExpressionKind.NumberLiteral,
            syntax: syntax,
            info: info,
            value: value
        };
    }

    public static Parenthesis(
        syntax: BaseExpressionSyntax,
        info: ExpressionInfo,
        expression: BaseBoundExpression)
        : ParenthesisBoundExpression {
        return {
            kind: BoundExpressionKind.Parenthesis,
            syntax: syntax,
            info: info,
            expression: expression
        };
    }
}
