import { BaseSyntax, IfStatementSyntax, WhileStatementSyntax, ForStatementSyntax, LabelCommandSyntax, GoToCommandSyntax, ExpressionCommandSyntax } from "../../syntax/syntax-nodes";
import { BaseBoundNode } from "./bound-nodes";
import { BaseBoundExpression } from "./expressions";

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

export abstract class BaseBoundStatement<TSyntax extends BaseSyntax> extends BaseBoundNode<TSyntax> {
    public constructor(
        public readonly kind: BoundStatementKind,
        syntax: TSyntax) {
        super(syntax);
    }
}

export interface IfBoundCondition {
    readonly condition: BaseBoundExpression<BaseSyntax>;
    readonly statementsList: ReadonlyArray<BaseBoundStatement<BaseSyntax>>;
}

export interface ElseBoundCondition {
    readonly statementsList: ReadonlyArray<BaseBoundStatement<BaseSyntax>>;
}

export class IfBoundStatement extends BaseBoundStatement<IfStatementSyntax> {
    public constructor(
        public readonly ifPart: IfBoundCondition,
        public readonly elseIfParts: ReadonlyArray<IfBoundCondition>,
        public readonly elsePart: ElseBoundCondition | undefined,
        syntax: IfStatementSyntax) {
        super(BoundStatementKind.If, syntax);
    }
}

export class WhileBoundStatement extends BaseBoundStatement<WhileStatementSyntax> {
    public constructor(
        public readonly condition: BaseBoundExpression<BaseSyntax>,
        public readonly statementsList: ReadonlyArray<BaseBoundStatement<BaseSyntax>>,
        syntax: WhileStatementSyntax) {
        super(BoundStatementKind.While, syntax);
    }
}

export class ForBoundStatement extends BaseBoundStatement<ForStatementSyntax> {
    public constructor(
        public readonly identifier: string,
        public readonly fromExpression: BaseBoundExpression<BaseSyntax>,
        public readonly toExpression: BaseBoundExpression<BaseSyntax>,
        public readonly stepExpression: BaseBoundExpression<BaseSyntax> | undefined,
        public readonly statementsList: ReadonlyArray<BaseBoundStatement<BaseSyntax>>,
        syntax: ForStatementSyntax) {
        super(BoundStatementKind.For, syntax);
    }
}

export class LabelBoundStatement extends BaseBoundStatement<LabelCommandSyntax> {
    public constructor(
        public readonly labelName: string,
        syntax: LabelCommandSyntax) {
        super(BoundStatementKind.Label, syntax);
    }
}

export class GoToBoundStatement extends BaseBoundStatement<GoToCommandSyntax> {
    public constructor(
        public readonly labelName: string,
        syntax: GoToCommandSyntax) {
        super(BoundStatementKind.GoTo, syntax);
    }
}

export class SubModuleCallBoundStatement extends BaseBoundStatement<ExpressionCommandSyntax> {
    public constructor(
        public readonly subModuleName: string,
        syntax: ExpressionCommandSyntax) {
        super(BoundStatementKind.SubModuleCall, syntax);
    }
}

export class LibraryMethodCallBoundStatement extends BaseBoundStatement<ExpressionCommandSyntax> {
    public constructor(
        public readonly libraryName: string,
        public readonly methodName: string,
        public readonly argumentsList: ReadonlyArray<BaseBoundExpression<BaseSyntax>>,
        syntax: ExpressionCommandSyntax) {
        super(BoundStatementKind.LibraryMethodCall, syntax);
    }
}

export class VariableAssignmentBoundStatement extends BaseBoundStatement<ExpressionCommandSyntax> {
    public constructor(
        public readonly variableName: string,
        public readonly value: BaseBoundExpression<BaseSyntax>,
        syntax: ExpressionCommandSyntax) {
        super(BoundStatementKind.VariableAssignment, syntax);
    }
}

export class PropertyAssignmentBoundStatement extends BaseBoundStatement<ExpressionCommandSyntax> {
    public constructor(
        public readonly libraryName: string,
        public readonly propertyName: string,
        public readonly value: BaseBoundExpression<BaseSyntax>,
        syntax: ExpressionCommandSyntax) {
        super(BoundStatementKind.PropertyAssignment, syntax);
    }
}

export class ArrayAssignmentBoundStatement extends BaseBoundStatement<ExpressionCommandSyntax>{
    public constructor(
        public readonly arrayName: string,
        public readonly indices: ReadonlyArray<BaseBoundExpression<BaseSyntax>>,
        public readonly value: BaseBoundExpression<BaseSyntax>,
        syntax: ExpressionCommandSyntax) {
        super(BoundStatementKind.ArrayAssignment, syntax);
    }
}

export class InvalidExpressionBoundStatement extends BaseBoundStatement<ExpressionCommandSyntax> {
    public constructor(
        public readonly expression: BaseBoundExpression<BaseSyntax>,
        syntax: ExpressionCommandSyntax) {
        super(BoundStatementKind.InvalidExpression, syntax);
    }
}
