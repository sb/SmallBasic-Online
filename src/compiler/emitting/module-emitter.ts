import { BaseInstruction, TempLabelInstruction, TempJumpInstruction, TempConditionalJumpInstruction, StoreVariableInstruction, PushNumberInstruction, LessThanInstruction, LoadVariableInstruction, AddInstruction, MethodInvocationInstruction, InvokeSubModuleInstruction, StoreArrayElementInstruction, StorePropertyInstruction, NegateInstruction, GreaterThanInstruction, LessThanOrEqualInstruction, GreaterThanOrEqualInstruction, PushStringInstruction, EqualInstruction, SubtractInstruction, MultiplyInstruction, DivideInstruction, LoadPropertyInstruction, LoadArrayElementInstruction } from "./instructions";
import { BaseBoundStatement, IfBoundStatement, WhileBoundStatement, ForBoundStatement, LabelBoundStatement, VariableAssignmentBoundStatement, PropertyAssignmentBoundStatement, ArrayAssignmentBoundStatement, GoToBoundStatement, BaseBoundExpression, BoundKind, OrBoundExpression, AndBoundExpression, NotEqualBoundExpression, EqualBoundExpression, LessThanBoundExpression, ParenthesisBoundExpression, NumberLiteralBoundExpression, StringLiteralBoundExpression, VariableBoundExpression, LibraryMethodInvocationBoundExpression, LibraryPropertyBoundExpression, ArrayAccessBoundExpression, DivisionBoundExpression, MultiplicationBoundExpression, SubtractionBoundExpression, AdditionBoundExpression, NegationBoundExpression, SubModuleInvocationBoundStatement, LibraryMethodInvocationBoundStatement } from "../binding/bound-nodes";
import { Constants } from "../runtime/values/base-value";
import { BaseStatementSyntax, BaseExpressionSyntax } from "../syntax/syntax-nodes";
import { TempLabelsRemover } from "./passes/temp-labels-remover";
import { LibraryCallsRewriter } from "./passes/library-calls-rewriter";

export class ModuleEmitter {
    private _jumpLabelCounter: number = 1;
    private _instructions: BaseInstruction[] = [];

    public get instructions(): ReadonlyArray<BaseInstruction> {
        return this._instructions;
    }

    public constructor(statements: ReadonlyArray<BaseBoundStatement<BaseStatementSyntax>>) {
        statements.forEach(statement => this.emitStatement(statement));

        LibraryCallsRewriter.rewrite(this._instructions);
        TempLabelsRemover.remove(this._instructions);
    }

    private emitStatement(statement: BaseBoundStatement<BaseStatementSyntax>): void {
        switch (statement.kind) {
            case BoundKind.IfStatement: this.emitIfStatement(statement as IfBoundStatement); break;
            case BoundKind.WhileStatement: this.emitWhileStatement(statement as WhileBoundStatement); break;
            case BoundKind.ForStatement: this.emitForStatement(statement as ForBoundStatement); break;
            case BoundKind.LabelStatement: this.emitLabelStatement(statement as LabelBoundStatement); break;
            case BoundKind.GoToStatement: this.emitGoToStatement(statement as GoToBoundStatement); break;
            case BoundKind.SubModuleInvocationStatement: this.emitSubModuleInvocation(statement as SubModuleInvocationBoundStatement); break;
            case BoundKind.LibraryMethodInvocationStatement: this.emitLibraryMethodInvocation(statement as LibraryMethodInvocationBoundStatement); break;
            case BoundKind.VariableAssignmentStatement: this.emitVariableAssignment(statement as VariableAssignmentBoundStatement); break;
            case BoundKind.PropertyAssignmentStatement: this.emitPropertyAssignment(statement as PropertyAssignmentBoundStatement); break;
            case BoundKind.ArrayAssignmentStatement: this.emitArrayAssignment(statement as ArrayAssignmentBoundStatement); break;
            default: throw new Error(`Unexpected statement kind: ${BoundKind[statement.kind]}`);
        }
    }

    private emitIfStatement(statement: IfBoundStatement): void {
        const endOfBlockLabel = this.generateJumpLabel();

        this.emitIfPart(statement.ifPart.condition, statement.ifPart.statementsList, endOfBlockLabel);

        statement.elseIfParts.forEach(part => this.emitIfPart(part.condition, part.statementsList, endOfBlockLabel));

        if (statement.elsePart) {
            statement.elsePart.forEach(statement => this.emitStatement(statement));
        }

        this._instructions.push(new TempLabelInstruction(endOfBlockLabel, statement.syntax.endIfCommand.range));
    }

