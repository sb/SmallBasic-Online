import { BaseSyntaxNode, TextRange } from "./syntax-nodes";
import { Token, TokenKind } from "./tokens";
import { BaseExpressionSyntax } from "./expressions";
import { SyntaxNodesResources } from "../../strings/syntax-nodes";

export enum CommandSyntaxKind {
    If,
    Else,
    ElseIf,
    EndIf,
    For,
    EndFor,
    While,
    EndWhile,
    Label,
    GoTo,
    Sub,
    EndSub,
    Expression
}

export abstract class BaseCommandSyntax extends BaseSyntaxNode {
    public abstract get range(): TextRange;
    public abstract get kind(): CommandSyntaxKind;

    public static toDisplayString(kind: CommandSyntaxKind): string {
        switch (kind) {
            case CommandSyntaxKind.If: return Token.toDisplayString(TokenKind.IfKeyword);
            case CommandSyntaxKind.Else: return Token.toDisplayString(TokenKind.ElseKeyword);
            case CommandSyntaxKind.ElseIf: return Token.toDisplayString(TokenKind.ElseIfKeyword);
            case CommandSyntaxKind.EndIf: return Token.toDisplayString(TokenKind.EndIfKeyword);
            case CommandSyntaxKind.For: return Token.toDisplayString(TokenKind.ForKeyword);
            case CommandSyntaxKind.EndFor: return Token.toDisplayString(TokenKind.EndForKeyword);
            case CommandSyntaxKind.While: return Token.toDisplayString(TokenKind.WhileKeyword);
            case CommandSyntaxKind.EndWhile: return Token.toDisplayString(TokenKind.EndWhileKeyword);
            case CommandSyntaxKind.Label: return SyntaxNodesResources.Label;
            case CommandSyntaxKind.GoTo: return Token.toDisplayString(TokenKind.GoToKeyword);
            case CommandSyntaxKind.Sub: return Token.toDisplayString(TokenKind.SubKeyword);
            case CommandSyntaxKind.EndSub: return Token.toDisplayString(TokenKind.EndSubKeyword);
            case CommandSyntaxKind.Expression: return SyntaxNodesResources.Expression;
            default: throw new Error(`Unexpected command kind: ${CommandSyntaxKind[kind]}`);
        }
    }
}

export class IfCommandSyntax extends BaseCommandSyntax {
    public constructor(
        readonly ifToken: Token,
        readonly expression: BaseExpressionSyntax,
        readonly thenToken: Token) {
        super();
    }

    public get kind(): CommandSyntaxKind {
        return CommandSyntaxKind.If;
    }

    public get range(): TextRange {
        return this.combineRanges(this.ifToken.range, this.thenToken.range);
    }
}

export class ElseCommandSyntax extends BaseCommandSyntax {
    public constructor(
        readonly elseToken: Token) {
        super();
    }

    public get kind(): CommandSyntaxKind {
        return CommandSyntaxKind.Else;
    }

    public get range(): TextRange {
        return this.elseToken.range;
    }
}

export class ElseIfCommandSyntax extends BaseCommandSyntax {
    public constructor(
        readonly elseIfToken: Token,
        readonly expression: BaseExpressionSyntax,
        readonly thenToken: Token) {
        super();
    }

    public get kind(): CommandSyntaxKind {
        return CommandSyntaxKind.ElseIf;
    }

    public get range(): TextRange {
        return this.combineRanges(this.elseIfToken.range, this.thenToken.range);
    }
}

export class EndIfCommandSyntax extends BaseCommandSyntax {
    public constructor(
        readonly endIfToken: Token) {
        super();
    }

    public get kind(): CommandSyntaxKind {
        return CommandSyntaxKind.EndIf;
    }

    public get range(): TextRange {
        return this.endIfToken.range;
    }
}

export interface ForStepClause {
    readonly stepToken: Token;
    readonly expression: BaseExpressionSyntax;
}

