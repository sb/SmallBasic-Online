import { RuntimeLibraries } from "../runtime/libraries";
import { ExpressionBinder } from "./expression-binder";
import { ErrorCode, Diagnostic } from "../utils/diagnostics";
import { BaseBoundStatement, ArrayAccessBoundExpression, BaseBoundExpression, BoundKind, EqualBoundExpression, LibraryMethodInvocationBoundExpression, LibraryPropertyBoundExpression, SubModuleInvocationBoundExpression, VariableBoundExpression, ForBoundStatement, IfBoundStatement, WhileBoundStatement, LabelBoundStatement, GoToBoundStatement, InvalidExpressionBoundStatement, VariableAssignmentBoundStatement, ArrayAssignmentBoundStatement, PropertyAssignmentBoundStatement, LibraryMethodInvocationBoundStatement, SubModuleInvocationBoundStatement, IfHeaderBoundNode } from "./bound-nodes";
import { GoToCommandSyntax, BaseSyntaxNode, SyntaxKind, ForStatementSyntax, IfStatementSyntax, WhileStatementSyntax, LabelCommandSyntax, ExpressionCommandSyntax, IfCommandSyntax, ElseIfCommandSyntax, BaseStatementSyntax } from "../syntax/syntax-nodes";

export class StatementBinder {
    private _definedLabels: { [name: string]: boolean } = {};
    private _goToStatements: GoToCommandSyntax[] = [];

    public readonly result: ReadonlyArray<BaseBoundStatement<BaseStatementSyntax>>;

    public constructor(
        statements: ReadonlyArray<BaseSyntaxNode>,
        private _definedSubModules: { readonly [name: string]: boolean },
        private readonly _diagnostics: Diagnostic[]) {
        this.result = this.bindStatementsList(statements);

        this._goToStatements.forEach(statement => {
            const identifier = statement.labelToken;
            if (!this._definedLabels[identifier.token.text]) {
                this._diagnostics.push(new Diagnostic(ErrorCode.LabelDoesNotExist, identifier.range, identifier.token.text));
            }
        });
    }

    private bindStatementsList(list: ReadonlyArray<BaseSyntaxNode>): ReadonlyArray<BaseBoundStatement<BaseStatementSyntax>> {
        const boundList: BaseBoundStatement<BaseStatementSyntax>[] = [];
        list.forEach(statement => {
            if (statement.kind !== SyntaxKind.CommentCommand) {
                boundList.push(this.bindStatement(statement));
            }
        });
        return boundList;
    }