    private emitIfPart(condition: BaseBoundExpression<BaseExpressionSyntax>, statements: ReadonlyArray<BaseBoundStatement<BaseStatementSyntax>>, endOfBlockLabel: string): void {
        const endOfPartLabel = this.generateJumpLabel();

        this.emitExpression(condition);
        this._instructions.push(new TempConditionalJumpInstruction(undefined, endOfPartLabel, condition.syntax.range));

        statements.forEach(statement => this.emitStatement(statement));

        const endOfPartRange = this._instructions[this._instructions.length - 1].sourceRange;
        this._instructions.push(new TempJumpInstruction(endOfBlockLabel, endOfPartRange));
        this._instructions.push(new TempLabelInstruction(endOfPartLabel, endOfPartRange));
    }

    private emitWhileStatement(statement: WhileBoundStatement): void {
        const startOfLoopLabel = this.generateJumpLabel();
        const endOfLoopLabel = this.generateJumpLabel();

        this._instructions.push(new TempLabelInstruction(startOfLoopLabel, statement.syntax.whileCommand.range));
        this.emitExpression(statement.condition);
        this._instructions.push(new TempConditionalJumpInstruction(undefined, endOfLoopLabel, statement.condition.syntax.range));

        statement.statementsList.forEach(statement => this.emitStatement(statement));

        const endOfLoopRange = this._instructions[this._instructions.length - 1].sourceRange;
        this._instructions.push(new TempJumpInstruction(startOfLoopLabel, endOfLoopRange));
        this._instructions.push(new TempLabelInstruction(endOfLoopLabel, endOfLoopRange));
    }

    private emitForStatement(statement: ForBoundStatement): void {
        const beforeCheckLabel = this.generateJumpLabel();
        const positiveLoopLabel = this.generateJumpLabel();
        const negativeLoopLabel = this.generateJumpLabel();
        const afterCheckLabel = this.generateJumpLabel();
        const endOfBlockLabel = this.generateJumpLabel();

        this.emitExpression(statement.fromExpression);
        this._instructions.push(new StoreVariableInstruction(statement.identifier, statement.syntax.forCommand.equalToken.range));

        this._instructions.push(new TempLabelInstruction(beforeCheckLabel, statement.syntax.forCommand.range));

        if (statement.stepExpression) {
            this.emitExpression(statement.stepExpression);
            this._instructions.push(new PushNumberInstruction(0, statement.stepExpression.syntax.range));
            this._instructions.push(new LessThanInstruction(statement.stepExpression.syntax.range));
            this._instructions.push(new TempConditionalJumpInstruction(negativeLoopLabel, positiveLoopLabel, statement.stepExpression.syntax.range));
        }

        this._instructions.push(new TempLabelInstruction(positiveLoopLabel, statement.toExpression.syntax.range));
        this.emitExpression(statement.toExpression);
        this._instructions.push(new LoadVariableInstruction(statement.identifier, statement.toExpression.syntax.range));
        this._instructions.push(new LessThanInstruction(statement.toExpression.syntax.range));
        this._instructions.push(new TempConditionalJumpInstruction(endOfBlockLabel, afterCheckLabel, statement.toExpression.syntax.range));

        this._instructions.push(new TempLabelInstruction(negativeLoopLabel, statement.toExpression.syntax.range));
        this._instructions.push(new LoadVariableInstruction(statement.identifier, statement.toExpression.syntax.range));
        this.emitExpression(statement.toExpression);
        this._instructions.push(new LessThanInstruction(statement.toExpression.syntax.range));
        this._instructions.push(new TempConditionalJumpInstruction(endOfBlockLabel, undefined, statement.toExpression.syntax.range));

        this._instructions.push(new TempLabelInstruction(afterCheckLabel, statement.toExpression.syntax.range));

        statement.statementsList.forEach(statement => this.emitStatement(statement));

        this._instructions.push(new LoadVariableInstruction(statement.identifier, statement.syntax.forCommand.identifierToken.range));

        if (statement.stepExpression) {
            this.emitExpression(statement.stepExpression);
        } else {
            this._instructions.push(new PushNumberInstruction(1, statement.syntax.forCommand.identifierToken.range));
        }

        this._instructions.push(new AddInstruction(statement.syntax.forCommand.range));
        this._instructions.push(new StoreVariableInstruction(statement.identifier, statement.syntax.forCommand.identifierToken.range));
        this._instructions.push(new TempJumpInstruction(beforeCheckLabel, statement.syntax.forCommand.identifierToken.range));

        const endOfLoopRange = this._instructions[this._instructions.length - 1].sourceRange;
        this._instructions.push(new TempLabelInstruction(endOfBlockLabel, endOfLoopRange));
    }

