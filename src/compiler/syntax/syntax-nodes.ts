import { CompilerRange, CompilerPosition } from "./ranges";
import { Token, TokenKind } from "./tokens";
import { SyntaxNodesResources } from "../../strings/syntax-nodes";

export enum SyntaxKind {
    ParseTree,
    SubModuleDeclaration,

    // Statements
    IfHeader,
    IfStatement,
    WhileStatement,
    ForStatement,

    // Commands
    IfCommand,
    ElseCommand,
    ElseIfCommand,
    EndIfCommand,
    ForStepClause,
    ForCommand,
    EndForCommand,
    WhileCommand,
    EndWhileCommand,
    LabelCommand,
    GoToCommand,
    SubCommand,
    EndSubCommand,
    ExpressionCommand,
    CommentCommand,

    // Expressions
    UnaryOperatorExpression,
    BinaryOperatorExpression,
    ObjectAccessExpression,
    ArrayAccessExpression,
    Argument,
    CallExpression,
    ParenthesisExpression,
    IdentifierExpression,
    NumberLiteralExpression,
    StringLiteralExpression,

    Token
}

export abstract class BaseSyntax {
    protected constructor(
        public readonly kind: SyntaxKind,
        public readonly range: CompilerRange) {
    }

    public abstract children(): ReadonlyArray<BaseSyntax>;

    public static toDisplayString(kind: SyntaxKind): string {
        switch (kind) {
            case SyntaxKind.IfCommand: return Token.toDisplayString(TokenKind.IfKeyword);
            case SyntaxKind.ElseCommand: return Token.toDisplayString(TokenKind.ElseKeyword);
            case SyntaxKind.ElseIfCommand: return Token.toDisplayString(TokenKind.ElseIfKeyword);
            case SyntaxKind.EndIfCommand: return Token.toDisplayString(TokenKind.EndIfKeyword);
            case SyntaxKind.ForCommand: return Token.toDisplayString(TokenKind.ForKeyword);
            case SyntaxKind.EndForCommand: return Token.toDisplayString(TokenKind.EndForKeyword);
            case SyntaxKind.WhileCommand: return Token.toDisplayString(TokenKind.WhileKeyword);
            case SyntaxKind.EndWhileCommand: return Token.toDisplayString(TokenKind.EndWhileKeyword);
            case SyntaxKind.LabelCommand: return SyntaxNodesResources.Label;
            case SyntaxKind.GoToCommand: return Token.toDisplayString(TokenKind.GoToKeyword);
            case SyntaxKind.SubCommand: return Token.toDisplayString(TokenKind.SubKeyword);
            case SyntaxKind.EndSubCommand: return Token.toDisplayString(TokenKind.EndSubKeyword);
            case SyntaxKind.ExpressionCommand: return SyntaxNodesResources.Expression;
            default: throw new Error(`Unexpected syntax kind: ${SyntaxKind[kind]}`);
        }
    }
}

export class ParseTreeSyntax extends BaseSyntax {
    public constructor(
        readonly mainModule: ReadonlyArray<BaseSyntax>,
        readonly subModules: ReadonlyArray<SubModuleDeclarationSyntax>) {
        super(SyntaxKind.ParseTree, CompilerRange.fromPositions(
            mainModule.length ? mainModule[0].range.start : subModules.length ? subModules[0].range.start : new CompilerPosition(0, 0),
            subModules.length ? subModules[subModules.length - 1].range.end : mainModule.length ? mainModule[mainModule.length - 1].range.end : new CompilerPosition(0, 0)));
    }

    public children(): ReadonlyArray<BaseSyntax> {
        return [...this.mainModule, ...this.subModules];
    }
}

export class SubModuleDeclarationSyntax extends BaseSyntax {
    public constructor(
        readonly subCommand: SubCommandSyntax,
        readonly statementsList: ReadonlyArray<BaseSyntax>,
        readonly endSubCommand: EndSubCommandSyntax) {
        super(SyntaxKind.SubModuleDeclaration, CompilerRange.combine(subCommand.range, endSubCommand.range));
    }

    public children(): ReadonlyArray<BaseSyntax> {
        return [this.subCommand, ...this.statementsList, this.endSubCommand];
    }
}

