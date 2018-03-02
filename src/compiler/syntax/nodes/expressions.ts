import { BaseSyntaxNode, TextRange } from "./syntax-nodes";
import { Token } from "./tokens";

export enum ExpressionSyntaxKind {
    UnaryOperator,
    BinaryOperator,
    ObjectAccess,
    ArrayAccess,
    Call,
    Identifier,
    NumberLiteral,
    StringLiteral,
    Parenthesis
}

export abstract class BaseExpressionSyntax extends BaseSyntaxNode {
    public abstract get range(): TextRange;
    public abstract get kind(): ExpressionSyntaxKind;
}

export class UnaryOperatorExpressionSyntax extends BaseExpressionSyntax {
    public constructor(
        public readonly operatorToken: Token,
        public readonly expression: BaseExpressionSyntax) {
        super();
    }

    public get kind(): ExpressionSyntaxKind {
        return ExpressionSyntaxKind.UnaryOperator;
    }

    public get range(): TextRange {
        return this.combineRanges(this.operatorToken.range, this.expression.range);
    }
}

export class BinaryOperatorExpressionSyntax extends BaseExpressionSyntax {
    public constructor(
        public readonly leftExpression: BaseExpressionSyntax,
        public readonly operatorToken: Token,
        public readonly rightExpression: BaseExpressionSyntax) {
        super();
    }

    public get kind(): ExpressionSyntaxKind {
        return ExpressionSyntaxKind.BinaryOperator;
    }

    public get range(): TextRange {
        return this.combineRanges(this.leftExpression.range, this.rightExpression.range);
    }
}

export class ObjectAccessExpressionSyntax extends BaseExpressionSyntax {
    public constructor(
        public readonly baseExpression: BaseExpressionSyntax,
        public readonly dotToken: Token,
        public readonly identifierToken: Token) {
        super();
    }

    public get kind(): ExpressionSyntaxKind {
        return ExpressionSyntaxKind.ObjectAccess;
    }

    public get range(): TextRange {
        return this.combineRanges(this.baseExpression.range, this.identifierToken.range);
    }
}

export class ArrayAccessExpressionSyntax extends BaseExpressionSyntax {
    public constructor(
        public readonly baseExpression: BaseExpressionSyntax,
        public readonly leftBracketToken: Token,
        public readonly indexExpression: BaseExpressionSyntax,
        public readonly rightBracketToken: Token) {
        super();
    }

    public get kind(): ExpressionSyntaxKind {
        return ExpressionSyntaxKind.ArrayAccess;
    }

    public get range(): TextRange {
        return this.combineRanges(this.baseExpression.range, this.rightBracketToken.range);
    }
}

export class CallExpressionSyntax extends BaseExpressionSyntax {
    public constructor(
        public readonly baseExpression: BaseExpressionSyntax,
        public readonly leftParenToken: Token,
        public readonly argumentsList: BaseExpressionSyntax[],
        public readonly commasList: Token[],
        public readonly rightParenToken: Token) {
        super();
    }

    public get kind(): ExpressionSyntaxKind {
        return ExpressionSyntaxKind.Call;
    }

    public get range(): TextRange {
        return this.combineRanges(this.baseExpression.range, this.rightParenToken.range);
    }
}

export class IdentifierExpressionSyntax extends BaseExpressionSyntax {
    public constructor(
        public readonly token: Token) {
        super();
    }

    public get kind(): ExpressionSyntaxKind {
        return ExpressionSyntaxKind.Identifier;
    }

    public get range(): TextRange {
        return this.token.range;
    }
}

export class NumberLiteralExpressionSyntax extends BaseExpressionSyntax {
    public constructor(
        public readonly token: Token) {
        super();
    }

    public get kind(): ExpressionSyntaxKind {
        return ExpressionSyntaxKind.NumberLiteral;
    }

    public get range(): TextRange {
        return this.token.range;
    }
}

export class StringLiteralExpressionSyntax extends BaseExpressionSyntax {
    public constructor(
        public readonly token: Token) {
        super();
    }

    public get kind(): ExpressionSyntaxKind {
        return ExpressionSyntaxKind.StringLiteral;
    }

    public get range(): TextRange {
        return this.token.range;
    }
}

export class ParenthesisExpressionSyntax extends BaseExpressionSyntax {
    public constructor(
        public readonly leftParenToken: Token,
        public readonly expression: BaseExpressionSyntax,
        public readonly rightParenToken: Token) {
        super();
    }

    public get kind(): ExpressionSyntaxKind {
        return ExpressionSyntaxKind.Parenthesis;
    }

    public get range(): TextRange {
        return this.combineRanges(this.leftParenToken.range, this.rightParenToken.range);
    }
}