    private emitLabelStatement(statement: LabelBoundStatement): void {
        this._instructions.push(new TempLabelInstruction(statement.labelName, statement.syntax.range));
    }

    private emitGoToStatement(statement: GoToBoundStatement): void {
        this._instructions.push(new TempJumpInstruction(statement.labelName, statement.syntax.range));
    }

    private emitLibraryMethodInvocation(statement: LibraryMethodInvocationBoundStatement): void {
        statement.argumentsList.forEach(argument => this.emitExpression(argument));
        this._instructions.push(new MethodInvocationInstruction(statement.libraryName, statement.methodName, statement.syntax.range));
    }

    private emitSubModuleInvocation(statement: SubModuleInvocationBoundStatement): void {
        this._instructions.push(new InvokeSubModuleInstruction(statement.subModuleName, statement.syntax.range));
    }

    private emitVariableAssignment(statement: VariableAssignmentBoundStatement): void {
        this.emitExpression(statement.value);
        this._instructions.push(new StoreVariableInstruction(statement.variableName, statement.syntax.range));
    }

    private emitArrayAssignment(statement: ArrayAssignmentBoundStatement): void {
        for (let i = statement.indices.length - 1; i >= 0; i--) {
            this.emitExpression(statement.indices[i]);
        }

        this.emitExpression(statement.value);
        this._instructions.push(new StoreArrayElementInstruction(statement.arrayName, statement.indices.length, statement.syntax.range));
    }

    private emitPropertyAssignment(statement: PropertyAssignmentBoundStatement): void {
        this.emitExpression(statement.value);
        this._instructions.push(new StorePropertyInstruction(statement.libraryName, statement.propertyName, statement.value.syntax.range));
    }

    private emitExpression(expression: BaseBoundExpression<BaseExpressionSyntax>): void {
        switch (expression.kind) {
            case BoundKind.NegationExpression: this.emitNegationExpression(expression as NegationBoundExpression); break;
            case BoundKind.OrExpression: this.emitOrExpression(expression as OrBoundExpression); break;
            case BoundKind.AndExpression: this.emitAndExpression(expression as AndBoundExpression); break;
            case BoundKind.NotEqualExpression: this.emitNotEqualExpression(expression as NotEqualBoundExpression); break;
            case BoundKind.EqualExpression: this.emitEqualExpression(expression as EqualBoundExpression); break;
            case BoundKind.LessThanExpression: this.emitComparisonExpression(expression as LessThanBoundExpression, new LessThanInstruction(expression.syntax.range)); break;
            case BoundKind.GreaterThanExpression: this.emitComparisonExpression(expression as LessThanBoundExpression, new GreaterThanInstruction(expression.syntax.range)); break;
            case BoundKind.LessThanOrEqualExpression: this.emitComparisonExpression(expression as LessThanBoundExpression, new LessThanOrEqualInstruction(expression.syntax.range)); break;
            case BoundKind.GreaterThanOrEqualExpression: this.emitComparisonExpression(expression as LessThanBoundExpression, new GreaterThanOrEqualInstruction(expression.syntax.range)); break;
            case BoundKind.AdditionExpression: this.emitAdditionExpression(expression as AdditionBoundExpression); break;
            case BoundKind.SubtractionExpression: this.emitSubtractionExpression(expression as SubtractionBoundExpression); break;
            case BoundKind.MultiplicationExpression: this.emitMultiplicationExpression(expression as MultiplicationBoundExpression); break;
            case BoundKind.DivisionExpression: this.emitDivisionExpression(expression as DivisionBoundExpression); break;
            case BoundKind.ArrayAccessExpression: this.emitArrayAccessExpression(expression as ArrayAccessBoundExpression); break;
            case BoundKind.LibraryPropertyExpression: this.emitLibraryPropertyExpression(expression as LibraryPropertyBoundExpression); break;
            case BoundKind.LibraryMethodInvocationExpression: this.emitLibraryMethodInvocationExpression(expression as LibraryMethodInvocationBoundExpression); break;
            case BoundKind.VariableExpression: this.emitVariableExpression(expression as VariableBoundExpression); break;
            case BoundKind.StringLiteralExpression: this.emitStringLiteralExpression(expression as StringLiteralBoundExpression); break;
            case BoundKind.NumberLiteralExpression: this.emitNumberLiteralExpression(expression as NumberLiteralBoundExpression); break;
            case BoundKind.ParenthesisExpression: this.emitParenthesisExpression(expression as ParenthesisBoundExpression); break;
            default: throw new Error(`Unexpected bound expression kind: ${BoundKind[expression.kind]}`);
        }
    }

