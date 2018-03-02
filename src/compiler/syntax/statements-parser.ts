import { ErrorCode, Diagnostic } from "../diagnostics";
import {
    BaseStatementSyntax,
    ForStatementSyntax,
    IfStatementSyntax,
    SubModuleStatementSyntax,
    WhileStatementSyntax,
    LabelStatementSyntax,
    GoToStatementSyntax,
    ExpressionStatementSyntax,
    ElseIfCondition,
    IfCondition,
    ElseCondition
} from "./nodes/statements";
import {
    BaseCommandSyntax,
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
    WhileCommandSyntax,
    MissingCommandSyntax
} from "./nodes/commands";

export interface ParseTree {
    readonly mainModule: ReadonlyArray<BaseStatementSyntax>;
    readonly subModules: ReadonlyArray<SubModuleStatementSyntax>;
}

export class StatementsParser {
    private index: number = 0;

    private mainModule: BaseStatementSyntax[] = [];
    private subModules: SubModuleStatementSyntax[] = [];

    public get parseTree(): ParseTree {
        return {
            mainModule: this.mainModule,
            subModules: this.subModules
        };
    }

    public constructor(private commands: ReadonlyArray<BaseCommandSyntax>, private diagnostics: Diagnostic[]) {
        let startModuleCommand: SubCommandSyntax | undefined;
        let currentModuleStatements: BaseStatementSyntax[] = [];

        while (this.index < commands.length) {
            const current = commands[this.index];
            switch (current.kind) {
                case CommandSyntaxKind.Sub: {
                    if (startModuleCommand) {
                        this.eat(current.kind);
                        diagnostics.push(new Diagnostic(ErrorCode.CannotDefineASubInsideAnotherSub, current.range));
                    } else {
                        this.mainModule.push(...currentModuleStatements);
                        currentModuleStatements = [];
                        startModuleCommand = this.eat(current.kind) as SubCommandSyntax;
                    }
                    break;
                }
                case CommandSyntaxKind.EndSub: {
                    if (startModuleCommand) {
                        const endModuleCommand = this.eat(current.kind) as EndSubCommandSyntax;
                        this.subModules.push(new SubModuleStatementSyntax(startModuleCommand, currentModuleStatements, endModuleCommand));

                        startModuleCommand = undefined;
                        currentModuleStatements = [];
                    } else {
                        this.eat(current.kind);
                        diagnostics.push(new Diagnostic(
                            ErrorCode.CannotHaveCommandWithoutPreviousCommand,
                            current.range,
                            BaseCommandSyntax.toDisplayString(CommandSyntaxKind.EndSub),
                            BaseCommandSyntax.toDisplayString(CommandSyntaxKind.Sub)));
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

            this.subModules.push(new SubModuleStatementSyntax(
                startModuleCommand,
                currentModuleStatements,
                endModuleCommand as EndSubCommandSyntax));
        } else {
            this.mainModule.push(...currentModuleStatements);
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
                    current.range,
                    BaseCommandSyntax.toDisplayString(current.kind),
                    BaseCommandSyntax.toDisplayString(CommandSyntaxKind.If)));
                return;
            }
            case CommandSyntaxKind.For: {
                return this.parseForStatement();
            }
            case CommandSyntaxKind.EndFor: {
                this.eat(current.kind);
                this.diagnostics.push(new Diagnostic(
                    ErrorCode.CannotHaveCommandWithoutPreviousCommand,
                    current.range,
                    BaseCommandSyntax.toDisplayString(current.kind),
                    BaseCommandSyntax.toDisplayString(CommandSyntaxKind.For)));
                return;
            }
            case CommandSyntaxKind.While: {
                return this.parseWhileStatement();
            }
            case CommandSyntaxKind.EndWhile: {
                this.eat(current.kind);
                this.diagnostics.push(new Diagnostic(
                    ErrorCode.CannotHaveCommandWithoutPreviousCommand,
                    current.range,
                    BaseCommandSyntax.toDisplayString(current.kind),
                    BaseCommandSyntax.toDisplayString(CommandSyntaxKind.While)));
                return;
            }
            case CommandSyntaxKind.Label: {
                const statement = this.eat(CommandSyntaxKind.Label);
                return new LabelStatementSyntax(statement as LabelCommandSyntax);
            }
            case CommandSyntaxKind.GoTo: {
                const statement = this.eat(CommandSyntaxKind.GoTo);
                return new GoToStatementSyntax(statement as GoToCommandSyntax);
            }
            case CommandSyntaxKind.Expression: {
                const statement = this.eat(CommandSyntaxKind.Expression);
                return new ExpressionStatementSyntax(statement as ExpressionCommandSyntax);
            }
            default: {
                throw new Error(`Unexpected command ${CommandSyntaxKind[current.kind]} here`);
            }
        }
    }

