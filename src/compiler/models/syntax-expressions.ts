// This file is generated through a build task. Do not edit by hand.

import { Token } from "../syntax/tokens";
import { TextRange } from "../syntax/text-markers";

export enum ExpressionSyntaxKind {
    UnaryOperator,
    BinaryOperator,
    ObjectAccess,
    ArrayAccess,
    Call,
    Identifier,
    NumberLiteral,
    StringLiteral,
    Parenthesis,
    Missing
}

export interface BaseExpressionSyntax {
    readonly kind: ExpressionSyntaxKind;
}

export interface UnaryOperatorExpressionSyntax extends BaseExpressionSyntax {
    readonly operatorToken: Token;
    readonly expression: BaseExpressionSyntax;
}

export interface BinaryOperatorExpressionSyntax extends BaseExpressionSyntax {
    readonly leftExpression: BaseExpressionSyntax;
    readonly operatorToken: Token;
    readonly rightExpression: BaseExpressionSyntax;
}

export interface ObjectAccessExpressionSyntax extends BaseExpressionSyntax {
    readonly baseExpression: BaseExpressionSyntax;
    readonly dotToken: Token;
    readonly identifierToken: Token;
}

export interface ArrayAccessExpressionSyntax extends BaseExpressionSyntax {
    readonly baseExpression: BaseExpressionSyntax;
    readonly leftBracketToken: Token;
    readonly indexExpression: BaseExpressionSyntax;
    readonly rightBracketToken: Token;
}

export interface CallExpressionSyntax extends BaseExpressionSyntax {
    readonly baseExpression: BaseExpressionSyntax;
    readonly leftParenToken: Token;
    readonly argumentsList: BaseExpressionSyntax[];
    readonly commasList: Token[];
    readonly rightParenToken: Token;
}

export interface IdentifierExpressionSyntax extends BaseExpressionSyntax {
    readonly name: string;
    readonly token: Token;
}

export interface NumberLiteralExpressionSyntax extends BaseExpressionSyntax {
    readonly value: number;
    readonly token: Token;
}

export interface StringLiteralExpressionSyntax extends BaseExpressionSyntax {
    readonly value: string;
    readonly token: Token;
}

export interface ParenthesisExpressionSyntax extends BaseExpressionSyntax {
    readonly leftParenToken: Token;
    readonly expression: BaseExpressionSyntax;
    readonly rightParenToken: Token;
}

export interface MissingExpressionSyntax extends BaseExpressionSyntax {
    readonly range: TextRange;
}

export class ExpressionSyntaxFactory {
    private constructor() {
    }

    public static UnaryOperator(
        operatorToken: Token,
        expression: BaseExpressionSyntax)
        : UnaryOperatorExpressionSyntax {
        return {
            kind: ExpressionSyntaxKind.UnaryOperator,
            operatorToken: operatorToken,
            expression: expression
        };
    }

    public static BinaryOperator(
        leftExpression: BaseExpressionSyntax,
        operatorToken: Token,
        rightExpression: BaseExpressionSyntax)
        : BinaryOperatorExpressionSyntax {
        return {
            kind: ExpressionSyntaxKind.BinaryOperator,
            leftExpression: leftExpression,
            operatorToken: operatorToken,
            rightExpression: rightExpression
        };
    }

    public static ObjectAccess(
        baseExpression: BaseExpressionSyntax,
        dotToken: Token,
        identifierToken: Token)
        : ObjectAccessExpressionSyntax {
        return {
            kind: ExpressionSyntaxKind.ObjectAccess,
            baseExpression: baseExpression,
            dotToken: dotToken,
            identifierToken: identifierToken
        };
    }

    public static ArrayAccess(
        baseExpression: BaseExpressionSyntax,
        leftBracketToken: Token,
        indexExpression: BaseExpressionSyntax,
        rightBracketToken: Token)
        : ArrayAccessExpressionSyntax {
        return {
            kind: ExpressionSyntaxKind.ArrayAccess,
            baseExpression: baseExpression,
            leftBracketToken: leftBracketToken,
            indexExpression: indexExpression,
            rightBracketToken: rightBracketToken
        };
    }

    public static Call(
        baseExpression: BaseExpressionSyntax,
        leftParenToken: Token,
        argumentsList: BaseExpressionSyntax[],
        commasList: Token[],
        rightParenToken: Token)
        : CallExpressionSyntax {
        return {
            kind: ExpressionSyntaxKind.Call,
            baseExpression: baseExpression,
            leftParenToken: leftParenToken,
            argumentsList: argumentsList,
            commasList: commasList,
            rightParenToken: rightParenToken
        };
    }

    public static Identifier(
        name: string,
        token: Token)
        : IdentifierExpressionSyntax {
        return {
            kind: ExpressionSyntaxKind.Identifier,
            name: name,
            token: token
        };
    }

    public static NumberLiteral(
        value: number,
        token: Token)
        : NumberLiteralExpressionSyntax {
        return {
            kind: ExpressionSyntaxKind.NumberLiteral,
            value: value,
            token: token
        };
    }

    public static StringLiteral(
        value: string,
        token: Token)
        : StringLiteralExpressionSyntax {
        return {
            kind: ExpressionSyntaxKind.StringLiteral,
            value: value,
            token: token
        };
    }

    public static Parenthesis(
        leftParenToken: Token,
        expression: BaseExpressionSyntax,
        rightParenToken: Token)
        : ParenthesisExpressionSyntax {
        return {
            kind: ExpressionSyntaxKind.Parenthesis,
            leftParenToken: leftParenToken,
            expression: expression,
            rightParenToken: rightParenToken
        };
    }

    public static Missing(
        range: TextRange)
        : MissingExpressionSyntax {
        return {
            kind: ExpressionSyntaxKind.Missing,
            range: range
        };
    }
}