export class ForCommandSyntax extends BaseCommandSyntax {
    public constructor(
        readonly forToken: Token,
        readonly identifierToken: Token,
        readonly equalToken: Token,
        readonly fromExpression: BaseExpressionSyntax,
        readonly toToken: Token,
        readonly toExpression: BaseExpressionSyntax,
        readonly stepClause: ForStepClause | undefined) {
        super();
    }

    public get kind(): CommandSyntaxKind {
        return CommandSyntaxKind.For;
    }

    public get range(): TextRange {
        return this.combineRanges(
            this.forToken.range,
            this.stepClause ? this.stepClause.expression.range : this.toExpression.range);
    }
}

export class EndForCommandSyntax extends BaseCommandSyntax {
    public constructor(
        readonly endForToken: Token) {
        super();
    }

    public get kind(): CommandSyntaxKind {
        return CommandSyntaxKind.EndFor;
    }

    public get range(): TextRange {
        return this.endForToken.range;
    }
}

export class WhileCommandSyntax extends BaseCommandSyntax {
    public constructor(
        readonly whileToken: Token,
        readonly expression: BaseExpressionSyntax) {
        super();
    }

    public get kind(): CommandSyntaxKind {
        return CommandSyntaxKind.While;
    }

    public get range(): TextRange {
        return this.combineRanges(this.whileToken.range, this.expression.range);
    }
}

export class EndWhileCommandSyntax extends BaseCommandSyntax {
    public constructor(
        readonly endWhileToken: Token) {
        super();
    }

    public get kind(): CommandSyntaxKind {
        return CommandSyntaxKind.EndWhile;
    }

    public get range(): TextRange {
        return this.endWhileToken.range;
    }
}

export class LabelCommandSyntax extends BaseCommandSyntax {
    public constructor(
        readonly labelToken: Token,
        readonly colonToken: Token) {
        super();
    }

    public get kind(): CommandSyntaxKind {
        return CommandSyntaxKind.Label;
    }

    public get range(): TextRange {
        return this.combineRanges(this.labelToken.range, this.colonToken.range);
    }
}

export class GoToCommandSyntax extends BaseCommandSyntax {
    public constructor(
        readonly goToToken: Token,
        readonly labelToken: Token) {
        super();
    }

    public get kind(): CommandSyntaxKind {
        return CommandSyntaxKind.GoTo;
    }

    public get range(): TextRange {
        return this.combineRanges(this.goToToken.range, this.labelToken.range);
    }
}

export class SubCommandSyntax extends BaseCommandSyntax {
    public constructor(
        readonly subToken: Token,
        readonly nameToken: Token) {
        super();
    }

    public get kind(): CommandSyntaxKind {
        return CommandSyntaxKind.Sub;
    }

    public get range(): TextRange {
        return this.combineRanges(this.subToken.range, this.nameToken.range);
    }
}

export class EndSubCommandSyntax extends BaseCommandSyntax {
    public constructor(
        readonly endSubToken: Token) {
        super();
    }

    public get kind(): CommandSyntaxKind {
        return CommandSyntaxKind.EndSub;
    }

    public get range(): TextRange {
        return this.endSubToken.range;
    }
}

export class ExpressionCommandSyntax extends BaseCommandSyntax {
    public constructor(
        readonly expression: BaseExpressionSyntax) {
        super();
    }

    public get kind(): CommandSyntaxKind {
        return CommandSyntaxKind.Expression;
    }

    public get range(): TextRange {
        return this.expression.range;
    }
}

export class MissingCommandSyntax extends BaseCommandSyntax {
    public constructor(
        private readonly expectedRange: TextRange,
        private readonly expectedKind: CommandSyntaxKind) {
        super();
    }

    public get kind(): CommandSyntaxKind {
        return this.expectedKind;
    }

    public get range(): TextRange {
        return this.expectedRange;
    }
}
