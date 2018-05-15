import { BaseSyntaxNode, TextRange } from "./syntax-nodes";
import { Token, TokenKind } from "./tokens";
import { BaseExpressionSyntax } from "./expressions";
import { SyntaxNodesResources } from "../../../strings/syntax-nodes";
import { CompilerUtils } from "../../compiler-utils";

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
    public constructor(
        public readonly kind: CommandSyntaxKind,
        public readonly range: TextRange) {
        super();
    }

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
        super(CommandSyntaxKind.If, CompilerUtils.combineRanges(ifToken.range, thenToken.range));
    }
}

export class ElseCommandSyntax extends BaseCommandSyntax {
    public constructor(
        readonly elseToken: Token) {
        super(CommandSyntaxKind.Else, elseToken.range);
    }
}

export class ElseIfCommandSyntax extends BaseCommandSyntax {
    public constructor(
        readonly elseIfToken: Token,
        readonly expression: BaseExpressionSyntax,
        readonly thenToken: Token) {
        super(CommandSyntaxKind.ElseIf, CompilerUtils.combineRanges(elseIfToken.range, thenToken.range));
    }
}

export class EndIfCommandSyntax extends BaseCommandSyntax {
    public constructor(
        readonly endIfToken: Token) {
        super(CommandSyntaxKind.EndIf, endIfToken.range);
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
        super(CommandSyntaxKind.For, CompilerUtils.combineRanges(
            forToken.range,
            stepClause ? stepClause.expression.range : toExpression.range));
    }
}

export class EndForCommandSyntax extends BaseCommandSyntax {
    public constructor(
        readonly endForToken: Token) {
        super(CommandSyntaxKind.EndFor, endForToken.range);
    }
}

export class WhileCommandSyntax extends BaseCommandSyntax {
    public constructor(
        readonly whileToken: Token,
        readonly expression: BaseExpressionSyntax) {
        super(CommandSyntaxKind.While, CompilerUtils.combineRanges(whileToken.range, expression.range));
    }
}

export class EndWhileCommandSyntax extends BaseCommandSyntax {
    public constructor(
        readonly endWhileToken: Token) {
        super(CommandSyntaxKind.EndWhile, endWhileToken.range);
    }
}

export class LabelCommandSyntax extends BaseCommandSyntax {
    public constructor(
        readonly labelToken: Token,
        readonly colonToken: Token) {
        super(CommandSyntaxKind.Label, CompilerUtils.combineRanges(labelToken.range, colonToken.range));
    }
}

export class GoToCommandSyntax extends BaseCommandSyntax {
    public constructor(
        readonly goToToken: Token,
        readonly labelToken: Token) {
        super(CommandSyntaxKind.GoTo, CompilerUtils.combineRanges(goToToken.range, labelToken.range));
    }
}

export class SubCommandSyntax extends BaseCommandSyntax {
    public constructor(
        readonly subToken: Token,
        readonly nameToken: Token) {
        super(CommandSyntaxKind.Sub, CompilerUtils.combineRanges(subToken.range, nameToken.range));
    }
}

export class EndSubCommandSyntax extends BaseCommandSyntax {
    public constructor(
        readonly endSubToken: Token) {
        super(CommandSyntaxKind.EndSub, endSubToken.range);
    }
}

export class ExpressionCommandSyntax extends BaseCommandSyntax {
    public constructor(
        readonly expression: BaseExpressionSyntax) {
        super(CommandSyntaxKind.Expression, expression.range);
    }
}

export class MissingCommandSyntax extends BaseCommandSyntax {
    public constructor(
        expectedKind: CommandSyntaxKind,
        expectedRange: TextRange) {
        super(expectedKind, expectedRange);
    }
}
