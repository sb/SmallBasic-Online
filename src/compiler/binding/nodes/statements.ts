import { BaseStatementSyntax, IfStatementSyntax, WhileStatementSyntax, ForStatementSyntax, LabelStatementSyntax, GoToStatementSyntax, ExpressionStatementSyntax } from "../../syntax/nodes/statements";
import { BaseBoundNode } from "./bound-nodes";
import { BaseBoundExpression } from "./expressions";
import { BaseExpressionSyntax } from "../../syntax/nodes/expressions";

export enum BoundStatementKind {
    If,
    While,
    For,
    Label,
    GoTo,
    SubModuleCall,
    LibraryMethodCall,
    VariableAssignment,
    PropertyAssignment,
    ArrayAssignment,
    InvalidExpression
}

export abstract class BaseBoundStatement<TSyntax extends BaseStatementSyntax> extends BaseBoundNode<TSyntax> {
    public constructor(
        public readonly kind: BoundStatementKind,
        syntax: TSyntax) {
        super(syntax);
    }
}

export interface IfBoundCondition {
    readonly condition: BaseBoundExpression<BaseExpressionSyntax>;
    readonly statementsList: BaseBoundStatement<BaseStatementSyntax>[];
}

export interface ElseBoundCondition {
    readonly statementsList: BaseBoundStatement<BaseStatementSyntax>[];
}

export class IfBoundStatement extends BaseBoundStatement<IfStatementSyntax> {
    public constructor(
        public readonly ifPart: IfBoundCondition,
        public readonly elseIfParts: IfBoundCondition[],
        public readonly elsePart: ElseBoundCondition | undefined,
        syntax: IfStatementSyntax) {
        super(BoundStatementKind.If, syntax);
    }
}

export class WhileBoundStatement extends BaseBoundStatement<WhileStatementSyntax> {
    public constructor(
        public readonly condition: BaseBoundExpression<BaseExpressionSyntax>,
        public readonly statementsList: BaseBoundStatement<BaseStatementSyntax>[],
        syntax: WhileStatementSyntax) {
        super(BoundStatementKind.While, syntax);
    }
}

export class ForBoundStatement extends BaseBoundStatement<ForStatementSyntax> {
    public constructor(
        public readonly identifier: string,
        public readonly fromExpression: BaseBoundExpression<BaseExpressionSyntax>,
        public readonly toExpression: BaseBoundExpression<BaseExpressionSyntax>,
        public readonly stepExpression: BaseBoundExpression<BaseExpressionSyntax> | undefined,
        public readonly statementsList: BaseBoundStatement<BaseStatementSyntax>[],
        syntax: ForStatementSyntax) {
        super(BoundStatementKind.For, syntax);
    }
}

export class LabelBoundStatement extends BaseBoundStatement<LabelStatementSyntax> {
    public constructor(
        public readonly labelName: string,
        syntax: LabelStatementSyntax) {
        super(BoundStatementKind.Label, syntax);
    }
}

export class GoToBoundStatement extends BaseBoundStatement<GoToStatementSyntax> {
    public constructor(
        public readonly labelName: string,
        syntax: GoToStatementSyntax) {
        super(BoundStatementKind.GoTo, syntax);
    }
}

export class SubModuleCallBoundStatement extends BaseBoundStatement<ExpressionStatementSyntax> {
    public constructor(
        public readonly subModuleName: string,
        syntax: ExpressionStatementSyntax) {
        super(BoundStatementKind.SubModuleCall, syntax);
    }
}

export class LibraryMethodCallBoundStatement extends BaseBoundStatement<ExpressionStatementSyntax> {
    public constructor(
        public readonly libraryName: string,
        public readonly methodName: string,
        public readonly argumentsList: BaseBoundExpression<BaseExpressionSyntax>[],
        syntax: ExpressionStatementSyntax) {
        super(BoundStatementKind.LibraryMethodCall, syntax);
    }
}

export class VariableAssignmentBoundStatement extends BaseBoundStatement<ExpressionStatementSyntax> {
    public constructor(
        public readonly variableName: string,
        public readonly value: BaseBoundExpression<BaseExpressionSyntax>,
        syntax: ExpressionStatementSyntax) {
        super(BoundStatementKind.VariableAssignment, syntax);
    }
}

export class PropertyAssignmentBoundStatement extends BaseBoundStatement<ExpressionStatementSyntax> {
    public constructor(
        public readonly libraryName: string,
        public readonly propertyName: string,
        public readonly value: BaseBoundExpression<BaseExpressionSyntax>,
        syntax: ExpressionStatementSyntax) {
        super(BoundStatementKind.PropertyAssignment, syntax);
    }
}

export class ArrayAssignmentBoundStatement extends BaseBoundStatement<ExpressionStatementSyntax>{
    public constructor(
        public readonly arrayName: string,
        public readonly indices: BaseBoundExpression<BaseExpressionSyntax>[],
        public readonly value: BaseBoundExpression<BaseExpressionSyntax>,
        syntax: ExpressionStatementSyntax) {
        super(BoundStatementKind.ArrayAssignment, syntax);
    }
}

export class InvalidExpressionBoundStatement extends BaseBoundStatement<ExpressionStatementSyntax> {
    public constructor(
        public readonly expression: BaseBoundExpression<BaseExpressionSyntax>,
        syntax: ExpressionStatementSyntax) {
        super(BoundStatementKind.InvalidExpression, syntax);
    }
}
