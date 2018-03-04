import { SupportedLibraries } from "../runtime/supported-libraries";
import { Diagnostic, ErrorCode } from "../diagnostics";
import {
    ArrayAccessBoundExpression,
    BaseBoundExpression,
    BoundExpressionKind,
    LibraryMethodBoundExpression,
    LibraryTypeBoundExpression,
    NegationBoundExpression,
    SubModuleBoundExpression,
    VariableBoundExpression,
    LibraryMethodCallBoundExpression,
    SubModuleCallBoundExpression,
    LibraryPropertyBoundExpression,
    ParenthesisBoundExpression,
    NumberLiteralBoundExpression,
    StringLiteralBoundExpression,
    OrBoundExpression,
    AndBoundExpression,
    NotEqualBoundExpression,
    EqualBoundExpression,
    LessThanBoundExpression,
    GreaterThanBoundExpression,
    GreaterThanOrEqualBoundExpression,
    LessThanOrEqualBoundExpression,
    AdditionBoundExpression,
    SubtractionBoundExpression,
    MultiplicationBoundExpression,
    DivisionBoundExpression
} from "./nodes/expressions";
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
    IdentifierExpressionSyntax
} from "../syntax/nodes/expressions";
import { TokenKind } from "../syntax/nodes/tokens";

const libraries: SupportedLibraries = new SupportedLibraries();

export class ExpressionBinder {
    public readonly result: BaseBoundExpression<BaseExpressionSyntax>;

    public constructor(
        syntax: BaseExpressionSyntax,
        expectedValue: boolean,
        private readonly definedSubModules: { readonly [name: string]: boolean },
        private readonly diagnostics: Diagnostic[]) {

        this.result = this.bindExpression(syntax, expectedValue);
    }

    private bindExpression(syntax: BaseExpressionSyntax, expectedValue: boolean): BaseBoundExpression<BaseExpressionSyntax> {
        let expression: BaseBoundExpression<BaseExpressionSyntax>;

        switch (syntax.kind) {
            case ExpressionSyntaxKind.ArrayAccess: expression = this.bindArrayAccess(syntax as ArrayAccessExpressionSyntax); break;
            case ExpressionSyntaxKind.BinaryOperator: expression = this.bindBinaryOperator(syntax as BinaryOperatorExpressionSyntax); break;
            case ExpressionSyntaxKind.Call: expression = this.bindCall(syntax as CallExpressionSyntax, expectedValue); break;
            case ExpressionSyntaxKind.ObjectAccess: expression = this.bindObjectAccess(syntax as ObjectAccessExpressionSyntax, expectedValue); break;
            case ExpressionSyntaxKind.Parenthesis: expression = this.bindParenthesis(syntax as ParenthesisExpressionSyntax); break;
            case ExpressionSyntaxKind.NumberLiteral: expression = this.bindNumberLiteral(syntax as NumberLiteralExpressionSyntax); break;
            case ExpressionSyntaxKind.StringLiteral: expression = this.bindStringLiteral(syntax as StringLiteralExpressionSyntax); break;
            case ExpressionSyntaxKind.Identifier: expression = this.bindIdentifier(syntax as IdentifierExpressionSyntax, expectedValue); break;
            case ExpressionSyntaxKind.UnaryOperator: expression = this.bindUnaryOperator(syntax as UnaryOperatorExpressionSyntax); break;
            default: throw new Error(`Invalid syntax kind: ${ExpressionSyntaxKind[syntax.kind]}`);
        }

        return expression;
    }

    private bindArrayAccess(syntax: ArrayAccessExpressionSyntax): ArrayAccessBoundExpression {
        const baseExpression = this.bindExpression(syntax.baseExpression, true);
        const indexExpression = this.bindExpression(syntax.indexExpression, true);

        let arrayName: string;
        let indices: BaseBoundExpression<BaseExpressionSyntax>[];
        let hasErrors = baseExpression.hasErrors || indexExpression.hasErrors;

        switch (baseExpression.kind) {
            case BoundExpressionKind.ArrayAccess: {
                const arrayAccess = baseExpression as ArrayAccessBoundExpression;
                arrayName = arrayAccess.arrayName;
                indices = [...(arrayAccess).indices, indexExpression];
                break;
            }
            case BoundExpressionKind.Variable: {
                arrayName = (baseExpression as VariableBoundExpression).variableName;
                indices = [indexExpression];
                break;
            }
            default: {
                if (!hasErrors) {
                    hasErrors = true;
                    this.diagnostics.push(new Diagnostic(ErrorCode.UnsupportedArrayBaseExpression, baseExpression.syntax.range));
                }

                arrayName = "<array>";
                indices = [indexExpression];
                break;
            }
        }

        return new ArrayAccessBoundExpression(arrayName, indices, hasErrors, syntax);
    }

