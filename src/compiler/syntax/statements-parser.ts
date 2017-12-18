import { getCommandRange } from "./text-markers";
import { CommandSyntaxKindToString } from "../utils/string-factories";
import { ErrorCode, Diagnostic } from "../utils/diagnostics";
import {
    BaseStatementSyntax,
    ElseConditionPartStatementSyntax,
    ElseIfConditionPartStatementSyntax,
    ForStatementSyntax,
    IfStatementSyntax,
    StatementSyntaxFactory,
    SubModuleStatementSyntax,
    WhileStatementSyntax
} from "../models/syntax-statements";
import {
    BaseCommandSyntax,
    CommandSyntaxFactory,
    CommandSyntaxKind,
    ElseCommandSyntax,
    ElseIfCommandSyntax,
    EndForCommandSyntax,
    EndIfCommandSyntax,
    EndSubCommandSyntax,
    EndWhileCommandSyntax,
    ExpressionCommandSyntax,
    ForCommandSyntax,
    GoToCommandSyntax,
    IfCommandSyntax,
    LabelCommandSyntax,
    SubCommandSyntax,
    WhileCommandSyntax
} from "../models/syntax-commands";

export interface ParseTree {
    mainModule: BaseStatementSyntax[];
    subModules: SubModuleStatementSyntax[];
}

export class StatementsParser {
    private index: number = 0;

    public readonly parseTree: ParseTree = {
        mainModule: [],
        subModules: []
    };

    public constructor(private commands: BaseCommandSyntax[], private diagnostics: Diagnostic[]) {
        let startModuleCommand: SubCommandSyntax | undefined;
        let currentModuleStatements: BaseStatementSyntax[] = [];

        while (this.index < commands.length) {
            const current = commands[this.index];
            switch (current.kind) {
                case CommandSyntaxKind.Sub: {
                    if (startModuleCommand) {
                        this.eat(current.kind);
                        diagnostics.push(new Diagnostic(
                            ErrorCode.CannotDefineASubInsideAnotherSub,
                            getCommandRange(current)));
                    } else {
                        this.parseTree.mainModule.push(...currentModuleStatements);
                        currentModuleStatements = [];
                        startModuleCommand = this.eat(current.kind) as SubCommandSyntax;
                    }
                    break;
                }
                case CommandSyntaxKind.EndSub: {
                    if (startModuleCommand) {
                        const endModuleCommand = this.eat(current.kind);

                        this.parseTree.subModules.push(StatementSyntaxFactory.SubModule(
                            startModuleCommand,
                            currentModuleStatements,
                            endModuleCommand as EndSubCommandSyntax));

                        startModuleCommand = undefined;
                        currentModuleStatements = [];
                    } else {
                        this.eat(current.kind);
                        diagnostics.push(new Diagnostic(
                            ErrorCode.CannotHaveCommandWithoutPreviousCommand,
                            getCommandRange(current),
                            CommandSyntaxKindToString(CommandSyntaxKind.EndSub),
                            CommandSyntaxKindToString(CommandSyntaxKind.Sub)));
                    }
                    break;
                }
                default: {
                    const statement = this.parseStatement(current);
                    if (statement) {
                        currentModuleStatements.push(statement);
                    }
                    break;
                }
            }
        }

        if (startModuleCommand) {
            const endModuleCommand = this.eat(CommandSyntaxKind.EndSub);

            this.parseTree.subModules.push(StatementSyntaxFactory.SubModule(
                startModuleCommand,
                currentModuleStatements,
                endModuleCommand as EndSubCommandSyntax));
        } else {
            this.parseTree.mainModule.push(...currentModuleStatements);
        }
    }

    private parseStatement(current: BaseCommandSyntax): BaseStatementSyntax | undefined {
        switch (current.kind) {
            case CommandSyntaxKind.If: {
                return this.parseIfStatement();
            }
            case CommandSyntaxKind.Else:
            case CommandSyntaxKind.ElseIf:
            case CommandSyntaxKind.EndIf: {
                this.eat(current.kind);
                this.diagnostics.push(new Diagnostic(
                    ErrorCode.CannotHaveCommandWithoutPreviousCommand,
                    getCommandRange(current),
                    CommandSyntaxKindToString(current.kind),
                    CommandSyntaxKindToString(CommandSyntaxKind.If)));
                return;
            }
            case CommandSyntaxKind.For: {
                return this.parseForStatement();
            }
            case CommandSyntaxKind.EndFor: {
                this.eat(current.kind);
                this.diagnostics.push(new Diagnostic(
                    ErrorCode.CannotHaveCommandWithoutPreviousCommand,
                    getCommandRange(current),
                    CommandSyntaxKindToString(current.kind),
                    CommandSyntaxKindToString(CommandSyntaxKind.For)));
                return;
            }
            case CommandSyntaxKind.While: {
                return this.parseWhileStatement();
            }
            case CommandSyntaxKind.EndWhile: {
                this.eat(current.kind);
                this.diagnostics.push(new Diagnostic(
                    ErrorCode.CannotHaveCommandWithoutPreviousCommand,
                    getCommandRange(current),
                    CommandSyntaxKindToString(current.kind),
                    CommandSyntaxKindToString(CommandSyntaxKind.While)));
                return;
            }
            case CommandSyntaxKind.Label: {
                const statement = this.eat(CommandSyntaxKind.Label);
                return StatementSyntaxFactory.Label(statement as LabelCommandSyntax);
            }
            case CommandSyntaxKind.GoTo: {
                const statement = this.eat(CommandSyntaxKind.GoTo);
                return StatementSyntaxFactory.GoTo(statement as GoToCommandSyntax);
            }
            case CommandSyntaxKind.Expression: {
                const statement = this.eat(CommandSyntaxKind.Expression);
                return StatementSyntaxFactory.Expression(statement as ExpressionCommandSyntax);
            }
            default: {
                throw `Unexpected command ${CommandSyntaxKind[current.kind]} here`;
            }
        }
    }

