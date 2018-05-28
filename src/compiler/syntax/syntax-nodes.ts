import { CompilerRange, CompilerPosition } from "./ranges";
import { Token } from "./tokens";

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

export abstract class BaseSyntaxNode {
    protected constructor(
        public readonly kind: SyntaxKind,
        public readonly range: CompilerRange) {
    }

    public abstract children(): ReadonlyArray<BaseSyntaxNode>;
}

export class ParseTreeSyntax extends BaseSyntaxNode {
    public constructor(
        public readonly mainModule: ReadonlyArray<BaseStatementSyntax>,
        public readonly subModules: ReadonlyArray<SubModuleDeclarationSyntax>) {
        super(SyntaxKind.ParseTree, CompilerRange.fromPositions(
            mainModule.length ? mainModule[0].range.start : subModules.length ? subModules[0].range.start : new CompilerPosition(0, 0),
            subModules.length ? subModules[subModules.length - 1].range.end : mainModule.length ? mainModule[mainModule.length - 1].range.end : new CompilerPosition(0, 0)));
    }

    public children(): ReadonlyArray<BaseSyntaxNode> {
        return [...this.mainModule, ...this.subModules];
    }
}

export class SubModuleDeclarationSyntax extends BaseSyntaxNode {
    public constructor(
        public readonly subCommand: SubCommandSyntax,
        public readonly statementsList: ReadonlyArray<BaseStatementSyntax>,
        public readonly endSubCommand: EndSubCommandSyntax) {
        super(SyntaxKind.SubModuleDeclaration, CompilerRange.combine(subCommand.range, endSubCommand.range));
    }

    public children(): ReadonlyArray<BaseSyntaxNode> {
        return [this.subCommand, ...this.statementsList, this.endSubCommand];
    }
}

export abstract class BaseStatementSyntax extends BaseSyntaxNode {
    protected constructor(
        public readonly kind: SyntaxKind,
        public readonly range: CompilerRange) {
        super(kind, range);
    }
}

export class IfHeaderSyntax<THeaderSyntax extends IfCommandSyntax | ElseIfCommandSyntax | ElseCommandSyntax> extends BaseSyntaxNode {
    public constructor(
        public readonly headerCommand: THeaderSyntax,
        public readonly statementsList: ReadonlyArray<BaseStatementSyntax>) {
        super(SyntaxKind.IfHeader, statementsList.length
            ? CompilerRange.combine(headerCommand.range, statementsList[statementsList.length - 1].range)
            : headerCommand.range);
    }

    public children(): ReadonlyArray<BaseSyntaxNode> {
        return [this.headerCommand, ...this.statementsList];
    }
}

export class IfStatementSyntax extends BaseStatementSyntax {
    public constructor(
        public readonly ifPart: IfHeaderSyntax<IfCommandSyntax>,
        public readonly elseIfParts: ReadonlyArray<IfHeaderSyntax<ElseIfCommandSyntax>>,
        public readonly elsePartOpt: IfHeaderSyntax<ElseCommandSyntax> | undefined,
        public readonly endIfCommand: EndIfCommandSyntax) {
        super(SyntaxKind.IfStatement, CompilerRange.combine(ifPart.range, endIfCommand.range));
    }

    public children(): ReadonlyArray<BaseSyntaxNode> {
        return this.elsePartOpt
            ? [this.ifPart, ...this.elseIfParts, this.elsePartOpt, this.endIfCommand]
            : [this.ifPart, ...this.elseIfParts, this.endIfCommand];
    }
}

export class WhileStatementSyntax extends BaseStatementSyntax {
    public constructor(
        public readonly whileCommand: WhileCommandSyntax,
        public readonly statementsList: ReadonlyArray<BaseStatementSyntax>,
        public readonly endWhileCommand: EndWhileCommandSyntax) {
        super(SyntaxKind.WhileStatement, CompilerRange.combine(whileCommand.range, endWhileCommand.range));
    }

    public children(): ReadonlyArray<BaseSyntaxNode> {
        return [this.whileCommand, ...this.statementsList, this.endWhileCommand];
    }
}

