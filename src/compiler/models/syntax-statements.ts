// This file is generated through a build task. Do not edit by hand.

import { SubCommandSyntax, EndSubCommandSyntax, EndIfCommandSyntax, IfCommandSyntax, ElseIfCommandSyntax, ElseCommandSyntax, WhileCommandSyntax, EndWhileCommandSyntax, ForCommandSyntax, EndForCommandSyntax, LabelCommandSyntax, GoToCommandSyntax, ExpressionCommandSyntax } from "./syntax-commands";

export enum StatementSyntaxKind {
    SubModule,
    If,
    IfConditionPart,
    ElseIfConditionPart,
    ElseConditionPart,
    While,
    For,
    Label,
    GoTo,
    Expression
}

export interface BaseStatementSyntax {
    readonly kind: StatementSyntaxKind;
}

export interface SubModuleStatementSyntax extends BaseStatementSyntax {
    readonly subCommand: SubCommandSyntax;
    readonly statementsList: BaseStatementSyntax[];
    readonly endSubCommand: EndSubCommandSyntax;
}

export interface IfStatementSyntax extends BaseStatementSyntax {
    readonly ifPart: IfConditionPartStatementSyntax;
    readonly elseIfParts: ElseIfConditionPartStatementSyntax[];
    readonly elsePart: ElseConditionPartStatementSyntax | undefined;
    readonly endIfCommand: EndIfCommandSyntax;
}

export interface IfConditionPartStatementSyntax extends BaseStatementSyntax {
    readonly headerCommand: IfCommandSyntax;
    readonly statementsList: BaseStatementSyntax[];
}

export interface ElseIfConditionPartStatementSyntax extends BaseStatementSyntax {
    readonly headerCommand: ElseIfCommandSyntax;
    readonly statementsList: BaseStatementSyntax[];
}

export interface ElseConditionPartStatementSyntax extends BaseStatementSyntax {
    readonly headerCommand: ElseCommandSyntax;
    readonly statementsList: BaseStatementSyntax[];
}

export interface WhileStatementSyntax extends BaseStatementSyntax {
    readonly whileCommand: WhileCommandSyntax;
    readonly statementsList: BaseStatementSyntax[];
    readonly endWhileCommand: EndWhileCommandSyntax;
}

export interface ForStatementSyntax extends BaseStatementSyntax {
    readonly forCommand: ForCommandSyntax;
    readonly statementsList: BaseStatementSyntax[];
    readonly endForCommand: EndForCommandSyntax;
}

export interface LabelStatementSyntax extends BaseStatementSyntax {
    readonly command: LabelCommandSyntax;
}

export interface GoToStatementSyntax extends BaseStatementSyntax {
    readonly command: GoToCommandSyntax;
}

export interface ExpressionStatementSyntax extends BaseStatementSyntax {
    readonly command: ExpressionCommandSyntax;
}

export class StatementSyntaxFactory {
    private constructor() {
    }

    public static SubModule(
        subCommand: SubCommandSyntax,
        statementsList: BaseStatementSyntax[],
        endSubCommand: EndSubCommandSyntax)
        : SubModuleStatementSyntax {
        return {
            kind: StatementSyntaxKind.SubModule,
            subCommand: subCommand,
            statementsList: statementsList,
            endSubCommand: endSubCommand
        };
    }

    public static If(
        ifPart: IfConditionPartStatementSyntax,
        elseIfParts: ElseIfConditionPartStatementSyntax[],
        elsePart: ElseConditionPartStatementSyntax | undefined,
        endIfCommand: EndIfCommandSyntax)
        : IfStatementSyntax {
        return {
            kind: StatementSyntaxKind.If,
            ifPart: ifPart,
            elseIfParts: elseIfParts,
            elsePart: elsePart,
            endIfCommand: endIfCommand
        };
    }

    public static IfConditionPart(
        headerCommand: IfCommandSyntax,
        statementsList: BaseStatementSyntax[])
        : IfConditionPartStatementSyntax {
        return {
            kind: StatementSyntaxKind.IfConditionPart,
            headerCommand: headerCommand,
            statementsList: statementsList
        };
    }

    public static ElseIfConditionPart(
        headerCommand: ElseIfCommandSyntax,
        statementsList: BaseStatementSyntax[])
        : ElseIfConditionPartStatementSyntax {
        return {
            kind: StatementSyntaxKind.ElseIfConditionPart,
            headerCommand: headerCommand,
            statementsList: statementsList
        };
    }

    public static ElseConditionPart(
        headerCommand: ElseCommandSyntax,
        statementsList: BaseStatementSyntax[])
        : ElseConditionPartStatementSyntax {
        return {
            kind: StatementSyntaxKind.ElseConditionPart,
            headerCommand: headerCommand,
            statementsList: statementsList
        };
    }

    public static While(
        whileCommand: WhileCommandSyntax,
        statementsList: BaseStatementSyntax[],
        endWhileCommand: EndWhileCommandSyntax)
        : WhileStatementSyntax {
        return {
            kind: StatementSyntaxKind.While,
            whileCommand: whileCommand,
            statementsList: statementsList,
            endWhileCommand: endWhileCommand
        };
    }

    public static For(
        forCommand: ForCommandSyntax,
        statementsList: BaseStatementSyntax[],
        endForCommand: EndForCommandSyntax)
        : ForStatementSyntax {
        return {
            kind: StatementSyntaxKind.For,
            forCommand: forCommand,
            statementsList: statementsList,
            endForCommand: endForCommand
        };
    }

    public static Label(
        command: LabelCommandSyntax)
        : LabelStatementSyntax {
        return {
            kind: StatementSyntaxKind.Label,
            command: command
        };
    }

    public static GoTo(
        command: GoToCommandSyntax)
        : GoToStatementSyntax {
        return {
            kind: StatementSyntaxKind.GoTo,
            command: command
        };
    }

    public static Expression(
        command: ExpressionCommandSyntax)
        : ExpressionStatementSyntax {
        return {
            kind: StatementSyntaxKind.Expression,
            command: command
        };
    }
}