export class IfHeaderSyntax<THeaderCommand extends IfCommandSyntax | ElseIfCommandSyntax | ElseCommandSyntax> extends BaseSyntax {
    public constructor(
        readonly headerCommand: THeaderCommand,
        readonly statementsList: ReadonlyArray<BaseSyntax>) {
        super(SyntaxKind.IfHeader, statementsList.length
            ? CompilerRange.combine(headerCommand.range, statementsList[statementsList.length - 1].range)
            : headerCommand.range);
    }

    public children(): ReadonlyArray<BaseSyntax> {
        return [this.headerCommand, ...this.statementsList];
    }
}

export class IfStatementSyntax extends BaseSyntax {
    public constructor(
        readonly ifPart: IfHeaderSyntax<IfCommandSyntax>,
        readonly elseIfParts: ReadonlyArray<IfHeaderSyntax<ElseIfCommandSyntax>>,
        readonly elsePartOpt: IfHeaderSyntax<ElseCommandSyntax> | undefined,
        readonly endIfCommand: EndIfCommandSyntax) {
        super(SyntaxKind.IfStatement, CompilerRange.combine(ifPart.range, endIfCommand.range));
    }

    public children(): ReadonlyArray<BaseSyntax> {
        return this.elsePartOpt
            ? [this.ifPart, ...this.elseIfParts, this.elsePartOpt, this.endIfCommand]
            : [this.ifPart, ...this.elseIfParts, this.endIfCommand];
    }
}

export class WhileStatementSyntax extends BaseSyntax {
    public constructor(
        readonly whileCommand: WhileCommandSyntax,
        readonly statementsList: ReadonlyArray<BaseSyntax>,
        readonly endWhileCommand: EndWhileCommandSyntax) {
        super(SyntaxKind.WhileStatement, CompilerRange.combine(whileCommand.range, endWhileCommand.range));
    }

    public children(): ReadonlyArray<BaseSyntax> {
        return [this.whileCommand, ...this.statementsList, this.endWhileCommand];
    }
}

export class ForStatementSyntax extends BaseSyntax {
    public constructor(
        readonly forCommand: ForCommandSyntax,
        readonly statementsList: ReadonlyArray<BaseSyntax>,
        readonly endForCommand: EndForCommandSyntax) {
        super(SyntaxKind.ForStatement, CompilerRange.combine(forCommand.range, endForCommand.range));
    }

    public children(): ReadonlyArray<BaseSyntax> {
        return [this.forCommand, ...this.statementsList, this.endForCommand];
    }
}

export class IfCommandSyntax extends BaseSyntax {
    public constructor(
        readonly ifToken: TokenSyntax,
        readonly expression: BaseSyntax,
        readonly thenToken: TokenSyntax) {
        super(SyntaxKind.IfCommand, CompilerRange.combine(ifToken.range, thenToken.range));
    }

    public children(): ReadonlyArray<BaseSyntax> {
        return [this.ifToken, this.expression, this.thenToken];
    }
}

export class ElseCommandSyntax extends BaseSyntax {
    public constructor(
        readonly elseToken: TokenSyntax) {
        super(SyntaxKind.ElseCommand, elseToken.range);
    }

    public children(): ReadonlyArray<BaseSyntax> {
        return [this.elseToken];
    }
}

export class ElseIfCommandSyntax extends BaseSyntax {
    public constructor(
        readonly elseIfToken: TokenSyntax,
        readonly expression: BaseSyntax,
        readonly thenToken: TokenSyntax) {
        super(SyntaxKind.ElseIfCommand, CompilerRange.combine(elseIfToken.range, thenToken.range));
    }

    public children(): ReadonlyArray<BaseSyntax> {
        return [this.elseIfToken, this.expression, this.thenToken];
    }
}

export class EndIfCommandSyntax extends BaseSyntax {
    public constructor(
        readonly endIfToken: TokenSyntax) {
        super(SyntaxKind.EndIfCommand, endIfToken.range);
    }

    public children(): ReadonlyArray<BaseSyntax> {
        return [this.endIfToken];
    }
}

export class ForStepClause extends BaseSyntax {
    public constructor(
        readonly stepToken: TokenSyntax,
        readonly expression: BaseSyntax) {
        super(SyntaxKind.ForStepClause, CompilerRange.combine(stepToken.range, expression.range));
    }

    public children(): ReadonlyArray<BaseSyntax> {
        return [this.stepToken, this.expression];
    }
}