export class ForStatementSyntax extends BaseStatementSyntax {
    public constructor(
        public readonly forCommand: ForCommandSyntax,
        public readonly statementsList: ReadonlyArray<BaseStatementSyntax>,
        public readonly endForCommand: EndForCommandSyntax) {
        super(SyntaxKind.ForStatement, CompilerRange.combine(forCommand.range, endForCommand.range));
    }

    public children(): ReadonlyArray<BaseSyntaxNode> {
        return [this.forCommand, ...this.statementsList, this.endForCommand];
    }
}

export abstract class BaseCommandSyntax extends BaseSyntaxNode {
    protected constructor(
        public readonly kind: SyntaxKind,
        public readonly range: CompilerRange) {
        super(kind, range);
    }
}

export class IfCommandSyntax extends BaseCommandSyntax {
    public constructor(
        public readonly ifToken: TokenSyntax,
        public readonly expression: BaseExpressionSyntax,
        public readonly thenToken: TokenSyntax) {
        super(SyntaxKind.IfCommand, CompilerRange.combine(ifToken.range, thenToken.range));
    }

    public children(): ReadonlyArray<BaseSyntaxNode> {
        return [this.ifToken, this.expression, this.thenToken];
    }
}

export class ElseCommandSyntax extends BaseCommandSyntax {
    public constructor(
        public readonly elseToken: TokenSyntax) {
        super(SyntaxKind.ElseCommand, elseToken.range);
    }

    public children(): ReadonlyArray<BaseSyntaxNode> {
        return [this.elseToken];
    }
}

export class ElseIfCommandSyntax extends BaseCommandSyntax {
    public constructor(
        public readonly elseIfToken: TokenSyntax,
        public readonly expression: BaseExpressionSyntax,
        public readonly thenToken: TokenSyntax) {
        super(SyntaxKind.ElseIfCommand, CompilerRange.combine(elseIfToken.range, thenToken.range));
    }

    public children(): ReadonlyArray<BaseSyntaxNode> {
        return [this.elseIfToken, this.expression, this.thenToken];
    }
}

export class EndIfCommandSyntax extends BaseCommandSyntax {
    public constructor(
        public readonly endIfToken: TokenSyntax) {
        super(SyntaxKind.EndIfCommand, endIfToken.range);
    }

    public children(): ReadonlyArray<BaseSyntaxNode> {
        return [this.endIfToken];
    }
}

export class ForStepClauseSyntax extends BaseCommandSyntax {
    public constructor(
        public readonly stepToken: TokenSyntax,
        public readonly expression: BaseExpressionSyntax) {
        super(SyntaxKind.ForStepClause, CompilerRange.combine(stepToken.range, expression.range));
    }

    public children(): ReadonlyArray<BaseSyntaxNode> {
        return [this.stepToken, this.expression];
    }
}

export class ForCommandSyntax extends BaseCommandSyntax {
    public constructor(
        public readonly forToken: TokenSyntax,
        public readonly identifierToken: TokenSyntax,
        public readonly equalToken: TokenSyntax,
        public readonly fromExpression: BaseExpressionSyntax,
        public readonly toToken: TokenSyntax,
        public readonly toExpression: BaseExpressionSyntax,
        public readonly stepClauseOpt?: ForStepClauseSyntax) {
        super(SyntaxKind.ForCommand, CompilerRange.combine(
            forToken.range,
            stepClauseOpt ? stepClauseOpt.expression.range : toExpression.range));
    }

    public children(): ReadonlyArray<BaseSyntaxNode> {
        const children = [this.forToken, this.identifierToken, this.equalToken, this.fromExpression, this.toToken, this.toExpression];
        if (this.stepClauseOpt) {
            children.push(this.stepClauseOpt);
        }
        return children;
    }
}

export class EndForCommandSyntax extends BaseCommandSyntax {
    public constructor(
        public readonly endForToken: TokenSyntax) {
        super(SyntaxKind.EndForCommand, endForToken.range);
    }

    public children(): ReadonlyArray<BaseSyntaxNode> {
        return [this.endForToken];
    }
}

export class WhileCommandSyntax extends BaseCommandSyntax {
    public constructor(
        public readonly whileToken: TokenSyntax,
        public readonly expression: BaseExpressionSyntax) {
        super(SyntaxKind.WhileCommand, CompilerRange.combine(whileToken.range, expression.range));
    }

