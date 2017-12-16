import { SupportedLibraries } from "./supported-libraries";
import { ExpressionBinder } from "./expression-binder";
import { DefinedModulesMap, ModuleDefinition } from "./module-binder";
import { getExpressionRange } from "../syntax/text-markers";
import { Diagnostic } from "../utils/diagnostics";
import { ErrorCode } from "../utils/diagnostics";
import { BaseExpressionSyntax } from "../models/syntax-expressions";
import {
    BaseBoundStatement,
    BoundStatementFactory,
    ElseConditionPartBoundStatement,
    ForBoundStatement,
    GoToBoundStatement,
    IfBoundStatement,
    LabelBoundStatement,
    WhileBoundStatement
} from "../models/bound-statements";
import {
    BaseStatementSyntax,
    ExpressionStatementSyntax,
    ForStatementSyntax,
    GoToStatementSyntax,
    IfStatementSyntax,
    LabelStatementSyntax,
    StatementSyntaxKind,
    WhileStatementSyntax
} from "../models/syntax-statements";
import {
    ArrayAccessBoundExpression,
    BaseBoundExpression,
    BoundExpressionKind,
    EqualBoundExpression,
    LibraryMethodCallBoundExpression,
    LibraryPropertyBoundExpression,
    SubModuleCallBoundExpression,
    VariableBoundExpression
} from "../models/bound-expressions";

export class StatementBinder {
    private DefinedLabels: { [name: string]: boolean } = {};
    private goToStatements: GoToStatementSyntax[] = [];

    public readonly module: ModuleDefinition;

    public constructor(statements: BaseStatementSyntax[], private definedSubModules: DefinedModulesMap, private diagnostics: Diagnostic[]) {
        this.module = {
            statements: statements.map(statement => this.bindStatement(statement))
        };

        this.goToStatements.forEach(statement => {
            const identifier = statement.command.labelToken;
            if (!this.DefinedLabels[identifier.text]) {
                this.diagnostics.push(new Diagnostic(ErrorCode.Error_LabelDoesNotExist, identifier.range, identifier.text));
            }
        });
    }

    private bindStatement(syntax: BaseStatementSyntax): BaseBoundStatement {
        switch (syntax.kind) {
            case StatementSyntaxKind.For: return this.bindForStatement(syntax as ForStatementSyntax);
            case StatementSyntaxKind.If: return this.bindIfStatement(syntax as IfStatementSyntax);
            case StatementSyntaxKind.While: return this.bindWhileStatement(syntax as WhileStatementSyntax);
            case StatementSyntaxKind.Label: return this.bindLabelStatement(syntax as LabelStatementSyntax);
            case StatementSyntaxKind.GoTo: return this.bindGoToStatement(syntax as GoToStatementSyntax);
            case StatementSyntaxKind.Expression: return this.bindExpressionStatement(syntax as ExpressionStatementSyntax);

            case StatementSyntaxKind.IfConditionPart:
            case StatementSyntaxKind.ElseIfConditionPart:
            case StatementSyntaxKind.ElseConditionPart:
            case StatementSyntaxKind.SubModule:
                throw `Unexpected statement of kind ${StatementSyntaxKind[syntax.kind]} here`;
        }
    }

    private bindForStatement(syntax: ForStatementSyntax): ForBoundStatement {
        const identifier = syntax.forCommand.identifierToken.text;

        const fromExpression = this.bindExpression(syntax.forCommand.fromExpression, true);
        const toExpression = this.bindExpression(syntax.forCommand.toExpression, true);

        let stepExpression: BaseBoundExpression | undefined;
        if (syntax.forCommand.stepClause) {
            stepExpression = this.bindExpression(syntax.forCommand.stepClause.expression, true);
        }

        const statements = syntax.statementsList.map(statement => this.bindStatement(statement));

        return BoundStatementFactory.For(syntax, identifier, fromExpression, toExpression, stepExpression, statements);
    }

    private bindIfStatement(syntax: IfStatementSyntax): IfBoundStatement {
        const ifPart = BoundStatementFactory.IfConditionPart(
            syntax.ifPart,
            this.bindExpression(syntax.ifPart.headerCommand.expression, true),
            syntax.ifPart.statementsList.map(statement => this.bindStatement(statement)));

        const elseIfParts = syntax.elseIfParts.map(elseIfPart => BoundStatementFactory.ElseIfConditionPart(
            elseIfPart,
            this.bindExpression(elseIfPart.headerCommand.expression, true),
            elseIfPart.statementsList.map(statement => this.bindStatement(statement))));

        let elsePart: ElseConditionPartBoundStatement | undefined;
        if (syntax.elsePart) {
            const statements = syntax.elsePart.statementsList.map(statement => this.bindStatement(statement));
            elsePart = BoundStatementFactory.ElseConditionPart(syntax.elsePart, statements);
        }

        return BoundStatementFactory.If(syntax, ifPart, elseIfParts, elsePart);
    }

    private bindWhileStatement(syntax: WhileStatementSyntax): WhileBoundStatement {
        const condition = this.bindExpression(syntax.whileCommand.expression, true);
        const statements = syntax.statementsList.map(statement => this.bindStatement(statement));

        return BoundStatementFactory.While(syntax, condition, statements);
    }

    private bindLabelStatement(syntax: LabelStatementSyntax): LabelBoundStatement {
        const identifier = syntax.command.labelToken.text;
        this.DefinedLabels[identifier] = true;

        return BoundStatementFactory.Label(syntax, identifier);
    }