export class ForCommandSyntax extends BaseSyntax {
    public constructor(
        readonly forToken: TokenSyntax,
        readonly identifierToken: TokenSyntax,
        readonly equalToken: TokenSyntax,
        readonly fromExpression: BaseSyntax,
        readonly toToken: TokenSyntax,
        readonly toExpression: BaseSyntax,
        readonly stepClauseOpt?: ForStepClause) {
        super(SyntaxKind.ForCommand, CompilerRange.combine(
            forToken.range,
            stepClauseOpt ? stepClauseOpt.expression.range : toExpression.range));
    }

    public children(): ReadonlyArray<BaseSyntax> {
        const children = [this.forToken, this.identifierToken, this.equalToken, this.fromExpression, this.toToken, this.toExpression];
        if (this.stepClauseOpt) {
            children.push(this.stepClauseOpt);
        }
        return children;
    }
}

export class EndForCommandSyntax extends BaseSyntax {
    public constructor(
        readonly endForToken: TokenSyntax) {
        super(SyntaxKind.EndForCommand, endForToken.range);
    }

    public children(): ReadonlyArray<BaseSyntax> {
        return [this.endForToken];
    }
}

export class WhileCommandSyntax extends BaseSyntax {
    public constructor(
        readonly whileToken: TokenSyntax,
        readonly expression: BaseSyntax) {
        super(SyntaxKind.WhileCommand, CompilerRange.combine(whileToken.range, expression.range));
    }

    public children(): ReadonlyArray<BaseSyntax> {
        return [this.whileToken, this.expression];
    }
}

export class EndWhileCommandSyntax extends BaseSyntax {
    public constructor(
        readonly endWhileToken: TokenSyntax) {
        super(SyntaxKind.EndWhileCommand, endWhileToken.range);
    }

    public children(): ReadonlyArray<BaseSyntax> {
        return [this.endWhileToken];
    }
}

export class LabelCommandSyntax extends BaseSyntax {
    public constructor(
        readonly labelToken: TokenSyntax,
        readonly colonToken: TokenSyntax) {
        super(SyntaxKind.LabelCommand, CompilerRange.combine(labelToken.range, colonToken.range));
    }

    public children(): ReadonlyArray<BaseSyntax> {
        return [this.labelToken, this.colonToken];
    }
}

export class GoToCommandSyntax extends BaseSyntax {
    public constructor(
        readonly goToToken: TokenSyntax,
        readonly labelToken: TokenSyntax) {
        super(SyntaxKind.GoToCommand, CompilerRange.combine(goToToken.range, labelToken.range));
    }

    public children(): ReadonlyArray<BaseSyntax> {
        return [this.goToToken, this.labelToken];
    }
}

export class SubCommandSyntax extends BaseSyntax {
    public constructor(
        readonly subToken: TokenSyntax,
        readonly nameToken: TokenSyntax) {
        super(SyntaxKind.SubCommand, CompilerRange.combine(subToken.range, nameToken.range));
    }

    public children(): ReadonlyArray<BaseSyntax> {
        return [this.subToken, this.nameToken];
    }
}

export class EndSubCommandSyntax extends BaseSyntax {
    public constructor(
        readonly endSubToken: TokenSyntax) {
        super(SyntaxKind.EndSubCommand, endSubToken.range);
    }

    public children(): ReadonlyArray<BaseSyntax> {
        return [this.endSubToken];
    }
}

export class ExpressionCommandSyntax extends BaseSyntax {
    public constructor(
        readonly expression: BaseSyntax) {
        super(SyntaxKind.ExpressionCommand, expression.range);
    }

    public children(): ReadonlyArray<BaseSyntax> {
        return [this.expression];
    }
}

export class CommentCommandSyntax extends BaseSyntax {
    public constructor(
        readonly commentToken: TokenSyntax) {
        super(SyntaxKind.CommentCommand, commentToken.range);
    }

    public children(): ReadonlyArray<BaseSyntax> {
        return [this.commentToken];
    }
}

export class MissingCommandSyntax extends BaseSyntax {
    public constructor(
        expectedKind: SyntaxKind,
        expectedRange: CompilerRange) {
        super(expectedKind, expectedRange);
    }

    public children(): ReadonlyArray<BaseSyntax> {
        return [];
    }
}

export class UnaryOperatorExpressionSyntax extends BaseSyntax {
    public constructor(
        public readonly operatorToken: TokenSyntax,
        public readonly expression: BaseSyntax) {
        super(SyntaxKind.UnaryOperatorExpression, CompilerRange.combine(operatorToken.range, expression.range));
    }

    public children(): ReadonlyArray<BaseSyntax> {
        return [this.operatorToken, this.expression];
    }
}

