import { BaseSyntax, UnaryOperatorExpressionSyntax, BinaryOperatorExpressionSyntax, ArrayAccessExpressionSyntax, IdentifierExpressionSyntax, ObjectAccessExpressionSyntax, CallExpressionSyntax, StringLiteralExpressionSyntax, NumberLiteralExpressionSyntax, ParenthesisExpressionSyntax, IfHeaderSyntax, IfStatementSyntax, WhileStatementSyntax, ForStatementSyntax, LabelCommandSyntax, GoToCommandSyntax, ExpressionCommandSyntax, IfCommandSyntax, ElseIfCommandSyntax, BaseStatementSyntax, BaseExpressionSyntax } from "../syntax/syntax-nodes";

export enum BoundNodeKind {
    // Statements
    IfHeaderStatement,
    IfStatement,
    WhileStatement,
    ForStatement,
    LabelStatement,
    GoToStatement,
    SubModuleCallStatement,
    LibraryMethodCallStatement,
    VariableAssignmentStatement,
    PropertyAssignmentStatement,
    ArrayAssignmentStatement,
    InvalidExpressionStatement,

    // Expressions
    NegationExpression,
    OrExpression,
    AndExpression,
    NotEqualExpression,
    EqualExpression,
    LessThanExpression,
    GreaterThanExpression,
    LessThanOrEqualExpression,
    GreaterThanOrEqualExpression,
    AdditionExpression,
    SubtractionExpression,
    MultiplicationExpression,
    DivisionExpression,
    ArrayAccessExpression,
    LibraryTypeExpression,
    LibraryPropertyExpression,
    LibraryMethodExpression,
    LibraryMethodCallExpression,
    SubModuleExpression,
    SubModuleCallExpression,
    VariableExpression,
    StringLiteralExpression,
    NumberLiteralExpression,
    ParenthesisExpression
}

export abstract class BaseBoundNode<TSyntax extends BaseSyntax> {
    public constructor(
        public readonly kind: BoundNodeKind,
        public readonly syntax: TSyntax) {
    }

    public abstract children(): ReadonlyArray<BaseBoundNode<BaseSyntax>>;
}

export abstract class BaseBoundStatement<TSyntax extends BaseSyntax> extends BaseBoundNode<TSyntax> {
}