    private parseIfStatement(): IfStatementSyntax {
        const ifCommand = this.eat(CommandSyntaxKind.If) as IfCommandSyntax;
        const ifPartStatements = this.parseStatementsExcept(
            CommandSyntaxKind.ElseIf,
            CommandSyntaxKind.Else,
            CommandSyntaxKind.EndIf);

        const ifPart = StatementSyntaxFactory.IfConditionPart(ifCommand, ifPartStatements);
        const elseIfParts: ElseIfConditionPartStatementSyntax[] = [];

        while (this.isNext(CommandSyntaxKind.ElseIf)) {
            const elseIfCommand = this.eat(CommandSyntaxKind.ElseIf) as ElseIfCommandSyntax;
            const statements = this.parseStatementsExcept(
                CommandSyntaxKind.ElseIf,
                CommandSyntaxKind.Else,
                CommandSyntaxKind.EndIf);

            elseIfParts.push(StatementSyntaxFactory.ElseIfConditionPart(elseIfCommand, statements));
        }

        let elsePart: ElseConditionPartStatementSyntax | undefined;
        if (this.isNext(CommandSyntaxKind.Else)) {
            const elseCommand = this.eat(CommandSyntaxKind.Else) as ElseCommandSyntax;
            const statements = this.parseStatementsExcept(
                CommandSyntaxKind.ElseIf,
                CommandSyntaxKind.Else,
                CommandSyntaxKind.EndIf);

            elsePart = StatementSyntaxFactory.ElseConditionPart(elseCommand, statements);
        }

        let endIfPart = this.eat(CommandSyntaxKind.EndIf) as EndIfCommandSyntax;
        return StatementSyntaxFactory.If(ifPart, elseIfParts, elsePart, endIfPart);
    }

    private parseForStatement(): ForStatementSyntax {
        const forCommand = this.eat(CommandSyntaxKind.For) as ForCommandSyntax;
        const statements = this.parseStatementsExcept(CommandSyntaxKind.EndFor);
        const endForCommand = this.eat(CommandSyntaxKind.EndFor) as EndForCommandSyntax;

        return StatementSyntaxFactory.For(forCommand, statements, endForCommand);
    }

    private parseWhileStatement(): WhileStatementSyntax {
        const whileCommand = this.eat(CommandSyntaxKind.While) as WhileCommandSyntax;
        const statements = this.parseStatementsExcept(CommandSyntaxKind.EndWhile);
        const endWhileCommand = this.eat(CommandSyntaxKind.EndWhile) as EndWhileCommandSyntax;

        return StatementSyntaxFactory.While(whileCommand, statements, endWhileCommand);
    }

    private parseStatementsExcept(...kinds: CommandSyntaxKind[]): BaseStatementSyntax[] {
        const statements: BaseStatementSyntax[] = [];

        let next: BaseCommandSyntax | undefined;
        while ((next = this.peek()) && !kinds.some(kind => kind === next!.kind)) {
            const statement = this.parseStatement(next);
            if (statement) {
                statements.push(statement);
            }
        }

        return statements;
    }

    private isNext(kind: CommandSyntaxKind): boolean {
        if (this.index < this.commands.length) {
            return this.commands[this.index].kind === kind;
        }
        return false;
    }

    private peek(): BaseCommandSyntax | undefined {
        if (this.index < this.commands.length) {
            return this.commands[this.index];
        }
        return;
    }

    private eat(kind: CommandSyntaxKind): BaseCommandSyntax {
        if (this.index < this.commands.length) {
            const current = this.commands[this.index];
            if (current.kind === kind) {
                this.index++;
                return current;
            }
            else {
                const range = getCommandRange(current);
                this.diagnostics.push(new Diagnostic(
                    ErrorCode.UnexpectedCommand_ExpectingCommand,
                    range,
                    CommandSyntaxKindToString(current.kind),
                    CommandSyntaxKindToString(kind)));
                return CommandSyntaxFactory.Missing(range, kind);
            }
        } else {
            const range = getCommandRange(this.commands[this.commands.length - 1]);
            this.diagnostics.push(new Diagnostic(
                ErrorCode.UnexpectedEOF_ExpectingCommand,
                range,
                CommandSyntaxKindToString(kind)));
            return CommandSyntaxFactory.Missing(range, kind);
        }
    }
}
