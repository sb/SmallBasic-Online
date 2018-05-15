import { BaseBoundNode } from "./bound-nodes";
import { UnaryOperatorExpressionSyntax, BaseExpressionSyntax, BinaryOperatorExpressionSyntax, ArrayAccessExpressionSyntax, IdentifierExpressionSyntax, ObjectAccessExpressionSyntax, CallExpressionSyntax, StringLiteralExpressionSyntax, NumberLiteralExpressionSyntax, ParenthesisExpressionSyntax } from "../../syntax/nodes/expressions";

export enum BoundExpressionKind {
    Negation,
    Or,
    And,
    NotEqual,
    Equal,
    LessThan,
    GreaterThan,
    LessThanOrEqual,
    GreaterThanOrEqual,
    Addition,
    Subtraction,
    Multiplication,
    Division,
    ArrayAccess,
    LibraryType,
    LibraryProperty,
    LibraryMethod,
    LibraryMethodCall,
    SubModule,
    SubModuleCall,
    Variable,
    StringLiteral,
    NumberLiteral,
    Parenthesis
}

export abstract class BaseBoundExpression<TSyntax extends BaseExpressionSyntax> extends BaseBoundNode<TSyntax> {
    public constructor(
        public readonly kind: BoundExpressionKind,
        public readonly hasValue: boolean,
        public readonly hasErrors: boolean,
        syntax: TSyntax) {
        super(syntax);
    }
}

export class NegationBoundExpression extends BaseBoundExpression<UnaryOperatorExpressionSyntax> {
    public constructor(
        public readonly expression: BaseBoundExpression<BaseExpressionSyntax>,
        hasErrors: boolean,
        syntax: UnaryOperatorExpressionSyntax) {
        super(BoundExpressionKind.Negation, true, hasErrors, syntax);
    }
}

export class OrBoundExpression extends BaseBoundExpression<BinaryOperatorExpressionSyntax> {
    public constructor(
        public readonly leftExpression: BaseBoundExpression<BaseExpressionSyntax>,
        public readonly rightExpression: BaseBoundExpression<BaseExpressionSyntax>,
        hasErrors: boolean,
        syntax: BinaryOperatorExpressionSyntax) {
        super(BoundExpressionKind.Or, true, hasErrors, syntax);
    }
}

export class AndBoundExpression extends BaseBoundExpression<BinaryOperatorExpressionSyntax> {
    public constructor(
        public readonly leftExpression: BaseBoundExpression<BaseExpressionSyntax>,
        public readonly rightExpression: BaseBoundExpression<BaseExpressionSyntax>,
        hasErrors: boolean,
        syntax: BinaryOperatorExpressionSyntax) {
        super(BoundExpressionKind.And, true, hasErrors, syntax);
    }
}

export class NotEqualBoundExpression extends BaseBoundExpression<BinaryOperatorExpressionSyntax> {
    public constructor(
        public readonly leftExpression: BaseBoundExpression<BaseExpressionSyntax>,
        public readonly rightExpression: BaseBoundExpression<BaseExpressionSyntax>,
        hasErrors: boolean,
        syntax: BinaryOperatorExpressionSyntax) {
        super(BoundExpressionKind.NotEqual, true, hasErrors, syntax);
    }
}

export class EqualBoundExpression extends BaseBoundExpression<BinaryOperatorExpressionSyntax> {
    public constructor(
        public readonly leftExpression: BaseBoundExpression<BaseExpressionSyntax>,
        public readonly rightExpression: BaseBoundExpression<BaseExpressionSyntax>,
        hasErrors: boolean,
        syntax: BinaryOperatorExpressionSyntax) {
        super(BoundExpressionKind.Equal, true, hasErrors, syntax);
    }
}

