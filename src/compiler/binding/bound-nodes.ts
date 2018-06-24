import { BaseSyntaxNode, UnaryOperatorExpressionSyntax, BinaryOperatorExpressionSyntax, ArrayAccessExpressionSyntax, IdentifierExpressionSyntax, ObjectAccessExpressionSyntax, InvocationExpressionSyntax, StringLiteralExpressionSyntax, NumberLiteralExpressionSyntax, ParenthesisExpressionSyntax, IfHeaderSyntax, IfStatementSyntax, WhileStatementSyntax, ForStatementSyntax, LabelCommandSyntax, GoToCommandSyntax, ExpressionCommandSyntax, IfCommandSyntax, ElseIfCommandSyntax, BaseStatementSyntax, BaseExpressionSyntax } from "../syntax/syntax-nodes";

export enum BoundKind {
    // Statements
    IfHeaderStatement,
    IfStatement,
    WhileStatement,
    ForStatement,
    LabelStatement,
    GoToStatement,
    SubModuleInvocationStatement,
    LibraryMethodInvocationStatement,
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
    LibraryMethodInvocationExpression,
    SubModuleExpression,
    SubModuleInvocationExpression,
    VariableExpression,
    StringLiteralExpression,
    NumberLiteralExpression,
    ParenthesisExpression
}

export abstract class BaseBoundNode<TSyntax extends BaseSyntaxNode> {
    public constructor(
        public readonly kind: BoundKind,
        public readonly syntax: TSyntax) {
    }

    public abstract children(): ReadonlyArray<BaseBoundNode<BaseSyntaxNode>>;
}

export abstract class BaseBoundStatement<TSyntax extends BaseSyntaxNode> extends BaseBoundNode<TSyntax> {
}

