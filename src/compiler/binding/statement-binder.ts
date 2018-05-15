import { SupportedLibraries } from "../runtime/supported-libraries";
import { ExpressionBinder } from "./expression-binder";
import { ErrorCode, Diagnostic } from "../diagnostics";
import { BaseExpressionSyntax } from "../syntax/nodes/expressions";
import {
    BaseStatementSyntax,
    ExpressionStatementSyntax,
    ForStatementSyntax,
    GoToStatementSyntax,
    IfStatementSyntax,
    LabelStatementSyntax,
    StatementSyntaxKind,
    WhileStatementSyntax
} from "../syntax/nodes/statements";
import {
    ArrayAccessBoundExpression,
    BaseBoundExpression,
    BoundExpressionKind,
    EqualBoundExpression,
    LibraryMethodCallBoundExpression,
    LibraryPropertyBoundExpression,
    SubModuleCallBoundExpression,
    VariableBoundExpression
} from "./nodes/expressions";
import { BaseBoundStatement, ForBoundStatement, IfBoundStatement, ElseBoundCondition, WhileBoundStatement, LabelBoundStatement, GoToBoundStatement, InvalidExpressionBoundStatement, VariableAssignmentBoundStatement, ArrayAssignmentBoundStatement, PropertyAssignmentBoundStatement, LibraryMethodCallBoundStatement, SubModuleCallBoundStatement } from "./nodes/statements";

const libraries: SupportedLibraries = new SupportedLibraries();

export class StatementBinder {
    private _definedLabels: { [name: string]: boolean } = {};
    private _goToStatements: GoToStatementSyntax[] = [];
    private _diagnostics: Diagnostic[] = [];
    
    private _result: BaseBoundStatement<BaseStatementSyntax>[];

    public get result(): ReadonlyArray<BaseBoundStatement<BaseStatementSyntax>> {
        return this._result;
    }

    public get diagnostics(): ReadonlyArray<Diagnostic> {
        return this._diagnostics;
    }

    public constructor(
        statements: ReadonlyArray<BaseStatementSyntax>,
        private _definedSubModules: { readonly [name: string]: boolean }) {
        this._result = statements.map(statement => this.bindStatement(statement));

        this._goToStatements.forEach(statement => {
            const identifier = statement.command.labelToken;
            if (!this._definedLabels[identifier.text]) {
                this._diagnostics.push(new Diagnostic(ErrorCode.LabelDoesNotExist, identifier.range, identifier.text));
            }
        });
    }

    private bindStatement(syntax: BaseStatementSyntax): BaseBoundStatement<BaseStatementSyntax> {
        switch (syntax.kind) {
            case StatementSyntaxKind.For: return this.bindForStatement(syntax as ForStatementSyntax);
            case StatementSyntaxKind.If: return this.bindIfStatement(syntax as IfStatementSyntax);
            case StatementSyntaxKind.While: return this.bindWhileStatement(syntax as WhileStatementSyntax);
            case StatementSyntaxKind.Label: return this.bindLabelStatement(syntax as LabelStatementSyntax);
            case StatementSyntaxKind.GoTo: return this.bindGoToStatement(syntax as GoToStatementSyntax);
            case StatementSyntaxKind.Expression: return this.bindExpressionStatement(syntax as ExpressionStatementSyntax);
            default: throw new Error(`Unexpected statement of kind ${StatementSyntaxKind[syntax.kind]} here`);
        }
    }

    private bindForStatement(syntax: ForStatementSyntax): ForBoundStatement {
        const identifier = syntax.forCommand.identifierToken.text;

        const fromExpression = this.bindExpression(syntax.forCommand.fromExpression, true);
        const toExpression = this.bindExpression(syntax.forCommand.toExpression, true);

        let stepExpression: BaseBoundExpression<BaseExpressionSyntax> | undefined;
        if (syntax.forCommand.stepClause) {
            stepExpression = this.bindExpression(syntax.forCommand.stepClause.expression, true);
        }

        const statementsList = syntax.statementsList.map(statement => this.bindStatement(statement));

        return new ForBoundStatement(identifier, fromExpression, toExpression, stepExpression, statementsList, syntax);
    }

