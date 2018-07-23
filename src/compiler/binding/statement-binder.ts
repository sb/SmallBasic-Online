import { RuntimeLibraries } from "../runtime/libraries";
import { ExpressionBinder } from "./expression-binder";
import { ErrorCode, Diagnostic } from "../utils/diagnostics";
import { BaseBoundStatement, BoundArrayAccessExpression, BaseBoundExpression, BoundKind, BoundEqualExpression, BoundLibraryMethodInvocationExpression, BoundLibraryPropertyExpression, BoundSubModuleInvocationExpression, BoundVariableExpression, BoundForStatement, BoundIfStatement, BoundWhileStatement, BoundLabelStatement, BoundGoToStatement, BoundInvalidExpressionStatement, BoundVariableAssignmentStatement, BoundArrayAssignmentStatement, BoundPropertyAssignmentStatement, BoundLibraryMethodInvocationStatement, BoundSubModuleInvocationStatement, BoundIfHeaderStatement, BoundStatementBlock } from "./bound-nodes";
import { GoToCommandSyntax, BaseSyntaxNode, SyntaxKind, ForStatementSyntax, IfStatementSyntax, WhileStatementSyntax, LabelCommandSyntax, ExpressionCommandSyntax, BaseStatementSyntax, StatementBlockSyntax } from "../syntax/syntax-nodes";
import { ProgramKind } from "../runtime/libraries-metadata";

export class StatementBinder {
    private _definedLabels: { [name: string]: boolean } = {};
    private _goToStatements: GoToCommandSyntax[] = [];

    public readonly result: BoundStatementBlock;

    public constructor(
        statements: StatementBlockSyntax,
        public programKind: ProgramKind,
        private _definedSubModules: { readonly [name: string]: boolean },
        private readonly _diagnostics: Diagnostic[]) {
        this.result = this.bindStatementsBlock(statements);

        this._goToStatements.forEach(statement => {
            const identifier = statement.labelToken;
            if (!this._definedLabels[identifier.token.text]) {
                this._diagnostics.push(new Diagnostic(ErrorCode.LabelDoesNotExist, identifier.range, identifier.token.text));
            }
        });
    }

    private bindStatementsBlock(block: StatementBlockSyntax): BoundStatementBlock {
        const result: BaseBoundStatement[] = [];

        block.statements.forEach(statement => {
            if (statement.kind !== SyntaxKind.CommentCommand) {
                result.push(this.bindStatement(statement));
            }
        });

        return new BoundStatementBlock(result, block);
    }

    private bindStatement(syntax: BaseStatementSyntax): BaseBoundStatement {
        switch (syntax.kind) {
            case SyntaxKind.ForStatement: return this.bindForStatement(syntax as ForStatementSyntax);
            case SyntaxKind.IfStatement: return this.bindIfStatement(syntax as IfStatementSyntax);
            case SyntaxKind.WhileStatement: return this.bindWhileStatement(syntax as WhileStatementSyntax);
            case SyntaxKind.LabelCommand: return this.bindLabelStatement(syntax as LabelCommandSyntax);
            case SyntaxKind.GoToCommand: return this.bindGoToStatement(syntax as GoToCommandSyntax);
            case SyntaxKind.ExpressionCommand: return this.bindExpressionStatement(syntax as ExpressionCommandSyntax);
            default: throw new Error(`Unexpected statement of kind ${SyntaxKind[syntax.kind]} here`);
        }
    }

    private bindForStatement(syntax: ForStatementSyntax): BoundForStatement {
        const identifier = syntax.forCommand.identifierToken.token.text;

        const fromExpression = this.bindExpression(syntax.forCommand.fromExpression, true);
        const toExpression = this.bindExpression(syntax.forCommand.toExpression, true);

        let stepExpression: BaseBoundExpression | undefined;
        if (syntax.forCommand.stepClauseOpt) {
            stepExpression = this.bindExpression(syntax.forCommand.stepClauseOpt.expression, true);
        }

        const statementsList = this.bindStatementsBlock(syntax.statementsList);

        return new BoundForStatement(identifier, fromExpression, toExpression, stepExpression, statementsList, syntax);
    }

