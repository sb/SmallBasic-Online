import { SubCommandSyntax, EndSubCommandSyntax, IfCommandSyntax, ElseIfCommandSyntax, ElseCommandSyntax, EndIfCommandSyntax, WhileCommandSyntax, EndWhileCommandSyntax, ForCommandSyntax, EndForCommandSyntax, LabelCommandSyntax, GoToCommandSyntax, ExpressionCommandSyntax } from "./commands";
import { BaseSyntaxNode } from "../syntax-nodes";

export enum StatementSyntaxKind {
    SubModule,
    If,
    While,
    For,
    Label,
    GoTo,
    Expression
}

export abstract class BaseStatementSyntax extends BaseSyntaxNode {
    public constructor(
        public readonly kind: StatementSyntaxKind) {
        super();
    }
}

export class SubModuleStatementSyntax extends BaseStatementSyntax {
    public constructor(
        readonly subCommand: SubCommandSyntax,
        readonly statementsList: ReadonlyArray<BaseStatementSyntax>,
        readonly endSubCommand: EndSubCommandSyntax) {
        super(StatementSyntaxKind.SubModule);
    }
}

export interface IfConditionSyntax {
    readonly headerCommand: IfCommandSyntax;
    readonly statementsList: ReadonlyArray<BaseStatementSyntax>;
}

export interface ElseIfConditionSyntax {
    readonly headerCommand: ElseIfCommandSyntax;
    readonly statementsList: ReadonlyArray<BaseStatementSyntax>;
}

export interface ElseConditionSyntax {
    readonly headerCommand: ElseCommandSyntax;
    readonly statementsList: ReadonlyArray<BaseStatementSyntax>;
}

export class IfStatementSyntax extends BaseStatementSyntax {
    public constructor(
        readonly ifPart: IfConditionSyntax,
        readonly elseIfParts: ReadonlyArray<ElseIfConditionSyntax>,
        readonly elsePart: ElseConditionSyntax | undefined,
        readonly endIfCommand: EndIfCommandSyntax) {
        super(StatementSyntaxKind.If);
    }
}

export class WhileStatementSyntax extends BaseStatementSyntax {
    public constructor(
        readonly whileCommand: WhileCommandSyntax,
        readonly statementsList: ReadonlyArray<BaseStatementSyntax>,
        readonly endWhileCommand: EndWhileCommandSyntax) {
        super(StatementSyntaxKind.While);
    }
}

export class ForStatementSyntax extends BaseStatementSyntax {
    public constructor(
        readonly forCommand: ForCommandSyntax,
        readonly statementsList: ReadonlyArray<BaseStatementSyntax>,
        readonly endForCommand: EndForCommandSyntax) {
        super(StatementSyntaxKind.For);
    }
}

export class LabelStatementSyntax extends BaseStatementSyntax {
    public constructor(
        readonly command: LabelCommandSyntax) {
        super(StatementSyntaxKind.Label);
    }
}

export class GoToStatementSyntax extends BaseStatementSyntax {
    public constructor(
        readonly command: GoToCommandSyntax) {
        super(StatementSyntaxKind.GoTo);
    }
}

export class ExpressionStatementSyntax extends BaseStatementSyntax {
    public constructor(
        readonly command: ExpressionCommandSyntax) {
        super(StatementSyntaxKind.Expression);
    }
}