    private emitNegationExpression(expression: NegationBoundExpression): void {
        this.emitExpression(expression.expression);
        this._instructions.push(new NegateInstruction(expression.syntax.range));
    }

    private emitOrExpression(expression: OrBoundExpression): void {
        const trySecondLabel = this.generateJumpLabel();
        const trueLabel = this.generateJumpLabel();
        const falseLabel = this.generateJumpLabel();
        const endLabel = this.generateJumpLabel();

        this.emitExpression(expression.leftExpression);
        this._instructions.push(new TempConditionalJumpInstruction(trueLabel, trySecondLabel, expression.syntax.operatorToken.range));

        this._instructions.push(new TempLabelInstruction(trySecondLabel, expression.syntax.leftExpression.range));
        this.emitExpression(expression.rightExpression);
        this._instructions.push(new TempConditionalJumpInstruction(undefined, falseLabel, expression.syntax.operatorToken.range));

        const endOfOperatorRange = this.instructions[this.instructions.length - 1].sourceRange;

        this._instructions.push(new TempLabelInstruction(trueLabel, endOfOperatorRange));
        this._instructions.push(new PushStringInstruction(Constants.True, endOfOperatorRange));
        this._instructions.push(new TempJumpInstruction(endLabel, endOfOperatorRange));

        this._instructions.push(new TempLabelInstruction(falseLabel, endOfOperatorRange));
        this._instructions.push(new PushStringInstruction(Constants.False, endOfOperatorRange));

        this._instructions.push(new TempLabelInstruction(endLabel, endOfOperatorRange));
    }

    private emitAndExpression(expression: AndBoundExpression): void {
        const falseLabel = this.generateJumpLabel();
        const endLabel = this.generateJumpLabel();

        this.emitExpression(expression.leftExpression);
        this._instructions.push(new TempConditionalJumpInstruction(undefined, falseLabel, expression.syntax.operatorToken.range));
        this.emitExpression(expression.rightExpression);
        this._instructions.push(new TempConditionalJumpInstruction(undefined, falseLabel, expression.syntax.operatorToken.range));

        const endOfOperatorRange = this.instructions[this.instructions.length - 1].sourceRange;

        this._instructions.push(new PushStringInstruction(Constants.True, endOfOperatorRange));
        this._instructions.push(new TempJumpInstruction(endLabel, endOfOperatorRange));

        this._instructions.push(new TempLabelInstruction(falseLabel, endOfOperatorRange));
        this._instructions.push(new PushStringInstruction(Constants.False, endOfOperatorRange));

        this._instructions.push(new TempLabelInstruction(endLabel, endOfOperatorRange));
    }

    private emitEqualExpression(expression: EqualBoundExpression): void {
        const notEqualLabel = this.generateJumpLabel();
        const endLabel = this.generateJumpLabel();

        this.emitExpression(expression.leftExpression);
        this.emitExpression(expression.rightExpression);

        this._instructions.push(new EqualInstruction(expression.syntax.operatorToken.range));
        this._instructions.push(new TempConditionalJumpInstruction(undefined, notEqualLabel, expression.syntax.operatorToken.range));

        const endOfOperatorRange = this.instructions[this.instructions.length - 1].sourceRange;

        this._instructions.push(new PushStringInstruction(Constants.True, endOfOperatorRange));
        this._instructions.push(new TempJumpInstruction(endLabel, endOfOperatorRange));

        this._instructions.push(new TempLabelInstruction(notEqualLabel, endOfOperatorRange));
        this._instructions.push(new PushStringInstruction(Constants.False, endOfOperatorRange));

        this._instructions.push(new TempLabelInstruction(endLabel, endOfOperatorRange));
    }