    public children(): ReadonlyArray<BaseSyntaxNode> {
        return [this.whileToken, this.expression];
    }
}

export class EndWhileCommandSyntax extends BaseCommandSyntax {
    public constructor(
        public readonly endWhileToken: TokenSyntax) {
        super(SyntaxKind.EndWhileCommand, endWhileToken.range);
    }

    public children(): ReadonlyArray<BaseSyntaxNode> {
        return [this.endWhileToken];
    }
}

export class LabelCommandSyntax extends BaseCommandSyntax {
    public constructor(
        public readonly labelToken: TokenSyntax,
        public readonly colonToken: TokenSyntax) {
        super(SyntaxKind.LabelCommand, CompilerRange.combine(labelToken.range, colonToken.range));
    }

    public children(): ReadonlyArray<BaseSyntaxNode> {
        return [this.labelToken, this.colonToken];
    }
}

export class GoToCommandSyntax extends BaseCommandSyntax {
    public constructor(
        public readonly goToToken: TokenSyntax,
        public readonly labelToken: TokenSyntax) {
        super(SyntaxKind.GoToCommand, CompilerRange.combine(goToToken.range, labelToken.range));
    }

    public children(): ReadonlyArray<BaseSyntaxNode> {
        return [this.goToToken, this.labelToken];
    }
}

export class SubCommandSyntax extends BaseCommandSyntax {
    public constructor(
        public readonly subToken: TokenSyntax,
        public readonly nameToken: TokenSyntax) {
        super(SyntaxKind.SubCommand, CompilerRange.combine(subToken.range, nameToken.range));
    }

    public children(): ReadonlyArray<BaseSyntaxNode> {
        return [this.subToken, this.nameToken];
    }
}

export class EndSubCommandSyntax extends BaseCommandSyntax {
    public constructor(
        public readonly endSubToken: TokenSyntax) {
        super(SyntaxKind.EndSubCommand, endSubToken.range);
    }

    public children(): ReadonlyArray<BaseSyntaxNode> {
        return [this.endSubToken];
    }
}

export class ExpressionCommandSyntax extends BaseCommandSyntax {
    public constructor(
        public readonly expression: BaseExpressionSyntax) {
        super(SyntaxKind.ExpressionCommand, expression.range);
    }

    public children(): ReadonlyArray<BaseSyntaxNode> {
        return [this.expression];
    }
}

export class CommentCommandSyntax extends BaseCommandSyntax {
    public constructor(
        public readonly commentToken: TokenSyntax) {
        super(SyntaxKind.CommentCommand, commentToken.range);
    }

    public children(): ReadonlyArray<BaseSyntaxNode> {
        return [this.commentToken];
    }
}

export class MissingCommandSyntax extends BaseCommandSyntax {
    public constructor(
        expectedKind: SyntaxKind,
        expectedRange: CompilerRange) {
        super(expectedKind, expectedRange);
    }

    public children(): ReadonlyArray<BaseSyntaxNode> {
        return [];
    }
}

export abstract class BaseExpressionSyntax extends BaseSyntaxNode {
    protected constructor(
        public readonly kind: SyntaxKind,
        public readonly range: CompilerRange) {
        super(kind, range);
    }
}

export class UnaryOperatorExpressionSyntax extends BaseExpressionSyntax {
    public constructor(
        public readonly operatorToken: TokenSyntax,
        public readonly expression: BaseExpressionSyntax) {
        super(SyntaxKind.UnaryOperatorExpression, CompilerRange.combine(operatorToken.range, expression.range));
    }

    public children(): ReadonlyArray<BaseSyntaxNode> {
        return [this.operatorToken, this.expression];
    }
}

export class BinaryOperatorExpressionSyntax extends BaseExpressionSyntax {
    public constructor(
        public readonly leftExpression: BaseExpressionSyntax,
        public readonly operatorToken: TokenSyntax,
        public readonly rightExpression: BaseExpressionSyntax) {
        super(SyntaxKind.BinaryOperatorExpression, CompilerRange.combine(leftExpression.range, rightExpression.range));
    }

    public children(): ReadonlyArray<BaseSyntaxNode> {
        return [this.leftExpression, this.operatorToken, this.rightExpression];
    }
}

