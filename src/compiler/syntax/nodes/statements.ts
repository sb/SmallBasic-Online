import { SubCommandSyntax, EndSubCommandSyntax, IfCommandSyntax, ElseIfCommandSyntax, ElseCommandSyntax, EndIfCommandSyntax, WhileCommandSyntax, EndWhileCommandSyntax, ForCommandSyntax, EndForCommandSyntax, LabelCommandSyntax, GoToCommandSyntax, ExpressionCommandSyntax } from "./commands";

export enum StatementSyntaxKind {
    SubModule,
    If,
    While,
    For,
    Label,
    GoTo,
    Expression
}

export abstract class BaseStatementSyntax {
    public abstract get kind(): StatementSyntaxKind;
}

export class SubModuleStatementSyntax extends BaseStatementSyntax {
    public constructor(
        readonly subCommand: SubCommandSyntax,
        readonly statementsList: BaseStatementSyntax[],
        readonly endSubCommand: EndSubCommandSyntax) {
        super();
    }

    public get kind(): StatementSyntaxKind {
        return StatementSyntaxKind.SubModule;
    }
}

export interface IfCondition {
    readonly headerCommand: IfCommandSyntax;
    readonly statementsList: BaseStatementSyntax[];
}

export interface ElseIfCondition {
    readonly headerCommand: ElseIfCommandSyntax;
    readonly statementsList: BaseStatementSyntax[];
}

export interface ElseCondition {
    readonly headerCommand: ElseCommandSyntax;
    readonly statementsList: BaseStatementSyntax[];
}

export class IfStatementSyntax extends BaseStatementSyntax {
    public constructor(
        readonly ifPart: IfCondition,
        readonly elseIfParts: ElseIfCondition[],
        readonly elsePart: ElseCondition | undefined,
        readonly endIfCommand: EndIfCommandSyntax) {
        super();
    }

    public get kind(): StatementSyntaxKind {
        return StatementSyntaxKind.If;
    }
}

export class WhileStatementSyntax extends BaseStatementSyntax {
    public constructor(
        readonly whileCommand: WhileCommandSyntax,
        readonly statementsList: BaseStatementSyntax[],
        readonly endWhileCommand: EndWhileCommandSyntax) {
        super();
    }

    public get kind(): StatementSyntaxKind {
        return StatementSyntaxKind.While;
    }
}

export class ForStatementSyntax extends BaseStatementSyntax {
    public constructor(
        readonly forCommand: ForCommandSyntax,
        readonly statementsList: BaseStatementSyntax[],
        readonly endForCommand: EndForCommandSyntax) {
        super();
    }

    public get kind(): StatementSyntaxKind {
        return StatementSyntaxKind.For;
    }
}

export class LabelStatementSyntax extends BaseStatementSyntax {
    public constructor(
        readonly command: LabelCommandSyntax) {
        super();
    }

    public get kind(): StatementSyntaxKind {
        return StatementSyntaxKind.Label;
    }
}

export class GoToStatementSyntax extends BaseStatementSyntax {
    public constructor(
        readonly command: GoToCommandSyntax) {
        super();
    }

    public get kind(): StatementSyntaxKind {
        return StatementSyntaxKind.GoTo;
    }
}

export class ExpressionStatementSyntax extends BaseStatementSyntax {
    public constructor(
        readonly command: ExpressionCommandSyntax) {
        super();
    }

    public get kind(): StatementSyntaxKind {
        return StatementSyntaxKind.Expression;
    }
}