    private bindIfStatement(syntax: IfStatementSyntax): BoundIfStatement {
        const ifPart = new BoundIfHeaderStatement(
            this.bindExpression(syntax.ifPart.headerCommand.expression, true),
            this.bindStatementsBlock(syntax.ifPart.statementsList),
            syntax.ifPart);

        const elseIfParts = syntax.elseIfParts.map(elseIfPart => {
            return new BoundIfHeaderStatement(
                this.bindExpression(elseIfPart.headerCommand.expression, true),
                this.bindStatementsBlock(elseIfPart.statementsList),
                elseIfPart);
        });

        let elsePart: BoundStatementBlock | undefined;
        if (syntax.elsePartOpt) {
            elsePart = this.bindStatementsBlock(syntax.elsePartOpt.statementsList);
        }

        return new BoundIfStatement(ifPart, elseIfParts, elsePart, syntax);
    }

    private bindWhileStatement(syntax: WhileStatementSyntax): BoundWhileStatement {
        const condition = this.bindExpression(syntax.whileCommand.expression, true);
        const statementsList = this.bindStatementsBlock(syntax.statementsList);

        return new BoundWhileStatement(condition, statementsList, syntax);
    }

    private bindLabelStatement(syntax: LabelCommandSyntax): BoundLabelStatement {
        const labelName = syntax.labelToken.token.text;
        this._definedLabels[labelName] = true;

        return new BoundLabelStatement(labelName, syntax);
    }

    private bindGoToStatement(syntax: GoToCommandSyntax): BoundGoToStatement {
        this._goToStatements.push(syntax);

        return new BoundGoToStatement(syntax.labelToken.token.text, syntax);
    }

    private bindExpressionStatement(syntax: ExpressionCommandSyntax): BaseBoundStatement {
        const expression = this.bindExpression(syntax.expression, false);

        if (expression.hasErrors) {
            return new BoundInvalidExpressionStatement(expression, syntax);
        }

        switch (expression.kind) {
            case BoundKind.EqualExpression: {
                const binaryExpression = expression as BoundEqualExpression;

                switch (binaryExpression.leftExpression.kind) {
                    case BoundKind.VariableExpression: {
                        const variable = binaryExpression.leftExpression as BoundVariableExpression;
                        return new BoundVariableAssignmentStatement(variable.variableName, binaryExpression.rightExpression, syntax);
                    }

                    case BoundKind.ArrayAccessExpression: {
                        const array = binaryExpression.leftExpression as BoundArrayAccessExpression;
                        return new BoundArrayAssignmentStatement(array.arrayName, array.indices, binaryExpression.rightExpression, syntax);
                    }

                    case BoundKind.LibraryPropertyExpression: {
                        const property = binaryExpression.leftExpression as BoundLibraryPropertyExpression;

                        if (!RuntimeLibraries.Metadata[property.libraryName].properties[property.propertyName].hasSetter) {
                            this._diagnostics.push(new Diagnostic(ErrorCode.PropertyHasNoSetter, property.syntax.range));
                        }

                        return new BoundPropertyAssignmentStatement(property.libraryName, property.propertyName, binaryExpression.rightExpression, syntax);
                    }

                    default: {
                        this._diagnostics.push(new Diagnostic(
                            ErrorCode.ValueIsNotAssignable,
                            binaryExpression.leftExpression.syntax.range));

                        return new BoundInvalidExpressionStatement(expression, syntax);
                    }
                }
            }

            case BoundKind.LibraryMethodInvocationExpression: {
                const call = expression as BoundLibraryMethodInvocationExpression;
                return new BoundLibraryMethodInvocationStatement(call.libraryName, call.methodName, call.argumentsList, syntax);
            }

            case BoundKind.SubModuleInvocationExpression: {
                const call = expression as BoundSubModuleInvocationExpression;
                return new BoundSubModuleInvocationStatement(call.subModuleName, syntax);
            }
        }

        const errorCode = expression.hasValue
            ? ErrorCode.UnassignedExpressionStatement
            : ErrorCode.InvalidExpressionStatement;

        this._diagnostics.push(new Diagnostic(errorCode, syntax.expression.range));
        return new BoundInvalidExpressionStatement(expression, syntax);
    }

    private bindExpression(syntax: BaseSyntaxNode, expectedValue: boolean): BaseBoundExpression {
        const binder = new ExpressionBinder(syntax, expectedValue, this.programKind, this._definedSubModules, this._diagnostics);
        this.programKind = binder.programKind;
        return binder.result;
    }
}