export class ObjectAccessExpressionSyntax extends BaseExpressionSyntax {
    public constructor(
        public readonly baseExpression: BaseExpressionSyntax,
        public readonly dotToken: TokenSyntax,
        public readonly identifierToken: TokenSyntax) {
        super(SyntaxKind.ObjectAccessExpression, CompilerRange.combine(baseExpression.range, identifierToken.range));
    }

    public children(): ReadonlyArray<BaseSyntaxNode> {
        return [this.baseExpression, this.dotToken, this.identifierToken];
    }
}

export class ArrayAccessExpressionSyntax extends BaseExpressionSyntax {
    public constructor(
        public readonly baseExpression: BaseExpressionSyntax,
        public readonly leftBracketToken: TokenSyntax,
        public readonly indexExpression: BaseExpressionSyntax,
        public readonly rightBracketToken: TokenSyntax) {
        super(SyntaxKind.ArrayAccessExpression, CompilerRange.combine(baseExpression.range, rightBracketToken.range));
    }

    public children(): ReadonlyArray<BaseSyntaxNode> {
        return [this.baseExpression, this.leftBracketToken, this.indexExpression, this.rightBracketToken];
    }
}

export class ArgumentSyntax extends BaseSyntaxNode {
    public constructor(
        public readonly expression: BaseExpressionSyntax,
        public readonly commaOpt?: TokenSyntax) {
        super(SyntaxKind.Argument, commaOpt ? CompilerRange.combine(expression.range, commaOpt.range) : expression.range);
    }

    public children(): ReadonlyArray<BaseSyntaxNode> {
        return this.commaOpt ? [this.expression, this.commaOpt] : [this.expression];
    }
}

export class CallExpressionSyntax extends BaseExpressionSyntax {
    public constructor(
        public readonly baseExpression: BaseExpressionSyntax,
        public readonly leftParenToken: TokenSyntax,
        public readonly argumentsList: ReadonlyArray<ArgumentSyntax>,
        public readonly rightParenToken: TokenSyntax) {
        super(SyntaxKind.CallExpression, CompilerRange.combine(baseExpression.range, rightParenToken.range));
    }

    public children(): ReadonlyArray<BaseSyntaxNode> {
        return [this.baseExpression, this.leftParenToken, ...this.argumentsList, this.rightParenToken];
    }
}

export class ParenthesisExpressionSyntax extends BaseExpressionSyntax {
    public constructor(
        public readonly leftParenToken: TokenSyntax,
        public readonly expression: BaseExpressionSyntax,
        public readonly rightParenToken: TokenSyntax) {
        super(SyntaxKind.ParenthesisExpression, CompilerRange.combine(leftParenToken.range, rightParenToken.range));
    }

    public children(): ReadonlyArray<BaseSyntaxNode> {
        return [this.leftParenToken, this.expression, this.rightParenToken];
    }
}

export class IdentifierExpressionSyntax extends BaseExpressionSyntax {
    public constructor(
        public readonly identifierToken: TokenSyntax) {
        super(SyntaxKind.IdentifierExpression, identifierToken.range);
    }

    public children(): ReadonlyArray<BaseSyntaxNode> {
        return [this.identifierToken];
    }
}

export class StringLiteralExpressionSyntax extends BaseExpressionSyntax {
    public constructor(
        public readonly stringToken: TokenSyntax) {
        super(SyntaxKind.StringLiteralExpression, stringToken.range);
    }

    public children(): ReadonlyArray<BaseSyntaxNode> {
        return [this.stringToken];

    }
}

export class NumberLiteralExpressionSyntax extends BaseExpressionSyntax {
    public constructor(
        public readonly numberToken: TokenSyntax) {
        super(SyntaxKind.NumberLiteralExpression, numberToken.range);
    }

    public children(): ReadonlyArray<BaseSyntaxNode> {
        return [this.numberToken];
    }
}

export class TokenSyntax extends BaseSyntaxNode {
    public constructor(
        public readonly token: Token) {
        super(SyntaxKind.Token, token.range);
    }

    public children(): ReadonlyArray<BaseSyntaxNode> {
        return [];
    }
}