    private bindIfStatement(syntax: IfStatementSyntax): IfBoundStatement {
        const ifPart = {
            condition: this.bindExpression(syntax.ifPart.headerCommand.expression, true),
            statementsList: syntax.ifPart.statementsList.map(statement => this.bindStatement(statement))
        };

        const elseIfParts = syntax.elseIfParts.map(elseIfPart => {
            return {
                condition: this.bindExpression(elseIfPart.headerCommand.expression, true),
                statementsList: elseIfPart.statementsList.map(statement => this.bindStatement(statement))
            };
        });

        let elsePart: ElseBoundCondition | undefined;
        if (syntax.elsePart) {
            elsePart = {
                statementsList: syntax.elsePart.statementsList.map(statement => this.bindStatement(statement))
            };
        }

        return new IfBoundStatement(ifPart, elseIfParts, elsePart, syntax);
    }

    private bindWhileStatement(syntax: WhileStatementSyntax): WhileBoundStatement {
        const condition = this.bindExpression(syntax.whileCommand.expression, true);
        const statementsList = syntax.statementsList.map(statement => this.bindStatement(statement));

        return new WhileBoundStatement(condition, statementsList, syntax);
    }

    private bindLabelStatement(syntax: LabelStatementSyntax): LabelBoundStatement {
        const labelName = syntax.command.labelToken.text;
        this._definedLabels[labelName] = true;

        return new LabelBoundStatement(labelName, syntax);
    }

    private bindGoToStatement(syntax: GoToStatementSyntax): GoToBoundStatement {
        this._goToStatements.push(syntax);

        return new GoToBoundStatement(syntax.command.labelToken.text, syntax);
    }

    private bindExpressionStatement(syntax: ExpressionStatementSyntax): BaseBoundStatement<BaseStatementSyntax> {
        const expression = this.bindExpression(syntax.command.expression, false);

        if (expression.hasErrors) {
            return new InvalidExpressionBoundStatement(expression, syntax);
        }

        switch (expression.kind) {
            case BoundExpressionKind.Equal: {
                const binaryExpression = expression as EqualBoundExpression;

                switch (binaryExpression.leftExpression.kind) {
                    case BoundExpressionKind.Variable: {
                        const variable = binaryExpression.leftExpression as VariableBoundExpression;
                        return new VariableAssignmentBoundStatement(variable.variableName, binaryExpression.rightExpression, syntax);
                    }

                    case BoundExpressionKind.ArrayAccess: {
                        const array = binaryExpression.leftExpression as ArrayAccessBoundExpression;
                        return new ArrayAssignmentBoundStatement(array.arrayName, array.indices, binaryExpression.rightExpression, syntax);
                    }

                    case BoundExpressionKind.LibraryProperty: {
                        const property = binaryExpression.leftExpression as LibraryPropertyBoundExpression;

                        if (!libraries[property.libraryName].properties[property.propertyName].setter) {
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

            case BoundExpressionKind.LibraryMethodCall: {
                const call = expression as LibraryMethodCallBoundExpression;
                return new LibraryMethodCallBoundStatement(call.libraryName, call.MethodName, call.argumentsList, syntax);
            }

            case BoundExpressionKind.SubModuleCall: {
                const call = expression as SubModuleCallBoundExpression;
                return new SubModuleCallBoundStatement(call.subModuleName, syntax);
            }
        }

        const errorCode = expression.hasValue
            ? ErrorCode.UnassignedExpressionStatement
            : ErrorCode.InvalidExpressionStatement;

        this._diagnostics.push(new Diagnostic(errorCode, syntax.command.expression.range));
        return new InvalidExpressionBoundStatement(expression, syntax);
    }

    private bindExpression(syntax: BaseExpressionSyntax, expectedValue: boolean): BaseBoundExpression<BaseExpressionSyntax> {
        const binder = new ExpressionBinder(syntax, expectedValue, this._definedSubModules);
        this._diagnostics.push.apply(this._diagnostics, binder.diagnostics);
        return binder.result;
    }
}
