import { BaseSyntaxNode } from "../syntax/syntax-nodes";
import { RuntimeLibraries } from "../runtime/libraries";

export enum BoundKind {
    // Statements
    StatementBlock,
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

export class BoundStatementBlock extends BaseBoundStatement {
    public constructor(
        public readonly statements: ReadonlyArray<BaseBoundStatement>,
        syntax: BaseSyntaxNode) {
        super(BoundKind.StatementBlock, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode> {
        return this.statements;
    }
}

export class BoundIfHeaderStatement extends BaseBoundNode {
    public constructor(
        public readonly condition: BaseBoundExpression,
        public readonly block: BoundStatementBlock,
        syntax: BaseSyntaxNode) {
        super(BoundKind.IfHeaderStatement, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode> {
        return [this.condition, this.block];
    }
}

export class BoundIfStatement extends BaseBoundStatement {
    public constructor(
        public readonly ifPart: BoundIfHeaderStatement,
        public readonly elseIfParts: ReadonlyArray<BoundIfHeaderStatement>,
        public readonly elsePart: BoundStatementBlock | undefined,
        syntax: BaseSyntaxNode) {
        super(BoundKind.IfStatement, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode> {
        return this.elsePart
            ? [this.ifPart, ...this.elseIfParts, this.elsePart]
            : [this.ifPart, ...this.elseIfParts];
    }
}

export class BoundWhileStatement extends BaseBoundStatement {
    public constructor(
        public readonly condition: BaseBoundExpression,
        public readonly block: BoundStatementBlock,
        syntax: BaseSyntaxNode) {
        super(BoundKind.WhileStatement, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode> {
        return [this.condition, this.block];
    }
}

export class BoundForStatement extends BaseBoundStatement {
    public constructor(
        public readonly identifier: string,
        public readonly fromExpression: BaseBoundExpression,
        public readonly toExpression: BaseBoundExpression,
        public readonly stepExpression: BaseBoundExpression | undefined,
        public readonly block: BoundStatementBlock,
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

export class BoundLabelStatement extends BaseBoundStatement {
    public constructor(
        public readonly labelName: string,
        syntax: BaseSyntaxNode) {
        super(BoundKind.LabelStatement, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode> {
        return [];
    }
}

export class BoundGoToStatement extends BaseBoundStatement {
    public constructor(
        public readonly labelName: string,
        syntax: BaseSyntaxNode) {
        super(BoundKind.GoToStatement, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode> {
        return [];
    }
}

export class BoundSubModuleInvocationStatement extends BaseBoundStatement {
    public constructor(
        public readonly subModuleName: string,
        syntax: BaseSyntaxNode) {
        super(BoundKind.SubModuleInvocationStatement, syntax);
    }

    public children(): ReadonlyArray<BaseBoundNode> {
        return [];
    }
}

export class BoundLibraryMethodInvocationStatement extends BaseBoundStatement {
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

export class BoundVariableAssignmentStatement extends BaseBoundStatement {
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

export class BoundPropertyAssignmentStatement extends BaseBoundStatement {
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

export class BoundArrayAssignmentStatement extends BaseBoundStatement {
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

export class BoundInvalidExpressionStatement extends BaseBoundStatement {
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

export class BoundNegationExpression extends BaseBoundExpression {
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

export class BoundOrExpression extends BaseBoundExpression {
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

export class BoundAndExpression extends BaseBoundExpression {
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

export class BoundNotEqualExpression extends BaseBoundExpression {
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

export class BoundEqualExpression extends BaseBoundExpression {
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

export class BoundLessThanExpression extends BaseBoundExpression {
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

export class BoundGreaterThanExpression extends BaseBoundExpression {
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

export class BoundLessThanOrEqualExpression extends BaseBoundExpression {
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

export class BoundGreaterThanOrEqualExpression extends BaseBoundExpression {
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

export class BoundAdditionExpression extends BaseBoundExpression {
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

export class BoundSubtractionExpression extends BaseBoundExpression {
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

export class BoundMultiplicationExpression extends BaseBoundExpression {
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

export class BoundDivisionExpression extends BaseBoundExpression {
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

export class BoundArrayAccessExpression extends BaseBoundExpression {
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

export class BoundLibraryTypeExpression extends BaseBoundExpression {
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

export class BoundLibraryPropertyExpression extends BaseBoundExpression {
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

export class BoundLibraryMethodExpression extends BaseBoundExpression {
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

export class BoundLibraryMethodInvocationExpression extends BaseBoundExpression {
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

export class BoundSubModuleExpression extends BaseBoundExpression {
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

export class BoundSubModuleInvocationExpression extends BaseBoundExpression {
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

export class BoundVariableExpression extends BaseBoundExpression {
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

export class BoundStringLiteralExpression extends BaseBoundExpression {
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

export class BoundNumberLiteralExpression extends BaseBoundExpression {
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

export class BoundParenthesisExpression extends BaseBoundExpression {
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

export class BoundNodeRewriter {
    public rewrite(node: BaseBoundNode): BaseBoundNode {
        switch (node.kind) {
            case BoundKind.StatementBlock: return this.rewriteStatementBlock(node as BoundStatementBlock);
            case BoundKind.IfHeaderStatement: return this.rewriteIfHeaderStatement(node as BoundIfHeaderStatement);
            case BoundKind.IfStatement: return this.rewriteIfStatement(node as BoundIfStatement);
            case BoundKind.WhileStatement: return this.rewriteWhileStatement(node as BoundWhileStatement);
            case BoundKind.ForStatement: return this.rewriteForStatement(node as BoundForStatement);
            case BoundKind.LabelStatement: return this.rewriteLabelStatement(node as BoundLabelStatement);
            case BoundKind.GoToStatement: return this.rewriteGoToStatement(node as BoundGoToStatement);
            case BoundKind.SubModuleInvocationStatement: return this.rewriteSubModuleInvocationStatement(node as BoundSubModuleInvocationStatement);
            case BoundKind.LibraryMethodInvocationStatement: return this.rewriteLibraryMethodInvocationStatement(node as BoundLibraryMethodInvocationStatement);
            case BoundKind.VariableAssignmentStatement: return this.rewriteVariableAssignmentStatement(node as BoundVariableAssignmentStatement);
            case BoundKind.PropertyAssignmentStatement: return this.rewritePropertyAssignmentStatement(node as BoundPropertyAssignmentStatement);
            case BoundKind.ArrayAssignmentStatement: return this.rewriteArrayAssignmentStatement(node as BoundArrayAssignmentStatement);
            case BoundKind.InvalidExpressionStatement: return this.rewriteInvalidExpressionStatement(node as BoundInvalidExpressionStatement);
            case BoundKind.NegationExpression: return this.rewriteNegationExpression(node as BoundNegationExpression);
            case BoundKind.OrExpression: return this.rewriteOrExpression(node as BoundOrExpression);
            case BoundKind.AndExpression: return this.rewriteAndExpression(node as BoundAndExpression);
            case BoundKind.NotEqualExpression: return this.rewriteNotEqualExpression(node as BoundNotEqualExpression);
            case BoundKind.EqualExpression: return this.rewriteEqualExpression(node as BoundEqualExpression);
            case BoundKind.LessThanExpression: return this.rewriteLessThanExpression(node as BoundLessThanExpression);
            case BoundKind.GreaterThanExpression: return this.rewriteGreaterThanExpression(node as BoundGreaterThanExpression);
            case BoundKind.LessThanOrEqualExpression: return this.rewriteLessThanOrEqualExpression(node as BoundLessThanOrEqualExpression);
            case BoundKind.GreaterThanOrEqualExpression: return this.rewriteGreaterThanOrEqualExpression(node as BoundGreaterThanOrEqualExpression);
            case BoundKind.AdditionExpression: return this.rewriteAdditionExpression(node as BoundAdditionExpression);
            case BoundKind.SubtractionExpression: return this.rewriteSubtractionExpression(node as BoundSubtractionExpression);
            case BoundKind.MultiplicationExpression: return this.rewriteMultiplicationExpression(node as BoundMultiplicationExpression);
            case BoundKind.DivisionExpression: return this.rewriteDivisionExpression(node as BoundDivisionExpression);
            case BoundKind.ArrayAccessExpression: return this.rewriteArrayAccessExpression(node as BoundArrayAccessExpression);
            case BoundKind.LibraryTypeExpression: return this.rewriteLibraryTypeExpression(node as BoundLibraryTypeExpression);
            case BoundKind.LibraryPropertyExpression: return this.rewriteLibraryPropertyExpression(node as BoundLibraryPropertyExpression);
            case BoundKind.LibraryMethodExpression: return this.rewriteLibraryMethodExpression(node as BoundLibraryMethodExpression);
            case BoundKind.LibraryMethodInvocationExpression: return this.rewriteLibraryMethodInvocationExpression(node as BoundLibraryMethodInvocationExpression);
            case BoundKind.SubModuleExpression: return this.rewriteSubModuleExpression(node as BoundSubModuleExpression);
            case BoundKind.SubModuleInvocationExpression: return this.rewriteSubModuleInvocationExpression(node as BoundSubModuleInvocationExpression);
            case BoundKind.VariableExpression: return this.rewriteVariableExpression(node as BoundVariableExpression);
            case BoundKind.StringLiteralExpression: return this.rewriteStringLiteralExpression(node as BoundStringLiteralExpression);
            case BoundKind.NumberLiteralExpression: return this.rewriteNumberLiteralExpression(node as BoundNumberLiteralExpression);
            case BoundKind.ParenthesisExpression: return this.rewriteParenthesisExpression(node as BoundParenthesisExpression);
        }
    }

    public rewriteStatementBlock(node: BoundStatementBlock): BaseBoundNode {
        return new BoundStatementBlock(
            node.statements.map(statement => this.rewrite(statement) as BaseBoundStatement),
            node.syntax);
    }

    public rewriteIfHeaderStatement(node: BoundIfHeaderStatement): BaseBoundNode {
        return new BoundIfHeaderStatement(
            this.rewrite(node.condition) as BaseBoundExpression,
            this.rewrite(node.block) as BoundStatementBlock,
            node.syntax);
    }

    public rewriteIfStatement(node: BoundIfStatement): BaseBoundNode {
        return new BoundIfStatement(
            this.rewrite(node.ifPart) as BoundIfHeaderStatement,
            node.elseIfParts.map(part => this.rewrite(part) as BoundIfHeaderStatement),
            node.elsePart ? this.rewrite(node.elsePart) as BoundStatementBlock : undefined,
            node.syntax);
    }

    public rewriteWhileStatement(node: BoundWhileStatement): BaseBoundNode {
        return new BoundWhileStatement(
            this.rewrite(node.condition) as BaseBoundExpression,
            this.rewrite(node.block) as BoundStatementBlock,
            node.syntax);
    }

    public rewriteForStatement(node: BoundForStatement): BaseBoundNode {
        return new BoundForStatement(
            node.identifier,
            this.rewrite(node.fromExpression) as BaseBoundExpression,
            this.rewrite(node.toExpression) as BaseBoundExpression,
            node.stepExpression ? this.rewrite(node.stepExpression) as BaseBoundExpression : undefined,
            this.rewrite(node.block) as BoundStatementBlock,
            node.syntax);
    }

    public rewriteLabelStatement(node: BoundLabelStatement): BaseBoundNode {
        return node;
    }

    public rewriteGoToStatement(node: BoundGoToStatement): BaseBoundNode {
        return node;
    }

    public rewriteSubModuleInvocationStatement(node: BoundSubModuleInvocationStatement): BaseBoundNode {
        return node;
    }

    public rewriteLibraryMethodInvocationStatement(node: BoundLibraryMethodInvocationStatement): BaseBoundNode {
        return new BoundLibraryMethodInvocationStatement(
            node.libraryName,
            node.methodName,
            node.argumentsList.map(arg => this.rewrite(arg) as BaseBoundExpression),
            node.syntax);
    }

    public rewriteVariableAssignmentStatement(node: BoundVariableAssignmentStatement): BaseBoundNode {
        return new BoundVariableAssignmentStatement(
            node.variableName,
            this.rewrite(node.value) as BaseBoundExpression,
            node.syntax);
    }

    public rewritePropertyAssignmentStatement(node: BoundPropertyAssignmentStatement): BaseBoundNode {
        return new BoundPropertyAssignmentStatement(
            node.libraryName,
            node.propertyName,
            this.rewrite(node.value) as BaseBoundExpression,
            node.syntax);
    }

    public rewriteArrayAssignmentStatement(node: BoundArrayAssignmentStatement): BaseBoundNode {
        return new BoundArrayAssignmentStatement(
            node.arrayName,
            node.indices.map(index => this.rewrite(index) as BaseBoundExpression),
            this.rewrite(node.value) as BaseBoundExpression,
            node.syntax);
    }

    public rewriteInvalidExpressionStatement(node: BoundInvalidExpressionStatement): BaseBoundNode {
        return new BoundInvalidExpressionStatement(
            this.rewrite(node.expression) as BaseBoundExpression,
            node.syntax);
    }

    public rewriteNegationExpression(node: BoundNegationExpression): BaseBoundNode {
        return new BoundNegationExpression(
            this.rewrite(node.expression) as BaseBoundExpression,
            node.hasErrors,
            node.syntax);
    }

    public rewriteOrExpression(node: BoundOrExpression): BaseBoundNode {
        return new BoundOrExpression(
            this.rewrite(node.leftExpression) as BaseBoundExpression,
            this.rewrite(node.rightExpression) as BaseBoundExpression,
            node.hasErrors,
            node.syntax);
    }

    public rewriteAndExpression(node: BoundAndExpression): BaseBoundNode {
        return new BoundAndExpression(
            this.rewrite(node.leftExpression) as BaseBoundExpression,
            this.rewrite(node.rightExpression) as BaseBoundExpression,
            node.hasErrors,
            node.syntax);
    }

    public rewriteNotEqualExpression(node: BoundNotEqualExpression): BaseBoundNode {
        return new BoundNotEqualExpression(
            this.rewrite(node.leftExpression) as BaseBoundExpression,
            this.rewrite(node.rightExpression) as BaseBoundExpression,
            node.hasErrors,
            node.syntax);
    }

    public rewriteEqualExpression(node: BoundEqualExpression): BaseBoundNode {
        return new BoundEqualExpression(
            this.rewrite(node.leftExpression) as BaseBoundExpression,
            this.rewrite(node.rightExpression) as BaseBoundExpression,
            node.hasErrors,
            node.syntax);
    }

    public rewriteLessThanExpression(node: BoundLessThanExpression): BaseBoundNode {
        return new BoundLessThanExpression(
            this.rewrite(node.leftExpression) as BaseBoundExpression,
            this.rewrite(node.rightExpression) as BaseBoundExpression,
            node.hasErrors,
            node.syntax);
    }

    public rewriteGreaterThanExpression(node: BoundGreaterThanExpression): BaseBoundNode {
        return new BoundGreaterThanExpression(
            this.rewrite(node.leftExpression) as BaseBoundExpression,
            this.rewrite(node.rightExpression) as BaseBoundExpression,
            node.hasErrors,
            node.syntax);
    }

    public rewriteLessThanOrEqualExpression(node: BoundLessThanOrEqualExpression): BaseBoundNode {
        return new BoundLessThanOrEqualExpression(
            this.rewrite(node.leftExpression) as BaseBoundExpression,
            this.rewrite(node.rightExpression) as BaseBoundExpression,
            node.hasErrors,
            node.syntax);
    }

    public rewriteGreaterThanOrEqualExpression(node: BoundGreaterThanOrEqualExpression): BaseBoundNode {
        return new BoundGreaterThanOrEqualExpression(
            this.rewrite(node.leftExpression) as BaseBoundExpression,
            this.rewrite(node.rightExpression) as BaseBoundExpression,
            node.hasErrors,
            node.syntax);
    }

    public rewriteAdditionExpression(node: BoundAdditionExpression): BaseBoundNode {
        return new BoundAdditionExpression(
            this.rewrite(node.leftExpression) as BaseBoundExpression,
            this.rewrite(node.rightExpression) as BaseBoundExpression,
            node.hasErrors,
            node.syntax);
    }

    public rewriteSubtractionExpression(node: BoundSubtractionExpression): BaseBoundNode {
        return new BoundSubtractionExpression(
            this.rewrite(node.leftExpression) as BaseBoundExpression,
            this.rewrite(node.rightExpression) as BaseBoundExpression,
            node.hasErrors,
            node.syntax);
    }

    public rewriteMultiplicationExpression(node: BoundMultiplicationExpression): BaseBoundNode {
        return new BoundMultiplicationExpression(
            this.rewrite(node.leftExpression) as BaseBoundExpression,
            this.rewrite(node.rightExpression) as BaseBoundExpression,
            node.hasErrors,
            node.syntax);
    }

    public rewriteDivisionExpression(node: BoundDivisionExpression): BaseBoundNode {
        return new BoundDivisionExpression(
            this.rewrite(node.leftExpression) as BaseBoundExpression,
            this.rewrite(node.rightExpression) as BaseBoundExpression,
            node.hasErrors,
            node.syntax);
    }

    public rewriteArrayAccessExpression(node: BoundArrayAccessExpression): BaseBoundNode {
        return new BoundArrayAccessExpression(
            node.arrayName,
            node.indices.map(index => this.rewrite(index) as BaseBoundExpression),
            node.hasErrors,
            node.syntax);
    }

    public rewriteLibraryTypeExpression(node: BoundLibraryTypeExpression): BaseBoundNode {
        return node;
    }

    public rewriteLibraryPropertyExpression(node: BoundLibraryPropertyExpression): BaseBoundNode {
        return node;
    }

    public rewriteLibraryMethodExpression(node: BoundLibraryMethodExpression): BaseBoundNode {
        return node;
    }

    public rewriteLibraryMethodInvocationExpression(node: BoundLibraryMethodInvocationExpression): BaseBoundNode {
        return new BoundLibraryMethodInvocationExpression(
            node.libraryName,
            node.methodName,
            node.argumentsList.map(arg => this.rewrite(arg) as BaseBoundExpression),
            node.hasValue,
            node.hasErrors,
            node.syntax);
    }

    public rewriteSubModuleExpression(node: BoundSubModuleExpression): BaseBoundNode {
        return node;
    }

    public rewriteSubModuleInvocationExpression(node: BoundSubModuleInvocationExpression): BaseBoundNode {
        return node;
    }

    public rewriteVariableExpression(node: BoundVariableExpression): BaseBoundNode {
        return node;
    }

    public rewriteStringLiteralExpression(node: BoundStringLiteralExpression): BaseBoundNode {
        return node;
    }

    public rewriteNumberLiteralExpression(node: BoundNumberLiteralExpression): BaseBoundNode {
        return node;
    }

    public rewriteParenthesisExpression(node: BoundParenthesisExpression): BaseBoundNode {
        return new BoundParenthesisExpression(
            this.rewrite(node.expression) as BaseBoundExpression,
            node.hasErrors,
            node.syntax);
    }
}

export class SyntheticBoundNodeFactory {
    public constructor(
        private readonly syntax: BaseSyntaxNode) {
    }

    public block(...statements: BaseBoundStatement[]): BoundStatementBlock {
        return new BoundStatementBlock(statements, this.syntax);
    }

    public if(condition: BaseBoundExpression, block: BoundStatementBlock): BoundIfStatement {
        const ifPart = new BoundIfHeaderStatement(condition, block, this.syntax);
        return new BoundIfStatement(ifPart, [], undefined, this.syntax);
    }

    public callStatement(libraryName: string, methodName: string, ...argumentsList: BaseBoundExpression[]): BoundLibraryMethodInvocationStatement {
        return new BoundLibraryMethodInvocationStatement(libraryName, methodName, argumentsList, this.syntax);
    }

    public assignVariable(variableName: string, value: BaseBoundExpression): BoundVariableAssignmentStatement {
        return new BoundVariableAssignmentStatement(variableName, value, this.syntax);
    }

    public notEqual(left: BaseBoundExpression, right: BaseBoundExpression): BoundNotEqualExpression {
        return new BoundNotEqualExpression(left, right, false, this.syntax);
    }

    public lessThan(left: BaseBoundExpression, right: BaseBoundExpression): BoundLessThanExpression {
        return new BoundLessThanExpression(left, right, false, this.syntax);
    }

    public greaterThan(left: BaseBoundExpression, right: BaseBoundExpression): BoundGreaterThanExpression {
        return new BoundGreaterThanExpression(left, right, false, this.syntax);
    }

    public add(left: BaseBoundExpression, right: BaseBoundExpression): BoundAdditionExpression {
        return new BoundAdditionExpression(left, right, false, this.syntax);
    }

    public subtract(left: BaseBoundExpression, right: BaseBoundExpression): BoundSubtractionExpression {
        return new BoundSubtractionExpression(left, right, false, this.syntax);
    }

    public multiply(left: BaseBoundExpression, right: BaseBoundExpression): BoundMultiplicationExpression {
        return new BoundMultiplicationExpression(left, right, false, this.syntax);
    }

    public divide(left: BaseBoundExpression, right: BaseBoundExpression): BoundDivisionExpression {
        return new BoundDivisionExpression(left, right, false, this.syntax);
    }

    public callExpr(libraryName: string, methodName: string, ...argumentsList: BaseBoundExpression[]): BoundLibraryMethodInvocationExpression {
        const hasValue = RuntimeLibraries.Metadata[libraryName].methods[methodName].returnsValue;
        return new BoundLibraryMethodInvocationExpression(libraryName, methodName, argumentsList, hasValue, false, this.syntax);
    }

    public property(libraryName: string, propertyName: string): BoundLibraryPropertyExpression {
        const hasValue = RuntimeLibraries.Metadata[libraryName].properties[propertyName].hasGetter;
        return new BoundLibraryPropertyExpression(libraryName, propertyName, hasValue, false, this.syntax);
    }

    public variable(name: string): BoundVariableExpression {
        return new BoundVariableExpression("<auto>_" + name, false, this.syntax);
    }

    public number(value: number): BoundNumberLiteralExpression {
        return new BoundNumberLiteralExpression(value, false, this.syntax);
    }
}
