import { SupportedLibraries } from "./supported-libraries";
import { getExpressionRange } from "../syntax/text-markers";
import { DefinedModulesMap } from "./module-binder";
import { Diagnostic, ErrorCode } from "../utils/diagnostics";
import {
    ArrayAccessBoundExpression,
    BaseBoundExpression,
    BoundExpressionFactory,
    BoundExpressionKind,
    LibraryMethodBoundExpression,
    LibraryTypeBoundExpression,
    NegationBoundExpression,
    SubModuleBoundExpression,
    VariableBoundExpression
} from "../models/bound-expressions";
import {
    ArrayAccessExpressionSyntax,
    BaseExpressionSyntax,
    BinaryOperatorExpressionSyntax,
    CallExpressionSyntax,
    ExpressionSyntaxKind,
    NumberLiteralExpressionSyntax,
    ObjectAccessExpressionSyntax,
    ParenthesisExpressionSyntax,
    StringLiteralExpressionSyntax,
    UnaryOperatorExpressionSyntax,
    IdentifierExpressionSyntax,
    MissingExpressionSyntax
} from "../models/syntax-expressions";
import { TokenKind } from "../syntax/tokens";

export interface ExpressionInfo {
    hasError: boolean;
    hasValue: boolean;
}

export class ExpressionBinder {
    public readonly result: BaseBoundExpression;

    public constructor(syntax: BaseExpressionSyntax, private definedSubModules: DefinedModulesMap, private diagnostics: Diagnostic[], expectedValue: boolean) {
        this.result = this.bindExpression(syntax);

        if (expectedValue && !this.result.info.hasValue) {
            this.reportError(this.result, ErrorCode.UnexpectedVoid_ExpectingValue);
            this.result.info.hasError = true;
        }
    }

    private bindExpression(syntax: BaseExpressionSyntax): BaseBoundExpression {
        switch (syntax.kind) {
            case ExpressionSyntaxKind.ArrayAccess: return this.bindArrayAccess(syntax as ArrayAccessExpressionSyntax);
            case ExpressionSyntaxKind.BinaryOperator: return this.bindBinaryOperator(syntax as BinaryOperatorExpressionSyntax);
            case ExpressionSyntaxKind.Call: return this.bindCall(syntax as CallExpressionSyntax);
            case ExpressionSyntaxKind.ObjectAccess: return this.bindObjectAccess(syntax as ObjectAccessExpressionSyntax);
            case ExpressionSyntaxKind.Parenthesis: return this.bindParenthesis(syntax as ParenthesisExpressionSyntax);
            case ExpressionSyntaxKind.NumberLiteral: return this.bindNumberLiteral(syntax as NumberLiteralExpressionSyntax);
            case ExpressionSyntaxKind.StringLiteral: return this.bindStringLiteral(syntax as StringLiteralExpressionSyntax);
            case ExpressionSyntaxKind.Identifier: return this.bindIdentifier(syntax as IdentifierExpressionSyntax);
            case ExpressionSyntaxKind.UnaryOperator: return this.bindUnaryOperator(syntax as UnaryOperatorExpressionSyntax);
            case ExpressionSyntaxKind.Missing: return this.bindMissing(syntax as MissingExpressionSyntax);
        }
    }

    private bindArrayAccess(syntax: ArrayAccessExpressionSyntax): ArrayAccessBoundExpression {
        const baseExpression = this.bindExpression(syntax.baseExpression);
        const indexExpression = this.bindExpression(syntax.indexExpression);
        let hasError = baseExpression.info.hasError || indexExpression.info.hasError;

        if (!indexExpression.info.hasValue) {
            hasError = true;
            this.reportError(indexExpression, ErrorCode.UnexpectedVoid_ExpectingValue);
        }

        let name: string;
        let indices: BaseBoundExpression[];

        switch (baseExpression.kind) {
            case BoundExpressionKind.ArrayAccess: {
                const arrayAccess = baseExpression as ArrayAccessBoundExpression;
                name = arrayAccess.name;
                indices = [...(arrayAccess).indices, indexExpression];
                break;
            }
            case BoundExpressionKind.Variable: {
                name = (indexExpression as VariableBoundExpression).name;
                indices = [indexExpression];
                break;
            }
            default: {
                hasError = true;
                this.reportError(baseExpression, ErrorCode.UnsupportedArrayBaseExpression);
                name = "";
                indices = [indexExpression];
                break;
            }
        }

        return BoundExpressionFactory.ArrayAccess(syntax, { hasError: hasError, hasValue: true }, name, indices);
    }