    private bindCall(syntax: CallExpressionSyntax, expectedValue: boolean): BaseBoundExpression<BaseExpressionSyntax> {
        const baseExpression = this.bindExpression(syntax.baseExpression, false);
        const argumentsList = syntax.argumentsList.map(arg => this.bindExpression(arg, true));

        let hasErrors = baseExpression.hasErrors || argumentsList.some(arg => arg.hasErrors);

        switch (baseExpression.kind) {
            case BoundExpressionKind.LibraryMethod: {
                const method = baseExpression as LibraryMethodBoundExpression;
                const definition = libraries[method.libraryName].methods[method.methodName];
                const parametersCount = Object.keys(definition.parameters).length;

                if (argumentsList.length !== parametersCount) {
                    hasErrors = true;
                    this.diagnostics.push(new Diagnostic(ErrorCode.UnexpectedArgumentsCount, baseExpression.syntax.range, parametersCount.toString(), argumentsList.length.toString()));
                }
                else if (expectedValue && !definition.returnsValue) {
                    hasErrors = true;
                    this.diagnostics.push(new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, syntax.range));
                }

                return new LibraryMethodCallBoundExpression(method.libraryName, method.methodName, argumentsList, definition.returnsValue, hasErrors, syntax);
            }
            case BoundExpressionKind.SubModule: {
                if (argumentsList.length !== 0) {
                    hasErrors = true;
                    this.diagnostics.push(new Diagnostic(ErrorCode.UnexpectedArgumentsCount, baseExpression.syntax.range, "0", argumentsList.length.toString()));
                } else if (expectedValue) {
                    hasErrors = true;
                    this.diagnostics.push(new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, syntax.range));
                }

                const subModule = baseExpression as SubModuleBoundExpression;
                return new SubModuleCallBoundExpression(subModule.subModuleName, hasErrors, syntax);
            }
            default: {
                hasErrors = true;
                this.diagnostics.push(new Diagnostic(ErrorCode.UnsupportedCallBaseExpression, baseExpression.syntax.range));
                return new LibraryMethodCallBoundExpression("<library>", "<method>", argumentsList, true, hasErrors, syntax);
            }
        }
    }

    private bindObjectAccess(syntax: ObjectAccessExpressionSyntax, expectedValue: boolean): BaseBoundExpression<BaseExpressionSyntax> {
        const leftHandSide = this.bindExpression(syntax.baseExpression, false);
        const rightHandSide = syntax.identifierToken.text;
        let hasErrors = leftHandSide.hasErrors;

        if (leftHandSide.kind !== BoundExpressionKind.LibraryType) {
            hasErrors = true;
            this.diagnostics.push(new Diagnostic(ErrorCode.UnsupportedDotBaseExpression, leftHandSide.syntax.range));
            return new LibraryPropertyBoundExpression("<library>", rightHandSide, true, hasErrors, syntax);
        }

        const libraryType = leftHandSide as LibraryTypeBoundExpression;
        const propertyInfo = libraries[libraryType.libraryName].properties[rightHandSide];

        if (propertyInfo) {
            const hasValue = !!propertyInfo.getter;
            if (expectedValue && !hasValue) {
                hasErrors = true;
                this.diagnostics.push(new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, syntax.range));
            }

            return new LibraryPropertyBoundExpression(libraryType.libraryName, rightHandSide, hasValue, hasErrors, syntax);
        }

        const methodInfo = libraries[libraryType.libraryName].methods[rightHandSide];
        if (methodInfo) {
            if (expectedValue) {
                hasErrors = true;
                this.diagnostics.push(new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, syntax.range));
            }

            return new LibraryMethodBoundExpression(libraryType.libraryName, rightHandSide, false, hasErrors, syntax);
        }

        hasErrors = true;
        this.diagnostics.push(new Diagnostic(ErrorCode.LibraryMemberNotFound, leftHandSide.syntax.range, libraryType.libraryName, rightHandSide));
        return new LibraryPropertyBoundExpression(libraryType.libraryName, rightHandSide, true, hasErrors, syntax);
    }

    private bindParenthesis(syntax: ParenthesisExpressionSyntax): BaseBoundExpression<BaseExpressionSyntax> {
        const expression = this.bindExpression(syntax.expression, true);
        return new ParenthesisBoundExpression(expression, expression.hasErrors, syntax);
    }

    private bindNumberLiteral(syntax: NumberLiteralExpressionSyntax): BaseBoundExpression<BaseExpressionSyntax> {
        const value = parseFloat(syntax.token.text);
        const isNotANumber = isNaN(value);
        const expression = new NumberLiteralBoundExpression(value, isNotANumber, syntax);

        if (isNotANumber) {
            this.diagnostics.push(new Diagnostic(ErrorCode.ValueIsNotANumber, expression.syntax.range, syntax.token.text));
        }

        return expression;
    }

    private bindStringLiteral(syntax: StringLiteralExpressionSyntax): BaseBoundExpression<BaseExpressionSyntax> {
        let value = syntax.token.text;
        if (value.length < 1 || value[0] !== "\"") {
            throw new Error(`String literal '${value}' should have never been parsed without a starting double quotes`);
        }

        value = value.substr(1);
        if (value.length && value[value.length - 1] === "\"") {
            value = value.substr(0, value.length - 1);
        }

        return new StringLiteralBoundExpression(value, false, syntax);
    }

    private bindIdentifier(syntax: IdentifierExpressionSyntax, expectedValue: boolean): BaseBoundExpression<BaseExpressionSyntax> {
        let hasErrors = false;
        const name = syntax.token.text;

        if (libraries[name]) {
            if (expectedValue) {
                hasErrors = true;
                this.diagnostics.push(new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, syntax.range));
            }

            return new LibraryTypeBoundExpression(name, hasErrors, syntax);
        } else if (this.definedSubModules[name]) {
            if (expectedValue) {
                hasErrors = true;
                this.diagnostics.push(new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, syntax.range));
            }

            return new SubModuleBoundExpression(name, hasErrors, syntax);
        } else {
            return new VariableBoundExpression(name, hasErrors, syntax);
        }
    }

    private bindUnaryOperator(syntax: UnaryOperatorExpressionSyntax): NegationBoundExpression {
        const expression = this.bindExpression(syntax.expression, true);

        switch (syntax.operatorToken.kind) {
            case TokenKind.Minus: {
                return new NegationBoundExpression(expression, expression.hasErrors, syntax);
            }
            default: {
                throw new Error(`Unsupported token kind: ${TokenKind[syntax.operatorToken.kind]}`);
            }
        }
    }

    private bindBinaryOperator(syntax: BinaryOperatorExpressionSyntax): BaseBoundExpression<BinaryOperatorExpressionSyntax> {
        const leftHandSide = this.bindExpression(syntax.leftExpression, true);
        const rightHandSide = this.bindExpression(syntax.rightExpression, true);

        const hasErrors = leftHandSide.hasErrors || rightHandSide.hasErrors;

        switch (syntax.operatorToken.kind) {
            case TokenKind.Or: return new OrBoundExpression(leftHandSide, rightHandSide, hasErrors, syntax);
            case TokenKind.And: return new AndBoundExpression(leftHandSide, rightHandSide, hasErrors, syntax);
            case TokenKind.NotEqual: return new NotEqualBoundExpression(leftHandSide, rightHandSide, hasErrors, syntax);
            case TokenKind.Equal: return new EqualBoundExpression(leftHandSide, rightHandSide, hasErrors, syntax);
            case TokenKind.LessThan: return new LessThanBoundExpression(leftHandSide, rightHandSide, hasErrors, syntax);
            case TokenKind.GreaterThan: return new GreaterThanBoundExpression(leftHandSide, rightHandSide, hasErrors, syntax);
            case TokenKind.LessThanOrEqual: return new LessThanOrEqualBoundExpression(leftHandSide, rightHandSide, hasErrors, syntax);
            case TokenKind.GreaterThanOrEqual: return new GreaterThanOrEqualBoundExpression(leftHandSide, rightHandSide, hasErrors, syntax);
            case TokenKind.Plus: return new AdditionBoundExpression(leftHandSide, rightHandSide, hasErrors, syntax);
            case TokenKind.Minus: return new SubtractionBoundExpression(leftHandSide, rightHandSide, hasErrors, syntax);
            case TokenKind.Multiply: return new MultiplicationBoundExpression(leftHandSide, rightHandSide, hasErrors, syntax);
            case TokenKind.Divide: return new DivisionBoundExpression(leftHandSide, rightHandSide, hasErrors, syntax);
            default: throw new Error(`Unexpected token kind ${TokenKind[syntax.operatorToken.kind]}`);
        }
    }
}