export class IfHeaderBoundNode<THeaderCommand extends IfCommandSyntax | ElseIfCommandSyntax> extends BaseBoundNode<IfHeaderSyntax<THeaderCommand>> {
    public constructor(
        public readonly condition: BaseBoundExpression<BaseExpressionSyntax>,
        public readonly statementsList: ReadonlyArray<BaseBoundStatement<BaseStatementSyntax>>,
        syntax: IfHeaderSyntax<THeaderCommand>) {
        super(BoundNodeKind.IfHeaderStatement, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode<BaseSyntax>> {
        return [this.condition, ...this.statementsList];
    }
}

export class IfBoundStatement extends BaseBoundStatement<IfStatementSyntax> {
    public constructor(
        public readonly ifPart: IfHeaderBoundNode<IfCommandSyntax>,
        public readonly elseIfParts: ReadonlyArray<IfHeaderBoundNode<ElseIfCommandSyntax>>,
        public readonly elsePart: ReadonlyArray<BaseBoundStatement<BaseStatementSyntax>> | undefined,
        syntax: IfStatementSyntax) {
        super(BoundNodeKind.IfStatement, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode<BaseSyntax>> {
        return this.elsePart
            ? [this.ifPart, ...this.elseIfParts, ...this.elsePart]
            : [this.ifPart, ...this.elseIfParts];
    }
}

export class WhileBoundStatement extends BaseBoundStatement<WhileStatementSyntax> {
    public constructor(
        public readonly condition: BaseBoundExpression<BaseExpressionSyntax>,
        public readonly statementsList: ReadonlyArray<BaseBoundStatement<BaseStatementSyntax>>,
        syntax: WhileStatementSyntax) {
        super(BoundNodeKind.WhileStatement, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode<BaseSyntax>> {
        return [this.condition, ...this.statementsList];
    }
}

export class ForBoundStatement extends BaseBoundStatement<ForStatementSyntax> {
    public constructor(
        public readonly identifier: string,
        public readonly fromExpression: BaseBoundExpression<BaseExpressionSyntax>,
        public readonly toExpression: BaseBoundExpression<BaseExpressionSyntax>,
        public readonly stepExpression: BaseBoundExpression<BaseExpressionSyntax> | undefined,
        public readonly statementsList: ReadonlyArray<BaseBoundStatement<BaseStatementSyntax>>,
        syntax: ForStatementSyntax) {
        super(BoundNodeKind.ForStatement, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode<BaseSyntax>> {
        const children = [this.fromExpression, this.toExpression];
        if (this.stepExpression) {
            children.push(this.stepExpression);
        }
        children.push.apply(children);
        return children;
    }
}

export class LabelBoundStatement extends BaseBoundStatement<LabelCommandSyntax> {
    public constructor(
        public readonly labelName: string,
        syntax: LabelCommandSyntax) {
        super(BoundNodeKind.LabelStatement, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode<BaseSyntax>> {
        return [];
    }
}

export class GoToBoundStatement extends BaseBoundStatement<GoToCommandSyntax> {
    public constructor(
        public readonly labelName: string,
        syntax: GoToCommandSyntax) {
        super(BoundNodeKind.GoToStatement, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode<BaseSyntax>> {
        return [];
    }
}

export class SubModuleCallBoundStatement extends BaseBoundStatement<ExpressionCommandSyntax> {
    public constructor(
        public readonly subModuleName: string,
        syntax: ExpressionCommandSyntax) {
        super(BoundNodeKind.SubModuleCallStatement, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode<BaseSyntax>> {
        return [];
    }
}

export class LibraryMethodCallBoundStatement extends BaseBoundStatement<ExpressionCommandSyntax> {
    public constructor(
        public readonly libraryName: string,
        public readonly methodName: string,
        public readonly argumentsList: ReadonlyArray<BaseBoundExpression<BaseExpressionSyntax>>,
        syntax: ExpressionCommandSyntax) {
        super(BoundNodeKind.LibraryMethodCallStatement, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode<BaseSyntax>> {
        return this.argumentsList;
    }
}

export class VariableAssignmentBoundStatement extends BaseBoundStatement<ExpressionCommandSyntax> {
    public constructor(
        public readonly variableName: string,
        public readonly value: BaseBoundExpression<BaseExpressionSyntax>,
        syntax: ExpressionCommandSyntax) {
        super(BoundNodeKind.VariableAssignmentStatement, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode<BaseSyntax>> {
        return [];
    }
}

export class PropertyAssignmentBoundStatement extends BaseBoundStatement<ExpressionCommandSyntax> {
    public constructor(
        public readonly libraryName: string,
        public readonly propertyName: string,
        public readonly value: BaseBoundExpression<BaseExpressionSyntax>,
        syntax: ExpressionCommandSyntax) {
        super(BoundNodeKind.PropertyAssignmentStatement, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode<BaseSyntax>> {
        return [this.value];
    }
}

export class ArrayAssignmentBoundStatement extends BaseBoundStatement<ExpressionCommandSyntax> {
    public constructor(
        public readonly arrayName: string,
        public readonly indices: ReadonlyArray<BaseBoundExpression<BaseExpressionSyntax>>,
        public readonly value: BaseBoundExpression<BaseExpressionSyntax>,
        syntax: ExpressionCommandSyntax) {
        super(BoundNodeKind.ArrayAssignmentStatement, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode<BaseSyntax>> {
        return [this.value];
    }
}

export class InvalidExpressionBoundStatement extends BaseBoundStatement<ExpressionCommandSyntax> {
    public constructor(
        public readonly expression: BaseBoundExpression<BaseExpressionSyntax>,
        syntax: ExpressionCommandSyntax) {
        super(BoundNodeKind.InvalidExpressionStatement, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode<BaseSyntax>> {
        return [this.expression];
    }
}

export abstract class BaseBoundExpression<TSyntax extends BaseSyntax> extends BaseBoundNode<TSyntax> {
    public constructor(
        public readonly kind: BoundNodeKind,
        public readonly hasValue: boolean,
        public readonly hasErrors: boolean,
        syntax: TSyntax) {
        super(kind, syntax);
    }
}

export class NegationBoundExpression extends BaseBoundExpression<UnaryOperatorExpressionSyntax> {
    public constructor(
        public readonly expression: BaseBoundExpression<BaseExpressionSyntax>,
        hasErrors: boolean,
        syntax: UnaryOperatorExpressionSyntax) {
        super(BoundNodeKind.NegationExpression, true, hasErrors, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode<BaseSyntax>> {
        return [this.expression];
    }
}

export class OrBoundExpression extends BaseBoundExpression<BinaryOperatorExpressionSyntax> {
    public constructor(
        public readonly leftExpression: BaseBoundExpression<BaseExpressionSyntax>,
        public readonly rightExpression: BaseBoundExpression<BaseExpressionSyntax>,
        hasErrors: boolean,
        syntax: BinaryOperatorExpressionSyntax) {
        super(BoundNodeKind.OrExpression, true, hasErrors, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode<BaseSyntax>> {
        return [this.leftExpression, this.rightExpression];
    }
}

export class AndBoundExpression extends BaseBoundExpression<BinaryOperatorExpressionSyntax> {
    public constructor(
        public readonly leftExpression: BaseBoundExpression<BaseExpressionSyntax>,
        public readonly rightExpression: BaseBoundExpression<BaseExpressionSyntax>,
        hasErrors: boolean,
        syntax: BinaryOperatorExpressionSyntax) {
        super(BoundNodeKind.AndExpression, true, hasErrors, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode<BaseSyntax>> {
        return [this.leftExpression, this.rightExpression];
    }
}

export class NotEqualBoundExpression extends BaseBoundExpression<BinaryOperatorExpressionSyntax> {
    public constructor(
        public readonly leftExpression: BaseBoundExpression<BaseExpressionSyntax>,
        public readonly rightExpression: BaseBoundExpression<BaseExpressionSyntax>,
        hasErrors: boolean,
        syntax: BinaryOperatorExpressionSyntax) {
        super(BoundNodeKind.NotEqualExpression, true, hasErrors, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode<BaseSyntax>> {
        return [this.leftExpression, this.rightExpression];
    }
}

export class EqualBoundExpression extends BaseBoundExpression<BinaryOperatorExpressionSyntax> {
    public constructor(
        public readonly leftExpression: BaseBoundExpression<BaseExpressionSyntax>,
        public readonly rightExpression: BaseBoundExpression<BaseExpressionSyntax>,
        hasErrors: boolean,
        syntax: BinaryOperatorExpressionSyntax) {
        super(BoundNodeKind.EqualExpression, true, hasErrors, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode<BaseSyntax>> {
        return [this.leftExpression, this.rightExpression];
    }
}

export class LessThanBoundExpression extends BaseBoundExpression<BinaryOperatorExpressionSyntax> {
    public constructor(
        public readonly leftExpression: BaseBoundExpression<BaseExpressionSyntax>,
        public readonly rightExpression: BaseBoundExpression<BaseExpressionSyntax>,
        hasErrors: boolean,
        syntax: BinaryOperatorExpressionSyntax) {
        super(BoundNodeKind.LessThanExpression, true, hasErrors, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode<BaseSyntax>> {
        return [this.leftExpression, this.rightExpression];
    }
}

export class GreaterThanBoundExpression extends BaseBoundExpression<BinaryOperatorExpressionSyntax> {
    public constructor(
        public readonly leftExpression: BaseBoundExpression<BaseExpressionSyntax>,
        public readonly rightExpression: BaseBoundExpression<BaseExpressionSyntax>,
        hasErrors: boolean,
        syntax: BinaryOperatorExpressionSyntax) {
        super(BoundNodeKind.GreaterThanExpression, true, hasErrors, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode<BaseSyntax>> {
        return [this.leftExpression, this.rightExpression];
    }
}

export class LessThanOrEqualBoundExpression extends BaseBoundExpression<BinaryOperatorExpressionSyntax> {
    public constructor(
        public readonly leftExpression: BaseBoundExpression<BaseExpressionSyntax>,
        public readonly rightExpression: BaseBoundExpression<BaseExpressionSyntax>,
        hasErrors: boolean,
        syntax: BinaryOperatorExpressionSyntax) {
        super(BoundNodeKind.LessThanOrEqualExpression, true, hasErrors, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode<BaseSyntax>> {
        return [this.leftExpression, this.rightExpression];
    }
}

export class GreaterThanOrEqualBoundExpression extends BaseBoundExpression<BinaryOperatorExpressionSyntax> {
    public constructor(
        public readonly leftExpression: BaseBoundExpression<BaseExpressionSyntax>,
        public readonly rightExpression: BaseBoundExpression<BaseExpressionSyntax>,
        hasErrors: boolean,
        syntax: BinaryOperatorExpressionSyntax) {
        super(BoundNodeKind.GreaterThanOrEqualExpression, true, hasErrors, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode<BaseSyntax>> {
        return [this.leftExpression, this.rightExpression];
    }
}

export class AdditionBoundExpression extends BaseBoundExpression<BinaryOperatorExpressionSyntax> {
    public constructor(
        public readonly leftExpression: BaseBoundExpression<BaseExpressionSyntax>,
        public readonly rightExpression: BaseBoundExpression<BaseExpressionSyntax>,
        hasErrors: boolean,
        syntax: BinaryOperatorExpressionSyntax) {
        super(BoundNodeKind.AdditionExpression, true, hasErrors, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode<BaseSyntax>> {
        return [this.leftExpression, this.rightExpression];
    }
}

export class SubtractionBoundExpression extends BaseBoundExpression<BinaryOperatorExpressionSyntax> {
    public constructor(
        public readonly leftExpression: BaseBoundExpression<BaseExpressionSyntax>,
        public readonly rightExpression: BaseBoundExpression<BaseExpressionSyntax>,
        hasErrors: boolean,
        syntax: BinaryOperatorExpressionSyntax) {
        super(BoundNodeKind.SubtractionExpression, true, hasErrors, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode<BaseSyntax>> {
        return [this.leftExpression, this.rightExpression];
    }
}

export class MultiplicationBoundExpression extends BaseBoundExpression<BinaryOperatorExpressionSyntax> {
    public constructor(
        public readonly leftExpression: BaseBoundExpression<BaseExpressionSyntax>,
        public readonly rightExpression: BaseBoundExpression<BaseExpressionSyntax>,
        hasErrors: boolean,
        syntax: BinaryOperatorExpressionSyntax) {
        super(BoundNodeKind.MultiplicationExpression, true, hasErrors, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode<BaseSyntax>> {
        return [this.leftExpression, this.rightExpression];
    }
}

export class DivisionBoundExpression extends BaseBoundExpression<BinaryOperatorExpressionSyntax> {
    public constructor(
        public readonly leftExpression: BaseBoundExpression<BaseExpressionSyntax>,
        public readonly rightExpression: BaseBoundExpression<BaseExpressionSyntax>,
        hasErrors: boolean,
        syntax: BinaryOperatorExpressionSyntax) {
        super(BoundNodeKind.DivisionExpression, true, hasErrors, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode<BaseSyntax>> {
        return [this.leftExpression, this.rightExpression];
    }
}

export class ArrayAccessBoundExpression extends BaseBoundExpression<ArrayAccessExpressionSyntax> {
    public constructor(
        public readonly arrayName: string,
        public readonly indices: ReadonlyArray<BaseBoundExpression<BaseExpressionSyntax>>,
        hasErrors: boolean,
        syntax: ArrayAccessExpressionSyntax) {
        super(BoundNodeKind.ArrayAccessExpression, true, hasErrors, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode<BaseSyntax>> {
        return this.indices;
    }
}

export class LibraryTypeBoundExpression extends BaseBoundExpression<IdentifierExpressionSyntax> {
    public constructor(
        public readonly libraryName: string,
        hasErrors: boolean,
        syntax: IdentifierExpressionSyntax) {
        super(BoundNodeKind.LibraryTypeExpression, false, hasErrors, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode<BaseSyntax>> {
        return [];
    }
}

export class LibraryPropertyBoundExpression extends BaseBoundExpression<ObjectAccessExpressionSyntax> {
    public constructor(
        public readonly libraryName: string,
        public readonly propertyName: string,
        hasValue: boolean,
        hasErrors: boolean,
        syntax: ObjectAccessExpressionSyntax) {
        super(BoundNodeKind.LibraryPropertyExpression, hasValue, hasErrors, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode<BaseSyntax>> {
        return [];
    }
}

export class LibraryMethodBoundExpression extends BaseBoundExpression<ObjectAccessExpressionSyntax> {
    public constructor(
        public readonly libraryName: string,
        public readonly methodName: string,
        hasValue: boolean,
        hasErrors: boolean,
        syntax: ObjectAccessExpressionSyntax) {
        super(BoundNodeKind.LibraryMethodExpression, hasValue, hasErrors, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode<BaseSyntax>> {
        return [];
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
        super(BoundNodeKind.LibraryMethodCallExpression, hasValue, hasErrors, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode<BaseSyntax>> {
        return this.argumentsList;
    }
}

export class SubModuleBoundExpression extends BaseBoundExpression<IdentifierExpressionSyntax> {
    public constructor(
        public readonly subModuleName: string,
        hasErrors: boolean,
        syntax: IdentifierExpressionSyntax) {
        super(BoundNodeKind.SubModuleExpression, false, hasErrors, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode<BaseSyntax>> {
        return [];
    }
}

export class SubModuleCallBoundExpression extends BaseBoundExpression<CallExpressionSyntax> {
    public constructor(
        public readonly subModuleName: string,
        hasErrors: boolean,
        syntax: CallExpressionSyntax) {
        super(BoundNodeKind.SubModuleCallExpression, false, hasErrors, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode<BaseSyntax>> {
        return [];
    }
}

export class VariableBoundExpression extends BaseBoundExpression<IdentifierExpressionSyntax> {
    public constructor(
        public readonly variableName: string,
        hasErrors: boolean,
        syntax: IdentifierExpressionSyntax) {
        super(BoundNodeKind.VariableExpression, true, hasErrors, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode<BaseSyntax>> {
        return [];
    }
}

export class StringLiteralBoundExpression extends BaseBoundExpression<StringLiteralExpressionSyntax> {
    public constructor(
        public readonly value: string,
        hasErrors: boolean,
        syntax: StringLiteralExpressionSyntax) {
        super(BoundNodeKind.StringLiteralExpression, true, hasErrors, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode<BaseSyntax>> {
        return [];
    }
}

export class NumberLiteralBoundExpression extends BaseBoundExpression<NumberLiteralExpressionSyntax>     {
    public constructor(
        public readonly value: number,
        hasErrors: boolean,
        syntax: NumberLiteralExpressionSyntax) {
        super(BoundNodeKind.NumberLiteralExpression, true, hasErrors, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode<BaseSyntax>> {
        return [];
    }
}

export class ParenthesisBoundExpression extends BaseBoundExpression<ParenthesisExpressionSyntax> {
    public constructor(
        public readonly expression: BaseBoundExpression<BaseExpressionSyntax>,
        hasErrors: boolean,
        syntax: ParenthesisExpressionSyntax) {
        super(BoundNodeKind.ParenthesisExpression, true, hasErrors, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode<BaseSyntax>> {
        return [this.expression];
    }
}