    private bindGoToStatement(syntax: GoToStatementSyntax): GoToBoundStatement {
        this.goToStatements.push(syntax);

        return BoundStatementFactory.GoTo(syntax, syntax.command.goToToken.text);
    }

    private bindExpressionStatement(syntax: ExpressionStatementSyntax): BaseBoundStatement {
        const boundExpression = this.bindExpression(syntax.command.expression, false);

        if (boundExpression.info.hasError) {
            return BoundStatementFactory.InvalidExpression(syntax, boundExpression);
        }

        switch (boundExpression.kind) {
            case BoundExpressionKind.Equal: {
                const binaryExpression = boundExpression as EqualBoundExpression;

                if (!binaryExpression.rightExpression.info.hasError && !binaryExpression.rightExpression.info.hasValue) {
                    this.diagnostics.push(new Diagnostic(
                        ErrorCode.Error_UnexpectedVoid_ExpectingValue,
                        getExpressionRange(binaryExpression.rightExpression.syntax)));
                }

                switch (binaryExpression.leftExpression.kind) {
                    case BoundExpressionKind.Variable: {
                        const variable = binaryExpression.leftExpression as VariableBoundExpression;
                        return BoundStatementFactory.VariableAssignment(syntax, variable.name, binaryExpression.rightExpression);
                    }

                    case BoundExpressionKind.ArrayAccess: {
                        const array = binaryExpression.leftExpression as ArrayAccessBoundExpression;
                        return BoundStatementFactory.ArrayAssignment(syntax, array.name, array.indices, binaryExpression.rightExpression);
                    }

                    case BoundExpressionKind.LibraryProperty: {
                        const property = binaryExpression.leftExpression as LibraryPropertyBoundExpression;

                        if (!SupportedLibraries[property.library].properties[property.name].hasSet) {
                            this.diagnostics.push(new Diagnostic(ErrorCode.Error_PropertyHasNoSetter, getExpressionRange(property.syntax)));
                        }

                        return BoundStatementFactory.PropertyAssignment(syntax, property.library, property.name, binaryExpression.rightExpression);
                    }

                    case BoundExpressionKind.Parenthesis:
                    case BoundExpressionKind.And:
                    case BoundExpressionKind.Or:
                    case BoundExpressionKind.Negation:
                    case BoundExpressionKind.Equal:
                    case BoundExpressionKind.NotEqual:
                    case BoundExpressionKind.Addition:
                    case BoundExpressionKind.Subtraction:
                    case BoundExpressionKind.Multiplication:
                    case BoundExpressionKind.Division:
                    case BoundExpressionKind.GreaterThan:
                    case BoundExpressionKind.GreaterThanOrEqual:
                    case BoundExpressionKind.LessThan:
                    case BoundExpressionKind.LessThanOrEqual:
                    case BoundExpressionKind.LibraryMethod:
                    case BoundExpressionKind.LibraryMethodCall:
                    case BoundExpressionKind.LibraryType:
                    case BoundExpressionKind.StringLiteral:
                    case BoundExpressionKind.NumberLiteral:
                    case BoundExpressionKind.SubModule:
                    case BoundExpressionKind.SubModuleCall: {
                        this.diagnostics.push(new Diagnostic(
                            ErrorCode.Error_ValueIsNotAssignable,
                            getExpressionRange(binaryExpression.leftExpression.syntax)));

                        return BoundStatementFactory.InvalidExpression(syntax, boundExpression);
                    }
                    default: {
                        throw `Unsupported bound expression of type ${BoundExpressionKind[binaryExpression.leftExpression.kind]}`;
                    }
                }
            }

            case BoundExpressionKind.LibraryMethodCall: {
                const call = boundExpression as LibraryMethodCallBoundExpression;
                return BoundStatementFactory.LibraryMethodCall(syntax, call.library, call.name, call.argumentsList);
            }

            case BoundExpressionKind.SubModuleCall: {
                const call = boundExpression as SubModuleCallBoundExpression;
                return BoundStatementFactory.SubModuleCall(syntax, call.name);
            }

            case BoundExpressionKind.Variable:
            case BoundExpressionKind.ArrayAccess:
            case BoundExpressionKind.LibraryProperty:
            case BoundExpressionKind.Parenthesis:
            case BoundExpressionKind.And:
            case BoundExpressionKind.Or:
            case BoundExpressionKind.Negation:
            case BoundExpressionKind.NotEqual:
            case BoundExpressionKind.Addition:
            case BoundExpressionKind.Subtraction:
            case BoundExpressionKind.Multiplication:
            case BoundExpressionKind.Division:
            case BoundExpressionKind.GreaterThan:
            case BoundExpressionKind.GreaterThanOrEqual:
            case BoundExpressionKind.LessThan:
            case BoundExpressionKind.LessThanOrEqual:
            case BoundExpressionKind.LibraryMethod:
            case BoundExpressionKind.LibraryType:
            case BoundExpressionKind.StringLiteral:
            case BoundExpressionKind.NumberLiteral:
            case BoundExpressionKind.SubModule: {
                this.diagnostics.push(new Diagnostic(ErrorCode.Error_InvalidExpressionStatement, getExpressionRange(syntax.command.expression)));
                return BoundStatementFactory.InvalidExpression(syntax, boundExpression);
            }
        }
    }

    private bindExpression(syntax: BaseExpressionSyntax, expectedValue: boolean): BaseBoundExpression {
        return new ExpressionBinder(syntax, this.definedSubModules, this.diagnostics, expectedValue).result;
    }
}
