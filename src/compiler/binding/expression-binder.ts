import { RuntimeLibraries } from "../runtime/libraries";
import { Diagnostic, ErrorCode } from "../utils/diagnostics";
import {
    ArrayAccessBoundExpression,
    BaseBoundExpression,
    BoundKind,
    LibraryMethodBoundExpression,
    LibraryTypeBoundExpression,
    NegationBoundExpression,
    SubModuleBoundExpression,
    VariableBoundExpression,
    LibraryMethodInvocationBoundExpression,
    SubModuleInvocationBoundExpression,
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
} from "./bound-nodes";
import {
    ArrayAccessExpressionSyntax,
    BaseSyntaxNode,
    BinaryOperatorExpressionSyntax,
    InvocationExpressionSyntax,
    SyntaxKind,
    ObjectAccessExpressionSyntax,
    ParenthesisExpressionSyntax,
    UnaryOperatorExpressionSyntax,
    IdentifierExpressionSyntax,
    NumberLiteralExpressionSyntax,
    StringLiteralExpressionSyntax,
    BaseExpressionSyntax
} from "../syntax/syntax-nodes";
import { TokenKind } from "../syntax/tokens";
import { ProgramKind } from "../runtime/libraries-metadata";
import { CompilerUtils } from "../utils/compiler-utils";

export class ExpressionBinder {
    private readonly _result: BaseBoundExpression<BaseExpressionSyntax>;

    public get result(): BaseBoundExpression<BaseExpressionSyntax> {
        return this._result;
    }

    public constructor(
        syntax: BaseSyntaxNode,
        expectedValue: boolean,
        public programKind: ProgramKind,
        private readonly _definedSubModules: { readonly [name: string]: boolean },
        private readonly _diagnostics: Diagnostic[]) {
        this._result = this.bindExpression(syntax, expectedValue);
    }

    private bindExpression(syntax: BaseExpressionSyntax, expectedValue: boolean): BaseBoundExpression<BaseExpressionSyntax> {
        let expression: BaseBoundExpression<BaseExpressionSyntax>;

        switch (syntax.kind) {
            case SyntaxKind.ArrayAccessExpression: expression = this.bindArrayAccess(syntax as ArrayAccessExpressionSyntax); break;
            case SyntaxKind.BinaryOperatorExpression: expression = this.bindBinaryOperator(syntax as BinaryOperatorExpressionSyntax); break;
            case SyntaxKind.InvocationExpression: expression = this.bindInvocation(syntax as InvocationExpressionSyntax, expectedValue); break;
            case SyntaxKind.ObjectAccessExpression: expression = this.bindObjectAccess(syntax as ObjectAccessExpressionSyntax, expectedValue); break;
            case SyntaxKind.ParenthesisExpression: expression = this.bindParenthesis(syntax as ParenthesisExpressionSyntax); break;
            case SyntaxKind.NumberLiteralExpression: expression = this.bindNumberLiteral(syntax as NumberLiteralExpressionSyntax); break;
            case SyntaxKind.StringLiteralExpression: expression = this.bindStringLiteral(syntax as StringLiteralExpressionSyntax); break;
            case SyntaxKind.IdentifierExpression: expression = this.bindIdentifier(syntax as IdentifierExpressionSyntax, expectedValue); break;
            case SyntaxKind.UnaryOperatorExpression: expression = this.bindUnaryOperator(syntax as UnaryOperatorExpressionSyntax); break;
            default: throw new Error(`Unexpected syntax kind: ${SyntaxKind[syntax.kind]}`);
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
            case BoundKind.ArrayAccessExpression: {
                const arrayAccess = baseExpression as ArrayAccessBoundExpression;
                arrayName = arrayAccess.arrayName;
                indices = [...(arrayAccess).indices, indexExpression];
                break;
            }
            case BoundKind.VariableExpression: {
                arrayName = (baseExpression as VariableBoundExpression).variableName;
                indices = [indexExpression];
                break;
            }
            default: {
                if (!hasErrors) {
                    hasErrors = true;
                    this._diagnostics.push(new Diagnostic(ErrorCode.UnsupportedArrayBaseExpression, baseExpression.syntax.range));
                }

                arrayName = "<array>";
                indices = [indexExpression];
                break;
            }
        }

        return new ArrayAccessBoundExpression(arrayName, indices, hasErrors, syntax);
    }