export class IfHeaderBoundNode<THeaderCommand extends IfCommandSyntax | ElseIfCommandSyntax> extends BaseBoundNode<IfHeaderSyntax<THeaderCommand>> {
    public constructor(
        public readonly condition: BaseBoundExpression<BaseExpressionSyntax>,
        public readonly statementsList: ReadonlyArray<BaseBoundStatement<BaseStatementSyntax>>,
        syntax: IfHeaderSyntax<THeaderCommand>) {
        super(BoundKind.IfHeaderStatement, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode<BaseSyntaxNode>> {
        return [this.condition, ...this.statementsList];
    }
}

export class IfBoundStatement extends BaseBoundStatement<IfStatementSyntax> {
    public constructor(
        public readonly ifPart: IfHeaderBoundNode<IfCommandSyntax>,
        public readonly elseIfParts: ReadonlyArray<IfHeaderBoundNode<ElseIfCommandSyntax>>,
        public readonly elsePart: ReadonlyArray<BaseBoundStatement<BaseStatementSyntax>> | undefined,
        syntax: IfStatementSyntax) {
        super(BoundKind.IfStatement, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode<BaseSyntaxNode>> {
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
        super(BoundKind.WhileStatement, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode<BaseSyntaxNode>> {
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
        super(BoundKind.ForStatement, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode<BaseSyntaxNode>> {
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
        super(BoundKind.LabelStatement, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode<BaseSyntaxNode>> {
        return [];
    }
}

export class GoToBoundStatement extends BaseBoundStatement<GoToCommandSyntax> {
    public constructor(
        public readonly labelName: string,
        syntax: GoToCommandSyntax) {
        super(BoundKind.GoToStatement, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode<BaseSyntaxNode>> {
        return [];
    }
}

export class SubModuleInvocationBoundStatement extends BaseBoundStatement<ExpressionCommandSyntax> {
    public constructor(
        public readonly subModuleName: string,
        syntax: ExpressionCommandSyntax) {
        super(BoundKind.SubModuleInvocationStatement, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode<BaseSyntaxNode>> {
        return [];
    }
}

export class LibraryMethodInvocationBoundStatement extends BaseBoundStatement<ExpressionCommandSyntax> {
    public constructor(
        public readonly libraryName: string,
        public readonly methodName: string,
        public readonly argumentsList: ReadonlyArray<BaseBoundExpression<BaseExpressionSyntax>>,
        syntax: ExpressionCommandSyntax) {
        super(BoundKind.LibraryMethodInvocationStatement, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode<BaseSyntaxNode>> {
        return this.argumentsList;
    }
}

export class VariableAssignmentBoundStatement extends BaseBoundStatement<ExpressionCommandSyntax> {
    public constructor(
        public readonly variableName: string,
        public readonly value: BaseBoundExpression<BaseExpressionSyntax>,
        syntax: ExpressionCommandSyntax) {
        super(BoundKind.VariableAssignmentStatement, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode<BaseSyntaxNode>> {
        return [this.value];
    }
}

export class PropertyAssignmentBoundStatement extends BaseBoundStatement<ExpressionCommandSyntax> {
    public constructor(
        public readonly libraryName: string,
        public readonly propertyName: string,
        public readonly value: BaseBoundExpression<BaseExpressionSyntax>,
        syntax: ExpressionCommandSyntax) {
        super(BoundKind.PropertyAssignmentStatement, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode<BaseSyntaxNode>> {
        return [this.value];
    }
}

export class ArrayAssignmentBoundStatement extends BaseBoundStatement<ExpressionCommandSyntax> {
    public constructor(
        public readonly arrayName: string,
        public readonly indices: ReadonlyArray<BaseBoundExpression<BaseExpressionSyntax>>,
        public readonly value: BaseBoundExpression<BaseExpressionSyntax>,
        syntax: ExpressionCommandSyntax) {
        super(BoundKind.ArrayAssignmentStatement, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode<BaseSyntaxNode>> {
        return [this.value];
    }
}

export class InvalidExpressionBoundStatement extends BaseBoundStatement<ExpressionCommandSyntax> {
    public constructor(
        public readonly expression: BaseBoundExpression<BaseExpressionSyntax>,
        syntax: ExpressionCommandSyntax) {
        super(BoundKind.InvalidExpressionStatement, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode<BaseSyntaxNode>> {
        return [this.expression];
    }
}

export abstract class BaseBoundExpression<TSyntax extends BaseSyntaxNode> extends BaseBoundNode<TSyntax> {
    public constructor(
        public readonly kind: BoundKind,
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
        super(BoundKind.NegationExpression, true, hasErrors, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode<BaseSyntaxNode>> {
        return [this.expression];
    }
}

export class OrBoundExpression extends BaseBoundExpression<BinaryOperatorExpressionSyntax> {
    public constructor(
        public readonly leftExpression: BaseBoundExpression<BaseExpressionSyntax>,
        public readonly rightExpression: BaseBoundExpression<BaseExpressionSyntax>,
        hasErrors: boolean,
        syntax: BinaryOperatorExpressionSyntax) {
        super(BoundKind.OrExpression, true, hasErrors, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode<BaseSyntaxNode>> {
        return [this.leftExpression, this.rightExpression];
    }
}

export class AndBoundExpression extends BaseBoundExpression<BinaryOperatorExpressionSyntax> {
    public constructor(
        public readonly leftExpression: BaseBoundExpression<BaseExpressionSyntax>,
        public readonly rightExpression: BaseBoundExpression<BaseExpressionSyntax>,
        hasErrors: boolean,
        syntax: BinaryOperatorExpressionSyntax) {
        super(BoundKind.AndExpression, true, hasErrors, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode<BaseSyntaxNode>> {
        return [this.leftExpression, this.rightExpression];
    }
}

export class NotEqualBoundExpression extends BaseBoundExpression<BinaryOperatorExpressionSyntax> {
    public constructor(
        public readonly leftExpression: BaseBoundExpression<BaseExpressionSyntax>,
        public readonly rightExpression: BaseBoundExpression<BaseExpressionSyntax>,
        hasErrors: boolean,
        syntax: BinaryOperatorExpressionSyntax) {
        super(BoundKind.NotEqualExpression, true, hasErrors, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode<BaseSyntaxNode>> {
        return [this.leftExpression, this.rightExpression];
    }
}

export class EqualBoundExpression extends BaseBoundExpression<BinaryOperatorExpressionSyntax> {
    public constructor(
        public readonly leftExpression: BaseBoundExpression<BaseExpressionSyntax>,
        public readonly rightExpression: BaseBoundExpression<BaseExpressionSyntax>,
        hasErrors: boolean,
        syntax: BinaryOperatorExpressionSyntax) {
        super(BoundKind.EqualExpression, true, hasErrors, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode<BaseSyntaxNode>> {
        return [this.leftExpression, this.rightExpression];
    }
}

export class LessThanBoundExpression extends BaseBoundExpression<BinaryOperatorExpressionSyntax> {
    public constructor(
        public readonly leftExpression: BaseBoundExpression<BaseExpressionSyntax>,
        public readonly rightExpression: BaseBoundExpression<BaseExpressionSyntax>,
        hasErrors: boolean,
        syntax: BinaryOperatorExpressionSyntax) {
        super(BoundKind.LessThanExpression, true, hasErrors, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode<BaseSyntaxNode>> {
        return [this.leftExpression, this.rightExpression];
    }
}

export class GreaterThanBoundExpression extends BaseBoundExpression<BinaryOperatorExpressionSyntax> {
    public constructor(
        public readonly leftExpression: BaseBoundExpression<BaseExpressionSyntax>,
        public readonly rightExpression: BaseBoundExpression<BaseExpressionSyntax>,
        hasErrors: boolean,
        syntax: BinaryOperatorExpressionSyntax) {
        super(BoundKind.GreaterThanExpression, true, hasErrors, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode<BaseSyntaxNode>> {
        return [this.leftExpression, this.rightExpression];
    }
}

export class LessThanOrEqualBoundExpression extends BaseBoundExpression<BinaryOperatorExpressionSyntax> {
    public constructor(
        public readonly leftExpression: BaseBoundExpression<BaseExpressionSyntax>,
        public readonly rightExpression: BaseBoundExpression<BaseExpressionSyntax>,
        hasErrors: boolean,
        syntax: BinaryOperatorExpressionSyntax) {
        super(BoundKind.LessThanOrEqualExpression, true, hasErrors, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode<BaseSyntaxNode>> {
        return [this.leftExpression, this.rightExpression];
    }
}

export class GreaterThanOrEqualBoundExpression extends BaseBoundExpression<BinaryOperatorExpressionSyntax> {
    public constructor(
        public readonly leftExpression: BaseBoundExpression<BaseExpressionSyntax>,
        public readonly rightExpression: BaseBoundExpression<BaseExpressionSyntax>,
        hasErrors: boolean,
        syntax: BinaryOperatorExpressionSyntax) {
        super(BoundKind.GreaterThanOrEqualExpression, true, hasErrors, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode<BaseSyntaxNode>> {
        return [this.leftExpression, this.rightExpression];
    }
}

export class AdditionBoundExpression extends BaseBoundExpression<BinaryOperatorExpressionSyntax> {
    public constructor(
        public readonly leftExpression: BaseBoundExpression<BaseExpressionSyntax>,
        public readonly rightExpression: BaseBoundExpression<BaseExpressionSyntax>,
        hasErrors: boolean,
        syntax: BinaryOperatorExpressionSyntax) {
        super(BoundKind.AdditionExpression, true, hasErrors, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode<BaseSyntaxNode>> {
        return [this.leftExpression, this.rightExpression];
    }
}

export class SubtractionBoundExpression extends BaseBoundExpression<BinaryOperatorExpressionSyntax> {
    public constructor(
        public readonly leftExpression: BaseBoundExpression<BaseExpressionSyntax>,
        public readonly rightExpression: BaseBoundExpression<BaseExpressionSyntax>,
        hasErrors: boolean,
        syntax: BinaryOperatorExpressionSyntax) {
        super(BoundKind.SubtractionExpression, true, hasErrors, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode<BaseSyntaxNode>> {
        return [this.leftExpression, this.rightExpression];
    }
}

export class MultiplicationBoundExpression extends BaseBoundExpression<BinaryOperatorExpressionSyntax> {
    public constructor(
        public readonly leftExpression: BaseBoundExpression<BaseExpressionSyntax>,
        public readonly rightExpression: BaseBoundExpression<BaseExpressionSyntax>,
        hasErrors: boolean,
        syntax: BinaryOperatorExpressionSyntax) {
        super(BoundKind.MultiplicationExpression, true, hasErrors, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode<BaseSyntaxNode>> {
        return [this.leftExpression, this.rightExpression];
    }
}

export class DivisionBoundExpression extends BaseBoundExpression<BinaryOperatorExpressionSyntax> {
    public constructor(
        public readonly leftExpression: BaseBoundExpression<BaseExpressionSyntax>,
        public readonly rightExpression: BaseBoundExpression<BaseExpressionSyntax>,
        hasErrors: boolean,
        syntax: BinaryOperatorExpressionSyntax) {
        super(BoundKind.DivisionExpression, true, hasErrors, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode<BaseSyntaxNode>> {
        return [this.leftExpression, this.rightExpression];
    }
}

export class ArrayAccessBoundExpression extends BaseBoundExpression<ArrayAccessExpressionSyntax> {
    public constructor(
        public readonly arrayName: string,
        public readonly indices: ReadonlyArray<BaseBoundExpression<BaseExpressionSyntax>>,
        hasErrors: boolean,
        syntax: ArrayAccessExpressionSyntax) {
        super(BoundKind.ArrayAccessExpression, true, hasErrors, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode<BaseSyntaxNode>> {
        return this.indices;
    }
}

export class LibraryTypeBoundExpression extends BaseBoundExpression<IdentifierExpressionSyntax> {
    public constructor(
        public readonly libraryName: string,
        hasErrors: boolean,
        syntax: IdentifierExpressionSyntax) {
        super(BoundKind.LibraryTypeExpression, false, hasErrors, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode<BaseSyntaxNode>> {
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
        super(BoundKind.LibraryPropertyExpression, hasValue, hasErrors, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode<BaseSyntaxNode>> {
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
        super(BoundKind.LibraryMethodExpression, hasValue, hasErrors, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode<BaseSyntaxNode>> {
        return [];
    }
}

export class LibraryMethodInvocationBoundExpression extends BaseBoundExpression<InvocationExpressionSyntax> {
    public constructor(
        public readonly libraryName: string,
        public readonly methodName: string,
        public readonly argumentsList: ReadonlyArray<BaseBoundExpression<BaseExpressionSyntax>>,
        hasValue: boolean,
        hasErrors: boolean,
        syntax: InvocationExpressionSyntax) {
        super(BoundKind.LibraryMethodInvocationExpression, hasValue, hasErrors, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode<BaseSyntaxNode>> {
        return this.argumentsList;
    }
}

export class SubModuleBoundExpression extends BaseBoundExpression<IdentifierExpressionSyntax> {
    public constructor(
        public readonly subModuleName: string,
        hasErrors: boolean,
        syntax: IdentifierExpressionSyntax) {
        super(BoundKind.SubModuleExpression, false, hasErrors, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode<BaseSyntaxNode>> {
        return [];
    }
}

export class SubModuleInvocationBoundExpression extends BaseBoundExpression<InvocationExpressionSyntax> {
    public constructor(
        public readonly subModuleName: string,
        hasErrors: boolean,
        syntax: InvocationExpressionSyntax) {
        super(BoundKind.SubModuleInvocationExpression, false, hasErrors, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode<BaseSyntaxNode>> {
        return [];
    }
}

export class VariableBoundExpression extends BaseBoundExpression<IdentifierExpressionSyntax> {
    public constructor(
        public readonly variableName: string,
        hasErrors: boolean,
        syntax: IdentifierExpressionSyntax) {
        super(BoundKind.VariableExpression, true, hasErrors, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode<BaseSyntaxNode>> {
        return [];
    }
}

export class StringLiteralBoundExpression extends BaseBoundExpression<StringLiteralExpressionSyntax> {
    public constructor(
        public readonly value: string,
        hasErrors: boolean,
        syntax: StringLiteralExpressionSyntax) {
        super(BoundKind.StringLiteralExpression, true, hasErrors, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode<BaseSyntaxNode>> {
        return [];
    }
}

export class NumberLiteralBoundExpression extends BaseBoundExpression<NumberLiteralExpressionSyntax>     {
    public constructor(
        public readonly value: number,
        hasErrors: boolean,
        syntax: NumberLiteralExpressionSyntax) {
        super(BoundKind.NumberLiteralExpression, true, hasErrors, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode<BaseSyntaxNode>> {
        return [];
    }
}

export class ParenthesisBoundExpression extends BaseBoundExpression<ParenthesisExpressionSyntax> {
    public constructor(
        public readonly expression: BaseBoundExpression<BaseExpressionSyntax>,
        hasErrors: boolean,
        syntax: ParenthesisExpressionSyntax) {
        super(BoundKind.ParenthesisExpression, true, hasErrors, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode<BaseSyntaxNode>> {
        return [this.expression];
    }
}