    private bindStatement(syntax: BaseStatementSyntax): BaseBoundStatement<BaseStatementSyntax> {
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

    private bindForStatement(syntax: ForStatementSyntax): ForBoundStatement {
        const identifier = syntax.forCommand.identifierToken.token.text;

        const fromExpression = this.bindExpression(syntax.forCommand.fromExpression, true);
        const toExpression = this.bindExpression(syntax.forCommand.toExpression, true);

        let stepExpression: BaseBoundExpression<BaseSyntaxNode> | undefined;
        if (syntax.forCommand.stepClauseOpt) {
            stepExpression = this.bindExpression(syntax.forCommand.stepClauseOpt.expression, true);
        }

        const statementsList = this.bindStatementsList(syntax.statementsList);

        return new ForBoundStatement(identifier, fromExpression, toExpression, stepExpression, statementsList, syntax);
    }

    private bindIfStatement(syntax: IfStatementSyntax): IfBoundStatement {
        const ifPart = new IfHeaderBoundNode<IfCommandSyntax>(
            this.bindExpression(syntax.ifPart.headerCommand.expression, true),
            this.bindStatementsList(syntax.ifPart.statementsList),
            syntax.ifPart);

        const elseIfParts = syntax.elseIfParts.map(elseIfPart => {
            return new IfHeaderBoundNode<ElseIfCommandSyntax>(
                this.bindExpression(elseIfPart.headerCommand.expression, true),
                this.bindStatementsList(elseIfPart.statementsList),
                elseIfPart);
        });

        let elsePart: ReadonlyArray<BaseBoundStatement<BaseStatementSyntax>> | undefined;
        if (syntax.elsePartOpt) {
            elsePart = this.bindStatementsList(syntax.elsePartOpt.statementsList);
        }

        return new IfBoundStatement(ifPart, elseIfParts, elsePart, syntax);
    }

    private bindWhileStatement(syntax: WhileStatementSyntax): WhileBoundStatement {
        const condition = this.bindExpression(syntax.whileCommand.expression, true);
        const statementsList = this.bindStatementsList(syntax.statementsList);

        return new WhileBoundStatement(condition, statementsList, syntax);
    }

    private bindLabelStatement(syntax: LabelCommandSyntax): LabelBoundStatement {
        const labelName = syntax.labelToken.token.text;
        this._definedLabels[labelName] = true;

        return new LabelBoundStatement(labelName, syntax);
    }

    private bindGoToStatement(syntax: GoToCommandSyntax): GoToBoundStatement {
        this._goToStatements.push(syntax);

        return new GoToBoundStatement(syntax.labelToken.token.text, syntax);
    }

    private bindExpressionStatement(syntax: ExpressionCommandSyntax): BaseBoundStatement<BaseStatementSyntax> {
        const expression = this.bindExpression(syntax.expression, false);

        if (expression.hasErrors) {
            return new InvalidExpressionBoundStatement(expression, syntax);
        }

        switch (expression.kind) {
            case BoundKind.EqualExpression: {
                const binaryExpression = expression as EqualBoundExpression;

                switch (binaryExpression.leftExpression.kind) {
                    case BoundKind.VariableExpression: {
                        const variable = binaryExpression.leftExpression as VariableBoundExpression;
                        return new VariableAssignmentBoundStatement(variable.variableName, binaryExpression.rightExpression, syntax);
                    }

                    case BoundKind.ArrayAccessExpression: {
                        const array = binaryExpression.leftExpression as ArrayAccessBoundExpression;
                        return new ArrayAssignmentBoundStatement(array.arrayName, array.indices, binaryExpression.rightExpression, syntax);
                    }

                    case BoundKind.LibraryPropertyExpression: {
                        const property = binaryExpression.leftExpression as LibraryPropertyBoundExpression;

                        if (!RuntimeLibraries.Metadata[property.libraryName].properties[property.propertyName].hasSetter) {
                            this._diagnostics.push(new Diagnostic(ErrorCode.PropertyHasNoSetter, property.syntax.range));
                        }

                        return new PropertyAssignmentBoundStatement(property.libraryName, property.propertyName, binaryExpression.rightExpression, syntax);
                    }

                    default: {
                        this._diagnostics.push(new Diagnostic(
                            ErrorCode.ValueIsNotAssignable,
                            binaryExpression.leftExpression.syntax.range));

                        return new InvalidExpressionBoundStatement(expression, syntax);
                    }
                }
            }

            case BoundKind.LibraryMethodInvocationExpression: {
                const call = expression as LibraryMethodInvocationBoundExpression;
                return new LibraryMethodInvocationBoundStatement(call.libraryName, call.methodName, call.argumentsList, syntax);
            }

            case BoundKind.SubModuleInvocationExpression: {
                const call = expression as SubModuleInvocationBoundExpression;
                return new SubModuleInvocationBoundStatement(call.subModuleName, syntax);
            }
        }

        const errorCode = expression.hasValue
            ? ErrorCode.UnassignedExpressionStatement
            : ErrorCode.InvalidExpressionStatement;

        this._diagnostics.push(new Diagnostic(errorCode, syntax.expression.range));
        return new InvalidExpressionBoundStatement(expression, syntax);
    }

    private bindExpression(syntax: BaseSyntaxNode, expectedValue: boolean): BaseBoundExpression<BaseStatementSyntax> {
        return new ExpressionBinder(syntax, expectedValue, this._definedSubModules, this._diagnostics).result;
    }
}