export class LessThanBoundExpression extends BaseBoundExpression<BinaryOperatorExpressionSyntax> {
    public constructor(
        public readonly leftExpression: BaseBoundExpression<BaseExpressionSyntax>,
        public readonly rightExpression: BaseBoundExpression<BaseExpressionSyntax>,
        hasErrors: boolean,
        syntax: BinaryOperatorExpressionSyntax) {
        super(BoundExpressionKind.LessThan, true, hasErrors, syntax);
    }
}

export class GreaterThanBoundExpression extends BaseBoundExpression<BinaryOperatorExpressionSyntax> {
    public constructor(
        public readonly leftExpression: BaseBoundExpression<BaseExpressionSyntax>,
        public readonly rightExpression: BaseBoundExpression<BaseExpressionSyntax>,
        hasErrors: boolean,
        syntax: BinaryOperatorExpressionSyntax) {
        super(BoundExpressionKind.GreaterThan, true, hasErrors, syntax);
    }
}

export class LessThanOrEqualBoundExpression extends BaseBoundExpression<BinaryOperatorExpressionSyntax> {
    public constructor(
        public readonly leftExpression: BaseBoundExpression<BaseExpressionSyntax>,
        public readonly rightExpression: BaseBoundExpression<BaseExpressionSyntax>,
        hasErrors: boolean,
        syntax: BinaryOperatorExpressionSyntax) {
        super(BoundExpressionKind.LessThanOrEqual, true, hasErrors, syntax);
    }
}

export class GreaterThanOrEqualBoundExpression extends BaseBoundExpression<BinaryOperatorExpressionSyntax> {
    public constructor(
        public readonly leftExpression: BaseBoundExpression<BaseExpressionSyntax>,
        public readonly rightExpression: BaseBoundExpression<BaseExpressionSyntax>,
        hasErrors: boolean,
        syntax: BinaryOperatorExpressionSyntax) {
        super(BoundExpressionKind.GreaterThanOrEqual, true, hasErrors, syntax);
    }
}

export class AdditionBoundExpression extends BaseBoundExpression<BinaryOperatorExpressionSyntax> {
    public constructor(
        public readonly leftExpression: BaseBoundExpression<BaseExpressionSyntax>,
        public readonly rightExpression: BaseBoundExpression<BaseExpressionSyntax>,
        hasErrors: boolean,
        syntax: BinaryOperatorExpressionSyntax) {
        super(BoundExpressionKind.Addition, true, hasErrors, syntax);
    }
}

export class SubtractionBoundExpression extends BaseBoundExpression<BinaryOperatorExpressionSyntax> {
    public constructor(
        public readonly leftExpression: BaseBoundExpression<BaseExpressionSyntax>,
        public readonly rightExpression: BaseBoundExpression<BaseExpressionSyntax>,
        hasErrors: boolean,
        syntax: BinaryOperatorExpressionSyntax) {
        super(BoundExpressionKind.Subtraction, true, hasErrors, syntax);
    }
}

export class MultiplicationBoundExpression extends BaseBoundExpression<BinaryOperatorExpressionSyntax> {
    public constructor(
        public readonly leftExpression: BaseBoundExpression<BaseExpressionSyntax>,
        public readonly rightExpression: BaseBoundExpression<BaseExpressionSyntax>,
        hasErrors: boolean,
        syntax: BinaryOperatorExpressionSyntax) {
        super(BoundExpressionKind.Multiplication, true, hasErrors, syntax);
    }
}

export class DivisionBoundExpression extends BaseBoundExpression<BinaryOperatorExpressionSyntax> {
    public constructor(
        public readonly leftExpression: BaseBoundExpression<BaseExpressionSyntax>,
        public readonly rightExpression: BaseBoundExpression<BaseExpressionSyntax>,
        hasErrors: boolean,
        syntax: BinaryOperatorExpressionSyntax) {
        super(BoundExpressionKind.Division, true, hasErrors, syntax);
    }
}

export class ArrayAccessBoundExpression extends BaseBoundExpression<ArrayAccessExpressionSyntax> {
    public constructor(
        public readonly arrayName: string,
        public readonly indices: ReadonlyArray<BaseBoundExpression<BaseExpressionSyntax>>,
        hasErrors: boolean,
        syntax: ArrayAccessExpressionSyntax) {
        super(BoundExpressionKind.ArrayAccess, true, hasErrors, syntax);
    }
}

