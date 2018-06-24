import { ErrorCode, Diagnostic } from "../utils/diagnostics";
import {
    BaseSyntaxNode,
    SyntaxKind,
    ElseCommandSyntax,
    ElseIfCommandSyntax,
    EndForCommandSyntax,
    EndIfCommandSyntax,
    ForStatementSyntax,
    IfStatementSyntax,
    WhileStatementSyntax,
    EndWhileCommandSyntax,
    ForCommandSyntax,
    IfCommandSyntax,
    SubCommandSyntax,
    WhileCommandSyntax,
    MissingCommandSyntax,
    SubModuleDeclarationSyntax,
    ParseTreeSyntax,
    EndSubCommandSyntax,
    IfHeaderSyntax,
    BaseStatementSyntax
} from "./syntax-nodes";
import { CompilerUtils } from "../utils/compiler-utils";

export class StatementsParser {
    private _index: number = 0;

    private _mainModule: BaseStatementSyntax[] = [];
    private _subModules: SubModuleDeclarationSyntax[] = [];

    public get result(): ParseTreeSyntax {
        return new ParseTreeSyntax(this._mainModule, this._subModules);
    }

    public constructor(private readonly _commands: ReadonlyArray<BaseStatementSyntax>, private readonly _diagnostics: Diagnostic[]) {
        let startModuleCommand: SubCommandSyntax | undefined;
        let currentModuleStatements: BaseStatementSyntax[] = [];

        while (this._index < this._commands.length) {
            const current = this._commands[this._index];
            switch (current.kind) {
                case SyntaxKind.SubCommand: {
                    if (startModuleCommand) {
                        this.eat(current.kind);
                        this._diagnostics.push(new Diagnostic(ErrorCode.CannotDefineASubInsideAnotherSub, current.range));
                    } else {
                        this._mainModule.push(...currentModuleStatements);
                        currentModuleStatements = [];
                        startModuleCommand = this.eat(current.kind) as SubCommandSyntax;
                    }
                    break;
                }
                case SyntaxKind.EndSubCommand: {
                    if (startModuleCommand) {
                        const endModuleCommand = this.eat(current.kind) as EndSubCommandSyntax;
                        this._subModules.push(new SubModuleDeclarationSyntax(startModuleCommand, currentModuleStatements, endModuleCommand));

                        startModuleCommand = undefined;
                        currentModuleStatements = [];
                    } else {
                        this.eat(current.kind);
                        this._diagnostics.push(new Diagnostic(
                            ErrorCode.CannotHaveCommandWithoutPreviousCommand,
                            current.range,
                            CompilerUtils.commandToDisplayString(SyntaxKind.EndSubCommand),
                            CompilerUtils.commandToDisplayString(SyntaxKind.SubCommand)));
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
            const endModuleCommand = this.eat(SyntaxKind.EndSubCommand);

            this._subModules.push(new SubModuleDeclarationSyntax(
                startModuleCommand,
                currentModuleStatements,
                endModuleCommand as EndSubCommandSyntax));
        } else {
            this._mainModule.push(...currentModuleStatements);
        }
    }

    private parseStatement(current: BaseSyntaxNode): BaseSyntaxNode | undefined {
        switch (current.kind) {
            case SyntaxKind.IfCommand: {
                return this.parseIfStatement();
            }
            case SyntaxKind.ElseCommand:
            case SyntaxKind.ElseIfCommand:
            case SyntaxKind.EndIfCommand: {
                this.eat(current.kind);
                this._diagnostics.push(new Diagnostic(
                    ErrorCode.CannotHaveCommandWithoutPreviousCommand,
                    current.range,
                    CompilerUtils.commandToDisplayString(current.kind),
                    CompilerUtils.commandToDisplayString(SyntaxKind.IfCommand)));
                return;
            }
            case SyntaxKind.ForCommand: {
                return this.parseForStatement();
            }
            case SyntaxKind.EndForCommand: {
                this.eat(current.kind);
                this._diagnostics.push(new Diagnostic(
                    ErrorCode.CannotHaveCommandWithoutPreviousCommand,
                    current.range,
                    CompilerUtils.commandToDisplayString(current.kind),
                    CompilerUtils.commandToDisplayString(SyntaxKind.ForCommand)));
                return;
            }
            case SyntaxKind.WhileCommand: {
                return this.parseWhileStatement();
            }
            case SyntaxKind.EndWhileCommand: {
                this.eat(current.kind);
                this._diagnostics.push(new Diagnostic(
                    ErrorCode.CannotHaveCommandWithoutPreviousCommand,
                    current.range,
                    CompilerUtils.commandToDisplayString(current.kind),
                    CompilerUtils.commandToDisplayString(SyntaxKind.WhileCommand)));
                return;
            }
            case SyntaxKind.LabelCommand: {
                return this.eat(SyntaxKind.LabelCommand);
            }
            case SyntaxKind.GoToCommand: {
                return this.eat(SyntaxKind.GoToCommand);
            }
            case SyntaxKind.ExpressionCommand: {
                return this.eat(SyntaxKind.ExpressionCommand);
            }
            case SyntaxKind.CommentCommand: {
                return this.eat(SyntaxKind.CommentCommand);
            }
            default: {
                throw new Error(`Unexpected command ${SyntaxKind[current.kind]} here`);
            }
        }
    }

    private parseIfStatement(): IfStatementSyntax {
        const ifCommand = this.eat(SyntaxKind.IfCommand) as IfCommandSyntax;
        const ifPartStatements = this.parseStatementsExcept(
            SyntaxKind.ElseIfCommand,
            SyntaxKind.ElseCommand,
            SyntaxKind.EndIfCommand);

        const ifPart = new IfHeaderSyntax<IfCommandSyntax>(ifCommand, ifPartStatements);

        const elseIfParts: IfHeaderSyntax<ElseIfCommandSyntax>[] = [];

        while (this.isNext(SyntaxKind.ElseIfCommand)) {
            const elseIfCommand = this.eat(SyntaxKind.ElseIfCommand) as ElseIfCommandSyntax;
            const statements = this.parseStatementsExcept(
                SyntaxKind.ElseIfCommand,
                SyntaxKind.ElseCommand,
                SyntaxKind.EndIfCommand);

            elseIfParts.push(new IfHeaderSyntax(elseIfCommand, statements));
        }

        let elsePart: IfHeaderSyntax<ElseCommandSyntax> | undefined;
        if (this.isNext(SyntaxKind.ElseCommand)) {
            const elseCommand = this.eat(SyntaxKind.ElseCommand) as ElseCommandSyntax;
            const statements = this.parseStatementsExcept(
                SyntaxKind.ElseIfCommand,
                SyntaxKind.ElseCommand,
                SyntaxKind.EndIfCommand);

            elsePart = new IfHeaderSyntax(elseCommand, statements);
        }

        let endIfPart = this.eat(SyntaxKind.EndIfCommand) as EndIfCommandSyntax;
        return new IfStatementSyntax(ifPart, elseIfParts, elsePart, endIfPart);
    }

    private parseForStatement(): ForStatementSyntax {
        const forCommand = this.eat(SyntaxKind.ForCommand) as ForCommandSyntax;
        const statements = this.parseStatementsExcept(SyntaxKind.EndForCommand);
        const endForCommand = this.eat(SyntaxKind.EndForCommand) as EndForCommandSyntax;

        return new ForStatementSyntax(forCommand, statements, endForCommand);
    }

    private parseWhileStatement(): WhileStatementSyntax {
        const whileCommand = this.eat(SyntaxKind.WhileCommand) as WhileCommandSyntax;
        const statements = this.parseStatementsExcept(SyntaxKind.EndWhileCommand);
        const endWhileCommand = this.eat(SyntaxKind.EndWhileCommand) as EndWhileCommandSyntax;

        return new WhileStatementSyntax(whileCommand, statements, endWhileCommand);
    }

    private parseStatementsExcept(...kinds: SyntaxKind[]): BaseSyntaxNode[] {
        const statements: BaseSyntaxNode[] = [];

        let next: BaseSyntaxNode | undefined;
        while ((next = this.peek()) && !kinds.some(kind => kind === next!.kind)) {
            const statement = this.parseStatement(next);
            if (statement) {
                statements.push(statement);
            }
        }

        return statements;
    }

    private isNext(kind: SyntaxKind): boolean {
        if (this._index < this._commands.length) {
            return this._commands[this._index].kind === kind;
        }
        return false;
    }

    private peek(): BaseSyntaxNode | undefined {
        if (this._index < this._commands.length) {
            return this._commands[this._index];
        }
        return;
    }

    private eat(kind: SyntaxKind): BaseSyntaxNode {
        if (this._index < this._commands.length) {
            const current = this._commands[this._index];
            if (current.kind === kind) {
                this._index++;
                return current;
            }
            else {
                this._diagnostics.push(new Diagnostic(
                    ErrorCode.UnexpectedCommand_ExpectingCommand,
                    current.range,
                    CompilerUtils.commandToDisplayString(current.kind),
                    CompilerUtils.commandToDisplayString(kind)));
                return new MissingCommandSyntax(kind, current.range);
            }
        } else {
            const range = this._commands[this._commands.length - 1].range;
            this._diagnostics.push(new Diagnostic(
                ErrorCode.UnexpectedEOF_ExpectingCommand,
                range,
                CompilerUtils.commandToDisplayString(kind)));
            return new MissingCommandSyntax(kind, range);
        }
    }
}