    private bindCall(syntax: CallExpressionSyntax): BaseBoundExpression {
        const baseExpression = this.bindExpression(syntax.baseExpression);
        const argumentsList = syntax.argumentsList.map(arg => this.bindExpression(arg));

        let hasError = baseExpression.info.hasError;

        argumentsList.forEach(arg => {
            if (arg.info.hasError) {
                hasError = true;
            }

            if (!arg.info.hasValue) {
                hasError = true;
                this.reportError(arg, ErrorCode.UnexpectedVoid_ExpectingValue);
            }
        });

        switch (baseExpression.kind) {
            case BoundExpressionKind.LibraryMethod: {
                const method = baseExpression as LibraryMethodBoundExpression;
                const definition = SupportedLibraries[method.library].methods[method.name];

                if (argumentsList.length !== definition.argumentsCount) {
                    hasError = true;
                    this.reportError(baseExpression, ErrorCode.UnexpectedArgumentsCount, definition.argumentsCount.toString(), argumentsList.length.toString());
                }

                return BoundExpressionFactory.LibraryMethodCall(
                    syntax,
                    { hasError: hasError, hasValue: definition.returnsValue },
                    method.library,
                    method.name,
                    argumentsList);
            }
            case BoundExpressionKind.SubModule: {
                if (argumentsList.length !== 0) {
                    hasError = true;
                    this.reportError(baseExpression, ErrorCode.UnexpectedArgumentsCount, "0", argumentsList.length.toString());
                }

                const name = (baseExpression as SubModuleBoundExpression).name;
                return BoundExpressionFactory.SubModuleCall(syntax, { hasError: hasError, hasValue: false }, name);
            }
            default: {
                hasError = true;
                this.reportError(baseExpression, ErrorCode.UnsupportedCallBaseExpression);
                return BoundExpressionFactory.LibraryMethodCall(syntax, { hasError: hasError, hasValue: true }, "", "", argumentsList);
            }
        }
    }

    private bindObjectAccess(syntax: ObjectAccessExpressionSyntax): BaseBoundExpression {
        const leftHandSide = this.bindExpression(syntax.baseExpression);
        const rightHandSide = syntax.identifierToken.text;
        let hasError = leftHandSide.info.hasError;

        if (leftHandSide.kind !== BoundExpressionKind.LibraryType) {
            hasError = true;
            this.reportError(leftHandSide, ErrorCode.UnsupportedDotBaseExpression);
            return BoundExpressionFactory.LibraryProperty(syntax, { hasError: hasError, hasValue: true }, "", rightHandSide);
        }

        const libraryType = leftHandSide as LibraryTypeBoundExpression;
        const propertyInfo = SupportedLibraries[libraryType.library].properties[rightHandSide];

        if (propertyInfo) {
            return BoundExpressionFactory.LibraryProperty(syntax, { hasError: hasError, hasValue: true }, libraryType.library, rightHandSide);
        }

        const methodInfo = SupportedLibraries[libraryType.library].methods[rightHandSide];
        if (methodInfo) {
            return BoundExpressionFactory.LibraryMethod(syntax, { hasError: hasError, hasValue: false }, libraryType.library, rightHandSide);
        }

        hasError = true;
        this.reportError(leftHandSide, ErrorCode.LibraryMemberNotFound, libraryType.library, rightHandSide);
        return BoundExpressionFactory.LibraryProperty(syntax, { hasError: hasError, hasValue: true }, libraryType.library, rightHandSide);
    }

    private bindParenthesis(syntax: ParenthesisExpressionSyntax): BaseBoundExpression {
        const expression = this.bindExpression(syntax.expression);
        return BoundExpressionFactory.Parenthesis(syntax, expression.info, expression);
    }

    private bindNumberLiteral(syntax: NumberLiteralExpressionSyntax): BaseBoundExpression {
        return BoundExpressionFactory.NumberLiteral(syntax, { hasError: false, hasValue: true }, syntax.value);
    }

    private bindStringLiteral(syntax: StringLiteralExpressionSyntax): BaseBoundExpression {
        return BoundExpressionFactory.StringLiteral(syntax, { hasError: false, hasValue: true }, syntax.value);
    }