    private emitNotEqualExpression(expression: NotEqualBoundExpression): void {
        const notEqualLabel = this.generateJumpLabel();
        const endLabel = this.generateJumpLabel();

        this.emitExpression(expression.leftExpression);
        this.emitExpression(expression.rightExpression);

        this._instructions.push(new EqualInstruction(expression.syntax.operatorToken.range));
        this._instructions.push(new TempConditionalJumpInstruction(undefined, notEqualLabel, expression.syntax.operatorToken.range));

        const endOfOperatorRange = this.instructions[this.instructions.length - 1].sourceRange;

        this._instructions.push(new PushStringInstruction(Constants.False, endOfOperatorRange));
        this._instructions.push(new TempJumpInstruction(endLabel, endOfOperatorRange));

        this._instructions.push(new TempLabelInstruction(notEqualLabel, endOfOperatorRange));
        this._instructions.push(new PushStringInstruction(Constants.True, endOfOperatorRange));

        this._instructions.push(new TempLabelInstruction(endLabel, endOfOperatorRange));
    }

    private emitComparisonExpression(expression: LessThanBoundExpression, comparison: BaseInstruction): void {
        const comparisonFailed = this.generateJumpLabel();
        const endLabel = this.generateJumpLabel();

        this.emitExpression(expression.leftExpression);
        this.emitExpression(expression.rightExpression);

        this._instructions.push(comparison);
        this._instructions.push(new TempConditionalJumpInstruction(undefined, comparisonFailed, expression.syntax.operatorToken.range));

        const endOfOperatorRange = this.instructions[this.instructions.length - 1].sourceRange;

        this._instructions.push(new PushStringInstruction(Constants.True, endOfOperatorRange));
        this._instructions.push(new TempJumpInstruction(endLabel, endOfOperatorRange));

        this._instructions.push(new TempLabelInstruction(comparisonFailed, endOfOperatorRange));
        this._instructions.push(new PushStringInstruction(Constants.False, endOfOperatorRange));

        this._instructions.push(new TempLabelInstruction(endLabel, endOfOperatorRange));
    }

    private emitAdditionExpression(expression: AdditionBoundExpression): void {
        this.emitExpression(expression.leftExpression);
        this.emitExpression(expression.rightExpression);
        this._instructions.push(new AddInstruction(expression.syntax.range));
    }

    private emitSubtractionExpression(expression: SubtractionBoundExpression): void {
        this.emitExpression(expression.leftExpression);
        this.emitExpression(expression.rightExpression);
        this._instructions.push(new SubtractInstruction(expression.syntax.range));
    }

    private emitMultiplicationExpression(expression: MultiplicationBoundExpression): void {
        this.emitExpression(expression.leftExpression);
        this.emitExpression(expression.rightExpression);
        this._instructions.push(new MultiplyInstruction(expression.syntax.range));
    }

    private emitDivisionExpression(expression: DivisionBoundExpression): void {
        this.emitExpression(expression.leftExpression);
        this.emitExpression(expression.rightExpression);
        this._instructions.push(new DivideInstruction(expression.syntax.range));
    }

    private emitArrayAccessExpression(expression: ArrayAccessBoundExpression): void {
        for (let i = expression.indices.length - 1; i >= 0; i--) {
            this.emitExpression(expression.indices[i]);
        }

        this._instructions.push(new LoadArrayElementInstruction(expression.arrayName, expression.indices.length, expression.syntax.range));
    }

    private emitLibraryPropertyExpression(expression: LibraryPropertyBoundExpression): void {
        this._instructions.push(new LoadPropertyInstruction(expression.libraryName, expression.propertyName, expression.syntax.range));
    }

    private emitLibraryMethodInvocationExpression(expression: LibraryMethodInvocationBoundExpression): void {
        expression.argumentsList.forEach(argument => this.emitExpression(argument));
        this._instructions.push(new MethodInvocationInstruction(expression.libraryName, expression.methodName, expression.syntax.range));
    }

    private emitVariableExpression(expression: VariableBoundExpression): void {
        this._instructions.push(new LoadVariableInstruction(expression.variableName, expression.syntax.range));
    }

    private emitStringLiteralExpression(expression: StringLiteralBoundExpression): void {
        this._instructions.push(new PushStringInstruction(expression.value, expression.syntax.range));
    }

    private emitNumberLiteralExpression(expression: NumberLiteralBoundExpression): void {
        this._instructions.push(new PushNumberInstruction(expression.value, expression.syntax.range));
    }

    private emitParenthesisExpression(expression: ParenthesisBoundExpression): void {
        this.emitExpression(expression.expression);
    }

    private generateJumpLabel(): string {
        return `internal_$$_${this._jumpLabelCounter++}`;
    }
}