    private parseIfStatement(): IfStatementSyntax {
        const ifCommand = this.eat(CommandSyntaxKind.If) as IfCommandSyntax;
        const ifPartStatements = this.parseStatementsExcept(
            CommandSyntaxKind.ElseIf,
            CommandSyntaxKind.Else,
            CommandSyntaxKind.EndIf);

        const ifPart: IfCondition = {
            headerCommand: ifCommand,
            statementsList: ifPartStatements
        };

        const elseIfParts: ElseIfCondition[] = [];

        while (this.isNext(CommandSyntaxKind.ElseIf)) {
            const elseIfCommand = this.eat(CommandSyntaxKind.ElseIf) as ElseIfCommandSyntax;
            const statements = this.parseStatementsExcept(
                CommandSyntaxKind.ElseIf,
                CommandSyntaxKind.Else,
                CommandSyntaxKind.EndIf);

            elseIfParts.push({
                headerCommand: elseIfCommand,
                statementsList: statements
            });
        }

        let elsePart: ElseCondition | undefined;
        if (this.isNext(CommandSyntaxKind.Else)) {
            const elseCommand = this.eat(CommandSyntaxKind.Else) as ElseCommandSyntax;
            const statements = this.parseStatementsExcept(
                CommandSyntaxKind.ElseIf,
                CommandSyntaxKind.Else,
                CommandSyntaxKind.EndIf);

            elsePart = {
                headerCommand: elseCommand,
                statementsList: statements
            };
        }

        let endIfPart = this.eat(CommandSyntaxKind.EndIf) as EndIfCommandSyntax;
        return new IfStatementSyntax(ifPart, elseIfParts, elsePart, endIfPart);
    }

    private parseForStatement(): ForStatementSyntax {
        const forCommand = this.eat(CommandSyntaxKind.For) as ForCommandSyntax;
        const statements = this.parseStatementsExcept(CommandSyntaxKind.EndFor);
        const endForCommand = this.eat(CommandSyntaxKind.EndFor) as EndForCommandSyntax;

        return new ForStatementSyntax(forCommand, statements, endForCommand);
    }

    private parseWhileStatement(): WhileStatementSyntax {
        const whileCommand = this.eat(CommandSyntaxKind.While) as WhileCommandSyntax;
        const statements = this.parseStatementsExcept(CommandSyntaxKind.EndWhile);
        const endWhileCommand = this.eat(CommandSyntaxKind.EndWhile) as EndWhileCommandSyntax;

        return new WhileStatementSyntax(whileCommand, statements, endWhileCommand);
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
                this.diagnostics.push(new Diagnostic(
                    ErrorCode.UnexpectedCommand_ExpectingCommand,
                    current.range,
                    BaseCommandSyntax.toDisplayString(current.kind),
                    BaseCommandSyntax.toDisplayString(kind)));
                return new MissingCommandSyntax(current.range, kind);
            }
        } else {
            const range = this.commands[this.commands.length - 1].range;
            this.diagnostics.push(new Diagnostic(
                ErrorCode.UnexpectedEOF_ExpectingCommand,
                range,
                BaseCommandSyntax.toDisplayString(kind)));
            return new MissingCommandSyntax(range, kind);
        }
    }
}