    private bindIdentifier(syntax: IdentifierExpressionSyntax): BaseBoundExpression {
        if (SupportedLibraries[syntax.name]) {
            return BoundExpressionFactory.LibraryType(syntax, { hasError: false, hasValue: false }, syntax.name);
        } else if (this.definedSubModules[syntax.name]) {
            return BoundExpressionFactory.SubModule(syntax, { hasError: false, hasValue: false }, syntax.name);
        } else {
            return BoundExpressionFactory.Variable(syntax, { hasError: false, hasValue: true }, syntax.name);
        }
    }

    private bindMissing(syntax: MissingExpressionSyntax): BaseBoundExpression {
        return BoundExpressionFactory.Variable(syntax, { hasError: true, hasValue: true }, "<Missing>");
    }

    private bindUnaryOperator(syntax: UnaryOperatorExpressionSyntax): NegationBoundExpression {
        const expression = this.bindExpression(syntax.expression);
        let hasError = expression.info.hasError;

        if (!expression.info.hasValue) {
            hasError = true;
            this.reportError(expression, ErrorCode.UnexpectedVoid_ExpectingValue);
        }

        switch (syntax.operatorToken.kind) {
            case TokenKind.Minus: {
                return BoundExpressionFactory.Negation(syntax, { hasError: hasError, hasValue: true }, expression);
            }
            default: {
                throw `Unsupported token kind: ${TokenKind[syntax.operatorToken.kind]}`;
            }
        }
    }

    private bindBinaryOperator(syntax: BinaryOperatorExpressionSyntax): BaseBoundExpression {
        const leftHandSide = this.bindExpression(syntax.leftExpression);
        const rightHandSide = this.bindExpression(syntax.rightExpression);

        let hasError = leftHandSide.info.hasError || rightHandSide.info.hasError;

        if (!leftHandSide.info.hasValue) {
            hasError = true;
            this.reportError(leftHandSide, ErrorCode.UnexpectedVoid_ExpectingValue);
        }

        if (!rightHandSide.info.hasValue) {
            hasError = true;
            this.reportError(rightHandSide, ErrorCode.UnexpectedVoid_ExpectingValue);
        }

        const info = { hasError: hasError, hasValue: true };
        switch (syntax.operatorToken.kind) {
            case TokenKind.Or: return BoundExpressionFactory.Or(syntax, info, leftHandSide, rightHandSide);
            case TokenKind.And: return BoundExpressionFactory.And(syntax, info, leftHandSide, rightHandSide);
            case TokenKind.NotEqual: return BoundExpressionFactory.NotEqual(syntax, info, leftHandSide, rightHandSide);
            case TokenKind.Equal: return BoundExpressionFactory.Equal(syntax, info, leftHandSide, rightHandSide);
            case TokenKind.LessThan: return BoundExpressionFactory.LessThan(syntax, info, leftHandSide, rightHandSide);
            case TokenKind.GreaterThan: return BoundExpressionFactory.GreaterThan(syntax, info, leftHandSide, rightHandSide);
            case TokenKind.LessThanOrEqual: return BoundExpressionFactory.LessThanOrEqual(syntax, info, leftHandSide, rightHandSide);
            case TokenKind.GreaterThanOrEqual: return BoundExpressionFactory.GreaterThanOrEqual(syntax, info, leftHandSide, rightHandSide);
            case TokenKind.Plus: return BoundExpressionFactory.Addition(syntax, info, leftHandSide, rightHandSide);
            case TokenKind.Minus: return BoundExpressionFactory.Subtraction(syntax, info, leftHandSide, rightHandSide);
            case TokenKind.Multiply: return BoundExpressionFactory.Multiplication(syntax, info, leftHandSide, rightHandSide);
            case TokenKind.Divide: return BoundExpressionFactory.Division(syntax, info, leftHandSide, rightHandSide);
            default: throw `Unexpected token kind ${TokenKind[syntax.operatorToken.kind]}`;
        }
    }

    private reportError(expression: BaseBoundExpression, code: ErrorCode, ...args: string[]): void {
        if (!expression.info.hasError) {
            this.diagnostics.push(new Diagnostic(code, getExpressionRange(expression.syntax), ...args));
        }
    }
}