export class BinaryOperatorExpressionSyntax extends BaseSyntax {
    public constructor(
        public readonly leftExpression: BaseSyntax,
        public readonly operatorToken: TokenSyntax,
        public readonly rightExpression: BaseSyntax) {
        super(SyntaxKind.BinaryOperatorExpression, CompilerRange.combine(leftExpression.range, rightExpression.range));
    }

    public children(): ReadonlyArray<BaseSyntax> {
        return [this.leftExpression, this.operatorToken, this.rightExpression];
    }
}

export class ObjectAccessExpressionSyntax extends BaseSyntax {
    public constructor(
        public readonly baseExpression: BaseSyntax,
        public readonly dotToken: TokenSyntax,
        public readonly identifierToken: TokenSyntax) {
        super(SyntaxKind.ObjectAccessExpression, CompilerRange.combine(baseExpression.range, identifierToken.range));
    }

    public children(): ReadonlyArray<BaseSyntax> {
        return [this.baseExpression, this.dotToken, this.identifierToken];
    }
}

export class ArrayAccessExpressionSyntax extends BaseSyntax {
    public constructor(
        public readonly baseExpression: BaseSyntax,
        public readonly leftBracketToken: TokenSyntax,
        public readonly indexExpression: BaseSyntax,
        public readonly rightBracketToken: TokenSyntax) {
        super(SyntaxKind.ArrayAccessExpression, CompilerRange.combine(baseExpression.range, rightBracketToken.range));
    }

    public children(): ReadonlyArray<BaseSyntax> {
        return [this.baseExpression, this.leftBracketToken, this.indexExpression, this.rightBracketToken];
    }
}

export class ArgumentSyntax extends BaseSyntax {
    public constructor(
        public readonly expression: BaseSyntax,
        public readonly commaOpt?: TokenSyntax) {
        super(SyntaxKind.Argument, commaOpt ? CompilerRange.combine(expression.range, commaOpt.range) : expression.range);
    }

    public children(): ReadonlyArray<BaseSyntax> {
        return this.commaOpt ? [this.expression, this.commaOpt] : [this.expression];
    }
}

export class CallExpressionSyntax extends BaseSyntax {
    public constructor(
        public readonly baseExpression: BaseSyntax,
        public readonly leftParenToken: TokenSyntax,
        public readonly argumentsList: ReadonlyArray<ArgumentSyntax>,
        public readonly rightParenToken: TokenSyntax) {
        super(SyntaxKind.CallExpression, CompilerRange.combine(baseExpression.range, rightParenToken.range));
    }

    public children(): ReadonlyArray<BaseSyntax> {
        return [this.baseExpression, this.leftParenToken, ...this.argumentsList, this.rightParenToken];
    }
}

export class ParenthesisExpressionSyntax extends BaseSyntax {
    public constructor(
        public readonly leftParenToken: TokenSyntax,
        public readonly expression: BaseSyntax,
        public readonly rightParenToken: TokenSyntax) {
        super(SyntaxKind.ParenthesisExpression, CompilerRange.combine(leftParenToken.range, rightParenToken.range));
    }

    public children(): ReadonlyArray<BaseSyntax> {
        return [this.leftParenToken, this.expression, this.rightParenToken];
    }
}

export class IdentifierExpressionSyntax extends BaseSyntax {
    public constructor(
        public readonly identifierToken: TokenSyntax) {
        super(SyntaxKind.IdentifierExpression, identifierToken.range);
    }

    public children(): ReadonlyArray<BaseSyntax> {
        return [this.identifierToken];
    }
}

export class StringLiteralExpressionSyntax extends BaseSyntax {
    public constructor(
        public readonly stringToken: TokenSyntax) {
        super(SyntaxKind.StringLiteralExpression, stringToken.range);
    }

    public children(): ReadonlyArray<BaseSyntax> {
        return [this.stringToken];
    }
}

export class NumberLiteralExpressionSyntax extends BaseSyntax {
    public constructor(
        public readonly numberToken: TokenSyntax) {
        super(SyntaxKind.NumberLiteralExpression, numberToken.range);
    }

    public children(): ReadonlyArray<BaseSyntax> {
        return [this.numberToken];
    }
}

export class TokenSyntax extends BaseSyntax {
    public constructor(
        public readonly token: Token) {
        super(SyntaxKind.Token, token.range);
    }

    public children(): ReadonlyArray<BaseSyntax> {
        return [];
    }
}
