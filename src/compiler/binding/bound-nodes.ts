import { BaseSyntaxNode } from "../syntax/syntax-nodes";

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

export abstract class BaseBoundNode {
    public constructor(
        public readonly kind: BoundKind,
        public readonly syntax: BaseSyntaxNode) {
    }

    public abstract children(): ReadonlyArray<BaseBoundNode>;
}

export abstract class BaseBoundStatement extends BaseBoundNode {
}

export class IfHeaderBoundNode extends BaseBoundNode {
    public constructor(
        public readonly condition: BaseBoundExpression,
        public readonly statementsList: ReadonlyArray<BaseBoundStatement>,
        syntax: BaseSyntaxNode) {
        super(BoundKind.IfHeaderStatement, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode> {
        return [this.condition, ...this.statementsList];
    }
}

export class IfBoundStatement extends BaseBoundStatement {
    public constructor(
        public readonly ifPart: IfHeaderBoundNode,
        public readonly elseIfParts: ReadonlyArray<IfHeaderBoundNode>,
        public readonly elsePart: ReadonlyArray<BaseBoundStatement> | undefined,
        syntax: BaseSyntaxNode) {
        super(BoundKind.IfStatement, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode> {
        return this.elsePart
            ? [this.ifPart, ...this.elseIfParts, ...this.elsePart]
            : [this.ifPart, ...this.elseIfParts];
    }
}

export class WhileBoundStatement extends BaseBoundStatement {
    public constructor(
        public readonly condition: BaseBoundExpression,
        public readonly statementsList: ReadonlyArray<BaseBoundStatement>,
        syntax: BaseSyntaxNode) {
        super(BoundKind.WhileStatement, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode> {
        return [this.condition, ...this.statementsList];
    }
}

export class ForBoundStatement extends BaseBoundStatement {
    public constructor(
        public readonly identifier: string,
        public readonly fromExpression: BaseBoundExpression,
        public readonly toExpression: BaseBoundExpression,
        public readonly stepExpression: BaseBoundExpression | undefined,
        public readonly statementsList: ReadonlyArray<BaseBoundStatement>,
        syntax: BaseSyntaxNode) {
        super(BoundKind.ForStatement, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode> {
        const children = [this.fromExpression, this.toExpression];
        if (this.stepExpression) {
            children.push(this.stepExpression);
        }
        children.push.apply(children);
        return children;
    }
}

export class LabelBoundStatement extends BaseBoundStatement {
    public constructor(
        public readonly labelName: string,
        syntax: BaseSyntaxNode) {
        super(BoundKind.LabelStatement, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode> {
        return [];
    }
}

export class GoToBoundStatement extends BaseBoundStatement {
    public constructor(
        public readonly labelName: string,
        syntax: BaseSyntaxNode) {
        super(BoundKind.GoToStatement, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode> {
        return [];
    }
}

export class SubModuleInvocationBoundStatement extends BaseBoundStatement {
    public constructor(
        public readonly subModuleName: string,
        syntax: BaseSyntaxNode) {
        super(BoundKind.SubModuleInvocationStatement, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode> {
        return [];
    }
}

export class LibraryMethodInvocationBoundStatement extends BaseBoundStatement {
    public constructor(
        public readonly libraryName: string,
        public readonly methodName: string,
        public readonly argumentsList: ReadonlyArray<BaseBoundExpression>,
        syntax: BaseSyntaxNode) {
        super(BoundKind.LibraryMethodInvocationStatement, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode> {
        return this.argumentsList;
    }
}

export class VariableAssignmentBoundStatement extends BaseBoundStatement {
    public constructor(
        public readonly variableName: string,
        public readonly value: BaseBoundExpression,
        syntax: BaseSyntaxNode) {
        super(BoundKind.VariableAssignmentStatement, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode> {
        return [this.value];
    }
}

export class PropertyAssignmentBoundStatement extends BaseBoundStatement {
    public constructor(
        public readonly libraryName: string,
        public readonly propertyName: string,
        public readonly value: BaseBoundExpression,
        syntax: BaseSyntaxNode) {
        super(BoundKind.PropertyAssignmentStatement, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode> {
        return [this.value];
    }
}

export class ArrayAssignmentBoundStatement extends BaseBoundStatement {
    public constructor(
        public readonly arrayName: string,
        public readonly indices: ReadonlyArray<BaseBoundExpression>,
        public readonly value: BaseBoundExpression,
        syntax: BaseSyntaxNode) {
        super(BoundKind.ArrayAssignmentStatement, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode> {
        return [this.value];
    }
}

export class InvalidExpressionBoundStatement extends BaseBoundStatement {
    public constructor(
        public readonly expression: BaseBoundExpression,
        syntax: BaseSyntaxNode) {
        super(BoundKind.InvalidExpressionStatement, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode> {
        return [this.expression];
    }
}

export abstract class BaseBoundExpression extends BaseBoundNode {
    public constructor(
        public readonly kind: BoundKind,
        public readonly hasValue: boolean,
        public readonly hasErrors: boolean,
        syntax: BaseSyntaxNode) {
        super(kind, syntax);
    }
}

export class NegationBoundExpression extends BaseBoundExpression {
    public constructor(
        public readonly expression: BaseBoundExpression,
        hasErrors: boolean,
        syntax: BaseSyntaxNode) {
        super(BoundKind.NegationExpression, true, hasErrors, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode> {
        return [this.expression];
    }
}

export class OrBoundExpression extends BaseBoundExpression {
    public constructor(
        public readonly leftExpression: BaseBoundExpression,
        public readonly rightExpression: BaseBoundExpression,
        hasErrors: boolean,
        syntax: BaseSyntaxNode) {
        super(BoundKind.OrExpression, true, hasErrors, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode> {
        return [this.leftExpression, this.rightExpression];
    }
}

export class AndBoundExpression extends BaseBoundExpression {
    public constructor(
        public readonly leftExpression: BaseBoundExpression,
        public readonly rightExpression: BaseBoundExpression,
        hasErrors: boolean,
        syntax: BaseSyntaxNode) {
        super(BoundKind.AndExpression, true, hasErrors, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode> {
        return [this.leftExpression, this.rightExpression];
    }
}

export class NotEqualBoundExpression extends BaseBoundExpression {
    public constructor(
        public readonly leftExpression: BaseBoundExpression,
        public readonly rightExpression: BaseBoundExpression,
        hasErrors: boolean,
        syntax: BaseSyntaxNode) {
        super(BoundKind.NotEqualExpression, true, hasErrors, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode> {
        return [this.leftExpression, this.rightExpression];
    }
}

export class EqualBoundExpression extends BaseBoundExpression {
    public constructor(
        public readonly leftExpression: BaseBoundExpression,
        public readonly rightExpression: BaseBoundExpression,
        hasErrors: boolean,
        syntax: BaseSyntaxNode) {
        super(BoundKind.EqualExpression, true, hasErrors, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode> {
        return [this.leftExpression, this.rightExpression];
    }
}

export class LessThanBoundExpression extends BaseBoundExpression {
    public constructor(
        public readonly leftExpression: BaseBoundExpression,
        public readonly rightExpression: BaseBoundExpression,
        hasErrors: boolean,
        syntax: BaseSyntaxNode) {
        super(BoundKind.LessThanExpression, true, hasErrors, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode> {
        return [this.leftExpression, this.rightExpression];
    }
}

export class GreaterThanBoundExpression extends BaseBoundExpression {
    public constructor(
        public readonly leftExpression: BaseBoundExpression,
        public readonly rightExpression: BaseBoundExpression,
        hasErrors: boolean,
        syntax: BaseSyntaxNode) {
        super(BoundKind.GreaterThanExpression, true, hasErrors, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode> {
        return [this.leftExpression, this.rightExpression];
    }
}

export class LessThanOrEqualBoundExpression extends BaseBoundExpression {
    public constructor(
        public readonly leftExpression: BaseBoundExpression,
        public readonly rightExpression: BaseBoundExpression,
        hasErrors: boolean,
        syntax: BaseSyntaxNode) {
        super(BoundKind.LessThanOrEqualExpression, true, hasErrors, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode> {
        return [this.leftExpression, this.rightExpression];
    }
}

export class GreaterThanOrEqualBoundExpression extends BaseBoundExpression {
    public constructor(
        public readonly leftExpression: BaseBoundExpression,
        public readonly rightExpression: BaseBoundExpression,
        hasErrors: boolean,
        syntax: BaseSyntaxNode) {
        super(BoundKind.GreaterThanOrEqualExpression, true, hasErrors, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode> {
        return [this.leftExpression, this.rightExpression];
    }
}

export class AdditionBoundExpression extends BaseBoundExpression {
    public constructor(
        public readonly leftExpression: BaseBoundExpression,
        public readonly rightExpression: BaseBoundExpression,
        hasErrors: boolean,
        syntax: BaseSyntaxNode) {
        super(BoundKind.AdditionExpression, true, hasErrors, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode> {
        return [this.leftExpression, this.rightExpression];
    }
}

export class SubtractionBoundExpression extends BaseBoundExpression {
    public constructor(
        public readonly leftExpression: BaseBoundExpression,
        public readonly rightExpression: BaseBoundExpression,
        hasErrors: boolean,
        syntax: BaseSyntaxNode) {
        super(BoundKind.SubtractionExpression, true, hasErrors, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode> {
        return [this.leftExpression, this.rightExpression];
    }
}

export class MultiplicationBoundExpression extends BaseBoundExpression {
    public constructor(
        public readonly leftExpression: BaseBoundExpression,
        public readonly rightExpression: BaseBoundExpression,
        hasErrors: boolean,
        syntax: BaseSyntaxNode) {
        super(BoundKind.MultiplicationExpression, true, hasErrors, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode> {
        return [this.leftExpression, this.rightExpression];
    }
}

export class DivisionBoundExpression extends BaseBoundExpression {
    public constructor(
        public readonly leftExpression: BaseBoundExpression,
        public readonly rightExpression: BaseBoundExpression,
        hasErrors: boolean,
        syntax: BaseSyntaxNode) {
        super(BoundKind.DivisionExpression, true, hasErrors, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode> {
        return [this.leftExpression, this.rightExpression];
    }
}

export class ArrayAccessBoundExpression extends BaseBoundExpression {
    public constructor(
        public readonly arrayName: string,
        public readonly indices: ReadonlyArray<BaseBoundExpression>,
        hasErrors: boolean,
        syntax: BaseSyntaxNode) {
        super(BoundKind.ArrayAccessExpression, true, hasErrors, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode> {
        return this.indices;
    }
}

export class LibraryTypeBoundExpression extends BaseBoundExpression {
    public constructor(
        public readonly libraryName: string,
        hasErrors: boolean,
        syntax: BaseSyntaxNode) {
        super(BoundKind.LibraryTypeExpression, false, hasErrors, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode> {
        return [];
    }
}

export class LibraryPropertyBoundExpression extends BaseBoundExpression {
    public constructor(
        public readonly libraryName: string,
        public readonly propertyName: string,
        hasValue: boolean,
        hasErrors: boolean,
        syntax: BaseSyntaxNode) {
        super(BoundKind.LibraryPropertyExpression, hasValue, hasErrors, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode> {
        return [];
    }
}

export class LibraryMethodBoundExpression extends BaseBoundExpression {
    public constructor(
        public readonly libraryName: string,
        public readonly methodName: string,
        hasValue: boolean,
        hasErrors: boolean,
        syntax: BaseSyntaxNode) {
        super(BoundKind.LibraryMethodExpression, hasValue, hasErrors, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode> {
        return [];
    }
}

export class LibraryMethodInvocationBoundExpression extends BaseBoundExpression {
    public constructor(
        public readonly libraryName: string,
        public readonly methodName: string,
        public readonly argumentsList: ReadonlyArray<BaseBoundExpression>,
        hasValue: boolean,
        hasErrors: boolean,
        syntax: BaseSyntaxNode) {
        super(BoundKind.LibraryMethodInvocationExpression, hasValue, hasErrors, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode> {
        return this.argumentsList;
    }
}

export class SubModuleBoundExpression extends BaseBoundExpression {
    public constructor(
        public readonly subModuleName: string,
        hasErrors: boolean,
        syntax: BaseSyntaxNode) {
        super(BoundKind.SubModuleExpression, false, hasErrors, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode> {
        return [];
    }
}

export class SubModuleInvocationBoundExpression extends BaseBoundExpression {
    public constructor(
        public readonly subModuleName: string,
        hasErrors: boolean,
        syntax: BaseSyntaxNode) {
        super(BoundKind.SubModuleInvocationExpression, false, hasErrors, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode> {
        return [];
    }
}

export class VariableBoundExpression extends BaseBoundExpression {
    public constructor(
        public readonly variableName: string,
        hasErrors: boolean,
        syntax: BaseSyntaxNode) {
        super(BoundKind.VariableExpression, true, hasErrors, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode> {
        return [];
    }
}

export class StringLiteralBoundExpression extends BaseBoundExpression {
    public constructor(
        public readonly value: string,
        hasErrors: boolean,
        syntax: BaseSyntaxNode) {
        super(BoundKind.StringLiteralExpression, true, hasErrors, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode> {
        return [];
    }
}

export class NumberLiteralBoundExpression extends BaseBoundExpression     {
    public constructor(
        public readonly value: number,
        hasErrors: boolean,
        syntax: BaseSyntaxNode) {
        super(BoundKind.NumberLiteralExpression, true, hasErrors, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode> {
        return [];
    }
}

export class ParenthesisBoundExpression extends BaseBoundExpression {
    public constructor(
        public readonly expression: BaseBoundExpression,
        hasErrors: boolean,
        syntax: BaseSyntaxNode) {
        super(BoundKind.ParenthesisExpression, true, hasErrors, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode> {
        return [this.expression];
    }
}