export class LibraryTypeBoundExpression extends BaseBoundExpression<IdentifierExpressionSyntax> {
    public constructor(
        public readonly libraryName: string,
        hasErrors: boolean,
        syntax: IdentifierExpressionSyntax) {
        super(BoundExpressionKind.LibraryType, false, hasErrors, syntax);
    }
}

export class LibraryPropertyBoundExpression extends BaseBoundExpression<ObjectAccessExpressionSyntax> {
    public constructor(
        public readonly libraryName: string,
        public readonly propertyName: string,
        hasValue: boolean,
        hasErrors: boolean,
        syntax: ObjectAccessExpressionSyntax) {
        super(BoundExpressionKind.LibraryProperty, hasValue, hasErrors, syntax);
    }
}

export class LibraryMethodBoundExpression extends BaseBoundExpression<ObjectAccessExpressionSyntax> {
    public constructor(
        public readonly libraryName: string,
        public readonly methodName: string,
        hasValue: boolean,
        hasErrors: boolean,
        syntax: ObjectAccessExpressionSyntax) {
        super(BoundExpressionKind.LibraryMethod, hasValue, hasErrors, syntax);
    }
}

export class LibraryMethodCallBoundExpression extends BaseBoundExpression<CallExpressionSyntax> {
    public constructor(
        public readonly libraryName: string,
        public readonly MethodName: string,
        public readonly argumentsList: ReadonlyArray<BaseBoundExpression<BaseExpressionSyntax>>,
        hasValue: boolean,
        hasErrors: boolean,
        syntax: CallExpressionSyntax) {
        super(BoundExpressionKind.LibraryMethodCall, hasValue, hasErrors, syntax);
    }
}

export class SubModuleBoundExpression extends BaseBoundExpression<IdentifierExpressionSyntax> {
    public constructor(
        public readonly subModuleName: string,
        hasErrors: boolean,
        syntax: IdentifierExpressionSyntax) {
        super(BoundExpressionKind.SubModule, false, hasErrors, syntax);
    }
}

export class SubModuleCallBoundExpression extends BaseBoundExpression<CallExpressionSyntax>{
    public constructor(
        public readonly subModuleName: string,
        hasErrors: boolean,
        syntax: CallExpressionSyntax) {
        super(BoundExpressionKind.SubModuleCall, false, hasErrors, syntax);
    }
}

export class VariableBoundExpression extends BaseBoundExpression<IdentifierExpressionSyntax> {
    public constructor(
        public readonly variableName: string,
        hasErrors: boolean,
        syntax: IdentifierExpressionSyntax) {
        super(BoundExpressionKind.Variable, true, hasErrors, syntax);
    }
}

export class StringLiteralBoundExpression extends BaseBoundExpression<StringLiteralExpressionSyntax> {
    public constructor(
        public readonly value: string,
        hasErrors: boolean,
        syntax: StringLiteralExpressionSyntax) {
        super(BoundExpressionKind.StringLiteral, true, hasErrors, syntax);
    }
}

export class NumberLiteralBoundExpression extends BaseBoundExpression<NumberLiteralExpressionSyntax> {
    public constructor(
        public readonly value: number,
        hasErrors: boolean,
        syntax: NumberLiteralExpressionSyntax) {
        super(BoundExpressionKind.NumberLiteral, true, hasErrors, syntax);
    }
}

export class ParenthesisBoundExpression extends BaseBoundExpression<ParenthesisExpressionSyntax> {
    public constructor(
        public readonly expression: BaseBoundExpression<BaseExpressionSyntax>,
        hasErrors: boolean,
        syntax: ParenthesisExpressionSyntax) {
        super(BoundExpressionKind.Parenthesis, true, hasErrors, syntax);
    }
}