    private bindInvocation(syntax: InvocationExpressionSyntax, expectedValue: boolean): BaseBoundExpression<BaseExpressionSyntax> {
        const baseExpression = this.bindExpression(syntax.baseExpression, false);
        const argumentsList = syntax.argumentsList.map(arg => this.bindExpression(arg.expression, true));

        let hasErrors = baseExpression.hasErrors || argumentsList.some(arg => arg.hasErrors);

        switch (baseExpression.kind) {
            case BoundKind.LibraryMethodExpression: {
                const method = baseExpression as LibraryMethodBoundExpression;
                const definition = RuntimeLibraries.Metadata[method.libraryName].methods[method.methodName];
                const parametersCount = definition.parameters.length;

                if (argumentsList.length !== parametersCount) {
                    hasErrors = true;
                    this._diagnostics.push(new Diagnostic(ErrorCode.UnexpectedArgumentsCount, baseExpression.syntax.range, parametersCount.toString(), argumentsList.length.toString()));
                }
                else if (expectedValue && !definition.returnsValue) {
                    hasErrors = true;
                    this._diagnostics.push(new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, syntax.range));
                }

                return new LibraryMethodInvocationBoundExpression(method.libraryName, method.methodName, argumentsList, definition.returnsValue, hasErrors, syntax);
            }
            case BoundKind.SubModuleExpression: {
                if (argumentsList.length !== 0) {
                    hasErrors = true;
                    this._diagnostics.push(new Diagnostic(ErrorCode.UnexpectedArgumentsCount, baseExpression.syntax.range, "0", argumentsList.length.toString()));
                } else if (expectedValue) {
                    hasErrors = true;
                    this._diagnostics.push(new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, syntax.range));
                }

                const subModule = baseExpression as SubModuleBoundExpression;
                return new SubModuleInvocationBoundExpression(subModule.subModuleName, hasErrors, syntax);
            }
            default: {
                hasErrors = true;
                this._diagnostics.push(new Diagnostic(ErrorCode.UnsupportedCallBaseExpression, baseExpression.syntax.range));
                return new LibraryMethodInvocationBoundExpression("<library>", "<method>", argumentsList, true, hasErrors, syntax);
            }
        }
    }

    private bindObjectAccess(syntax: ObjectAccessExpressionSyntax, expectedValue: boolean): BaseBoundExpression<BaseExpressionSyntax> {
        const leftHandSide = this.bindExpression(syntax.baseExpression, false);
        const rightHandSide = syntax.identifierToken.token.text;
        let hasErrors = leftHandSide.hasErrors;

        if (leftHandSide.kind !== BoundKind.LibraryTypeExpression) {
            hasErrors = true;
            this._diagnostics.push(new Diagnostic(ErrorCode.UnsupportedDotBaseExpression, leftHandSide.syntax.range));
            return new LibraryPropertyBoundExpression("<library>", rightHandSide, true, hasErrors, syntax);
        }

        const libraryType = leftHandSide as LibraryTypeBoundExpression;
        const propertyInfo = RuntimeLibraries.Metadata[libraryType.libraryName].properties[rightHandSide];

        if (propertyInfo) {
            if (expectedValue && !propertyInfo.hasGetter) {
                hasErrors = true;
                this._diagnostics.push(new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, syntax.range));
            }

            return new LibraryPropertyBoundExpression(libraryType.libraryName, rightHandSide, propertyInfo.hasGetter, hasErrors, syntax);
        }

        const methodInfo = RuntimeLibraries.Metadata[libraryType.libraryName].methods[rightHandSide];
        if (methodInfo) {
            if (expectedValue) {
                hasErrors = true;
                this._diagnostics.push(new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, syntax.range));
            }

            return new LibraryMethodBoundExpression(libraryType.libraryName, rightHandSide, false, hasErrors, syntax);
        }

        hasErrors = true;
        this._diagnostics.push(new Diagnostic(ErrorCode.LibraryMemberNotFound, leftHandSide.syntax.range, libraryType.libraryName, rightHandSide));
        return new LibraryPropertyBoundExpression(libraryType.libraryName, rightHandSide, true, hasErrors, syntax);
    }

    private bindParenthesis(syntax: ParenthesisExpressionSyntax): BaseBoundExpression<BaseExpressionSyntax> {
        const expression = this.bindExpression(syntax.expression, true);
        return new ParenthesisBoundExpression(expression, expression.hasErrors, syntax);
    }

    private bindNumberLiteral(syntax: NumberLiteralExpressionSyntax): BaseBoundExpression<BaseExpressionSyntax> {
        const value = parseFloat(syntax.numberToken.token.text);
        const isNotANumber = isNaN(value);
        const expression = new NumberLiteralBoundExpression(value, isNotANumber, syntax);

        if (isNotANumber) {
            this._diagnostics.push(new Diagnostic(ErrorCode.ValueIsNotANumber, expression.syntax.range, syntax.numberToken.token.text));
        }

        return expression;
    }

    private bindStringLiteral(syntax: StringLiteralExpressionSyntax): BaseBoundExpression<BaseExpressionSyntax> {
        let value = syntax.stringToken.token.text;
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
        const name = syntax.identifierToken.token.text;
        const library = RuntimeLibraries.Metadata[name];

        if (library) {
            if (expectedValue) {
                hasErrors = true;
                this._diagnostics.push(new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, syntax.range));
            }

            if (this.programKind === ProgramKind.Any) {
                this.programKind = library.programKind;
            } else if (library.programKind !== ProgramKind.Any && library.programKind !== this.programKind) {
                hasErrors = true;
                this._diagnostics.push(new Diagnostic(
                    ErrorCode.ProgramKindChanged,
                    syntax.range,
                    CompilerUtils.programKindToDisplayString(this.programKind),
                    CompilerUtils.programKindToDisplayString(library.programKind)));
            }

            return new LibraryTypeBoundExpression(name, hasErrors, syntax);
        } else if (this._definedSubModules[name]) {
            if (expectedValue) {
                hasErrors = true;
                this._diagnostics.push(new Diagnostic(ErrorCode.UnexpectedVoid_ExpectingValue, syntax.range));
            }

            return new SubModuleBoundExpression(name, hasErrors, syntax);
        } else {
            return new VariableBoundExpression(name, hasErrors, syntax);
        }
    }

    private bindUnaryOperator(syntax: UnaryOperatorExpressionSyntax): NegationBoundExpression {
        const expression = this.bindExpression(syntax.expression, true);

        if (syntax.operatorToken.token.kind === TokenKind.Minus) {
            return new NegationBoundExpression(expression, expression.hasErrors, syntax);
        } else {
            throw new Error(`Unsupported token kind: ${TokenKind[syntax.operatorToken.kind]}`);
        }
    }

    private bindBinaryOperator(syntax: BinaryOperatorExpressionSyntax): BaseBoundExpression<BinaryOperatorExpressionSyntax> {
        const leftHandSide = this.bindExpression(syntax.leftExpression, true);
        const rightHandSide = this.bindExpression(syntax.rightExpression, true);

        const hasErrors = leftHandSide.hasErrors || rightHandSide.hasErrors;

        switch (syntax.operatorToken.token.kind) {
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
