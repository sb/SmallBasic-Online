import { BaseInstruction, TempLabelInstruction, TempJumpInstruction, TempConditionalJumpInstruction, StoreVariableInstruction, PushNumberInstruction, LessThanInstruction, LoadVariableInstruction, AddInstruction, MethodInvocationInstruction, InvokeSubModuleInstruction, StoreArrayElementInstruction, StorePropertyInstruction, NegateInstruction, GreaterThanInstruction, LessThanOrEqualInstruction, GreaterThanOrEqualInstruction, PushStringInstruction, EqualInstruction, SubtractInstruction, MultiplyInstruction, DivideInstruction, LoadPropertyInstruction, LoadArrayElementInstruction } from "./instructions";
import { BaseBoundStatement, BoundIfStatement, BoundWhileStatement, BoundForStatement, BoundLabelStatement, BoundVariableAssignmentStatement, BoundPropertyAssignmentStatement, BoundArrayAssignmentStatement, BoundGoToStatement, BaseBoundExpression, BoundKind, BoundOrExpression, BoundAndExpression, BoundNotEqualExpression, BoundEqualExpression, BoundLessThanExpression, BoundParenthesisExpression, BoundNumberLiteralExpression, BoundStringLiteralExpression, BoundVariableExpression, BoundLibraryMethodInvocationExpression, BoundLibraryPropertyExpression, BoundArrayAccessExpression, BoundDivisionExpression, BoundMultiplicationExpression, BoundSubtractionExpression, BoundAdditionExpression, BoundNegationExpression, BoundSubModuleInvocationStatement, BoundLibraryMethodInvocationStatement, BoundStatementBlock } from "../binding/bound-nodes";
import { Constants } from "../runtime/values/base-value";
import { TempLabelsRemover } from "./passes/temp-labels-remover";
import { LibraryCallsRewriter } from "./passes/library-calls-rewriter";

export class ModuleEmitter {
    private _jumpLabelCounter: number = 1;
    private _instructions: BaseInstruction[] = [];

    public get instructions(): ReadonlyArray<BaseInstruction> {
        return this._instructions;
    }

    public constructor(block: BoundStatementBlock) {
        const rewritten = new LibraryCallsRewriter().rewrite(block);
        this.emitStatement(rewritten);

        TempLabelsRemover.remove(this._instructions);
    }

    private emitStatement(statement: BaseBoundStatement): void {
        switch (statement.kind) {
            case BoundKind.StatementBlock: this.emitStatementBlock(statement as BoundStatementBlock); break;
            case BoundKind.IfStatement: this.emitIfStatement(statement as BoundIfStatement); break;
            case BoundKind.WhileStatement: this.emitWhileStatement(statement as BoundWhileStatement); break;
            case BoundKind.ForStatement: this.emitForStatement(statement as BoundForStatement); break;
            case BoundKind.LabelStatement: this.emitLabelStatement(statement as BoundLabelStatement); break;
            case BoundKind.GoToStatement: this.emitGoToStatement(statement as BoundGoToStatement); break;
            case BoundKind.SubModuleInvocationStatement: this.emitSubModuleInvocation(statement as BoundSubModuleInvocationStatement); break;
            case BoundKind.LibraryMethodInvocationStatement: this.emitLibraryMethodInvocation(statement as BoundLibraryMethodInvocationStatement); break;
            case BoundKind.VariableAssignmentStatement: this.emitVariableAssignment(statement as BoundVariableAssignmentStatement); break;
            case BoundKind.PropertyAssignmentStatement: this.emitPropertyAssignment(statement as BoundPropertyAssignmentStatement); break;
            case BoundKind.ArrayAssignmentStatement: this.emitArrayAssignment(statement as BoundArrayAssignmentStatement); break;
            default: throw new Error(`Unexpected statement kind: ${BoundKind[statement.kind]}`);
        }
    }

    private emitStatementBlock(statement: BoundStatementBlock): void {
        statement.statements.forEach(child => {
            this.emitStatement(child);
        });
    }

    private emitIfStatement(statement: BoundIfStatement): void {
        const endOfBlockLabel = this.generateJumpLabel();

        this.emitIfHeader(statement.ifPart.condition, statement.ifPart.block, endOfBlockLabel);

        statement.elseIfParts.forEach(part => this.emitIfHeader(part.condition, part.block, endOfBlockLabel));

        if (statement.elsePart) {
            this.emitStatement(statement.elsePart);
        }

        this._instructions.push(new TempLabelInstruction(endOfBlockLabel, statement.syntax.range));
    }

    private emitIfHeader(condition: BaseBoundExpression, block: BoundStatementBlock, endOfBlockLabel: string): void {
        const endOfPartLabel = this.generateJumpLabel();

        this.emitExpression(condition);
        this._instructions.push(new TempConditionalJumpInstruction(undefined, endOfPartLabel, condition.syntax.range));

        block.statements.forEach(statement => this.emitStatement(statement));

        const endOfPartRange = this._instructions[this._instructions.length - 1].sourceRange;
        this._instructions.push(new TempJumpInstruction(endOfBlockLabel, endOfPartRange));
        this._instructions.push(new TempLabelInstruction(endOfPartLabel, endOfPartRange));
    }

    private emitWhileStatement(statement: BoundWhileStatement): void {
        const startOfLoopLabel = this.generateJumpLabel();
        const endOfLoopLabel = this.generateJumpLabel();

        this._instructions.push(new TempLabelInstruction(startOfLoopLabel, statement.syntax.range));
        this.emitExpression(statement.condition);
        this._instructions.push(new TempConditionalJumpInstruction(undefined, endOfLoopLabel, statement.condition.syntax.range));

        this.emitStatement(statement.block);

        const endOfLoopRange = this._instructions[this._instructions.length - 1].sourceRange;
        this._instructions.push(new TempJumpInstruction(startOfLoopLabel, endOfLoopRange));
        this._instructions.push(new TempLabelInstruction(endOfLoopLabel, endOfLoopRange));
    }

    private emitForStatement(statement: BoundForStatement): void {
        const beforeCheckLabel = this.generateJumpLabel();
        const positiveLoopLabel = this.generateJumpLabel();
        const negativeLoopLabel = this.generateJumpLabel();
        const afterCheckLabel = this.generateJumpLabel();
        const endOfBlockLabel = this.generateJumpLabel();

        this.emitExpression(statement.fromExpression);
        this._instructions.push(new StoreVariableInstruction(statement.identifier, statement.syntax.range));

        this._instructions.push(new TempLabelInstruction(beforeCheckLabel, statement.syntax.range));

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

        this.emitStatement(statement.block);

        this._instructions.push(new LoadVariableInstruction(statement.identifier, statement.syntax.range));

        if (statement.stepExpression) {
            this.emitExpression(statement.stepExpression);
        } else {
            this._instructions.push(new PushNumberInstruction(1, statement.syntax.range));
        }

        this._instructions.push(new AddInstruction(statement.syntax.range));
        this._instructions.push(new StoreVariableInstruction(statement.identifier, statement.syntax.range));
        this._instructions.push(new TempJumpInstruction(beforeCheckLabel, statement.syntax.range));

        const endOfLoopRange = this._instructions[this._instructions.length - 1].sourceRange;
        this._instructions.push(new TempLabelInstruction(endOfBlockLabel, endOfLoopRange));
    }

    private emitLabelStatement(statement: BoundLabelStatement): void {
        this._instructions.push(new TempLabelInstruction(statement.labelName, statement.syntax.range));
    }

    private emitGoToStatement(statement: BoundGoToStatement): void {
        this._instructions.push(new TempJumpInstruction(statement.labelName, statement.syntax.range));
    }

    private emitLibraryMethodInvocation(statement: BoundLibraryMethodInvocationStatement): void {
        statement.argumentsList.forEach(argument => this.emitExpression(argument));
        this._instructions.push(new MethodInvocationInstruction(statement.libraryName, statement.methodName, statement.syntax.range));
    }

    private emitSubModuleInvocation(statement: BoundSubModuleInvocationStatement): void {
        this._instructions.push(new InvokeSubModuleInstruction(statement.subModuleName, statement.syntax.range));
    }

    private emitVariableAssignment(statement: BoundVariableAssignmentStatement): void {
        this.emitExpression(statement.value);
        this._instructions.push(new StoreVariableInstruction(statement.variableName, statement.syntax.range));
    }

    private emitArrayAssignment(statement: BoundArrayAssignmentStatement): void {
        for (let i = statement.indices.length - 1; i >= 0; i--) {
            this.emitExpression(statement.indices[i]);
        }

        this.emitExpression(statement.value);
        this._instructions.push(new StoreArrayElementInstruction(statement.arrayName, statement.indices.length, statement.syntax.range));
    }

    private emitPropertyAssignment(statement: BoundPropertyAssignmentStatement): void {
        this.emitExpression(statement.value);
        this._instructions.push(new StorePropertyInstruction(statement.libraryName, statement.propertyName, statement.value.syntax.range));
    }

    private emitExpression(expression: BaseBoundExpression): void {
        switch (expression.kind) {
            case BoundKind.NegationExpression: this.emitNegationExpression(expression as BoundNegationExpression); break;
            case BoundKind.OrExpression: this.emitOrExpression(expression as BoundOrExpression); break;
            case BoundKind.AndExpression: this.emitAndExpression(expression as BoundAndExpression); break;
            case BoundKind.NotEqualExpression: this.emitNotEqualExpression(expression as BoundNotEqualExpression); break;
            case BoundKind.EqualExpression: this.emitEqualExpression(expression as BoundEqualExpression); break;
            case BoundKind.LessThanExpression: this.emitComparisonExpression(expression as BoundLessThanExpression, new LessThanInstruction(expression.syntax.range)); break;
            case BoundKind.GreaterThanExpression: this.emitComparisonExpression(expression as BoundLessThanExpression, new GreaterThanInstruction(expression.syntax.range)); break;
            case BoundKind.LessThanOrEqualExpression: this.emitComparisonExpression(expression as BoundLessThanExpression, new LessThanOrEqualInstruction(expression.syntax.range)); break;
            case BoundKind.GreaterThanOrEqualExpression: this.emitComparisonExpression(expression as BoundLessThanExpression, new GreaterThanOrEqualInstruction(expression.syntax.range)); break;
            case BoundKind.AdditionExpression: this.emitAdditionExpression(expression as BoundAdditionExpression); break;
            case BoundKind.SubtractionExpression: this.emitSubtractionExpression(expression as BoundSubtractionExpression); break;
            case BoundKind.MultiplicationExpression: this.emitMultiplicationExpression(expression as BoundMultiplicationExpression); break;
            case BoundKind.DivisionExpression: this.emitDivisionExpression(expression as BoundDivisionExpression); break;
            case BoundKind.ArrayAccessExpression: this.emitArrayAccessExpression(expression as BoundArrayAccessExpression); break;
            case BoundKind.LibraryPropertyExpression: this.emitLibraryPropertyExpression(expression as BoundLibraryPropertyExpression); break;
            case BoundKind.LibraryMethodInvocationExpression: this.emitLibraryMethodInvocationExpression(expression as BoundLibraryMethodInvocationExpression); break;
            case BoundKind.VariableExpression: this.emitVariableExpression(expression as BoundVariableExpression); break;
            case BoundKind.StringLiteralExpression: this.emitStringLiteralExpression(expression as BoundStringLiteralExpression); break;
            case BoundKind.NumberLiteralExpression: this.emitNumberLiteralExpression(expression as BoundNumberLiteralExpression); break;
            case BoundKind.ParenthesisExpression: this.emitParenthesisExpression(expression as BoundParenthesisExpression); break;
            default: throw new Error(`Unexpected bound expression kind: ${BoundKind[expression.kind]}`);
        }
    }

    private emitNegationExpression(expression: BoundNegationExpression): void {
        this.emitExpression(expression.expression);
        this._instructions.push(new NegateInstruction(expression.syntax.range));
    }

    private emitOrExpression(expression: BoundOrExpression): void {
        const trySecondLabel = this.generateJumpLabel();
        const trueLabel = this.generateJumpLabel();
        const falseLabel = this.generateJumpLabel();
        const endLabel = this.generateJumpLabel();

        this.emitExpression(expression.leftExpression);
        this._instructions.push(new TempConditionalJumpInstruction(trueLabel, trySecondLabel, expression.syntax.range));

        this._instructions.push(new TempLabelInstruction(trySecondLabel, expression.syntax.range));
        this.emitExpression(expression.rightExpression);
        this._instructions.push(new TempConditionalJumpInstruction(undefined, falseLabel, expression.syntax.range));

        const endOfOperatorRange = this.instructions[this.instructions.length - 1].sourceRange;

        this._instructions.push(new TempLabelInstruction(trueLabel, endOfOperatorRange));
        this._instructions.push(new PushStringInstruction(Constants.True, endOfOperatorRange));
        this._instructions.push(new TempJumpInstruction(endLabel, endOfOperatorRange));

        this._instructions.push(new TempLabelInstruction(falseLabel, endOfOperatorRange));
        this._instructions.push(new PushStringInstruction(Constants.False, endOfOperatorRange));

        this._instructions.push(new TempLabelInstruction(endLabel, endOfOperatorRange));
    }

    private emitAndExpression(expression: BoundAndExpression): void {
        const falseLabel = this.generateJumpLabel();
        const endLabel = this.generateJumpLabel();

        this.emitExpression(expression.leftExpression);
        this._instructions.push(new TempConditionalJumpInstruction(undefined, falseLabel, expression.syntax.range));
        this.emitExpression(expression.rightExpression);
        this._instructions.push(new TempConditionalJumpInstruction(undefined, falseLabel, expression.syntax.range));

        const endOfOperatorRange = this.instructions[this.instructions.length - 1].sourceRange;

        this._instructions.push(new PushStringInstruction(Constants.True, endOfOperatorRange));
        this._instructions.push(new TempJumpInstruction(endLabel, endOfOperatorRange));

        this._instructions.push(new TempLabelInstruction(falseLabel, endOfOperatorRange));
        this._instructions.push(new PushStringInstruction(Constants.False, endOfOperatorRange));

        this._instructions.push(new TempLabelInstruction(endLabel, endOfOperatorRange));
    }

    private emitEqualExpression(expression: BoundEqualExpression): void {
        const notEqualLabel = this.generateJumpLabel();
        const endLabel = this.generateJumpLabel();

        this.emitExpression(expression.leftExpression);
        this.emitExpression(expression.rightExpression);

        this._instructions.push(new EqualInstruction(expression.syntax.range));
        this._instructions.push(new TempConditionalJumpInstruction(undefined, notEqualLabel, expression.syntax.range));

        const endOfOperatorRange = this.instructions[this.instructions.length - 1].sourceRange;

        this._instructions.push(new PushStringInstruction(Constants.True, endOfOperatorRange));
        this._instructions.push(new TempJumpInstruction(endLabel, endOfOperatorRange));

        this._instructions.push(new TempLabelInstruction(notEqualLabel, endOfOperatorRange));
        this._instructions.push(new PushStringInstruction(Constants.False, endOfOperatorRange));

        this._instructions.push(new TempLabelInstruction(endLabel, endOfOperatorRange));
    }

    private emitNotEqualExpression(expression: BoundNotEqualExpression): void {
        const notEqualLabel = this.generateJumpLabel();
        const endLabel = this.generateJumpLabel();

        this.emitExpression(expression.leftExpression);
        this.emitExpression(expression.rightExpression);

        this._instructions.push(new EqualInstruction(expression.syntax.range));
        this._instructions.push(new TempConditionalJumpInstruction(undefined, notEqualLabel, expression.syntax.range));

        const endOfOperatorRange = this.instructions[this.instructions.length - 1].sourceRange;

        this._instructions.push(new PushStringInstruction(Constants.False, endOfOperatorRange));
        this._instructions.push(new TempJumpInstruction(endLabel, endOfOperatorRange));

        this._instructions.push(new TempLabelInstruction(notEqualLabel, endOfOperatorRange));
        this._instructions.push(new PushStringInstruction(Constants.True, endOfOperatorRange));

        this._instructions.push(new TempLabelInstruction(endLabel, endOfOperatorRange));
    }

    private emitComparisonExpression(expression: BoundLessThanExpression, comparison: BaseInstruction): void {
        const comparisonFailed = this.generateJumpLabel();
        const endLabel = this.generateJumpLabel();

        this.emitExpression(expression.leftExpression);
        this.emitExpression(expression.rightExpression);

        this._instructions.push(comparison);
        this._instructions.push(new TempConditionalJumpInstruction(undefined, comparisonFailed, expression.syntax.range));

        const endOfOperatorRange = this.instructions[this.instructions.length - 1].sourceRange;

        this._instructions.push(new PushStringInstruction(Constants.True, endOfOperatorRange));
        this._instructions.push(new TempJumpInstruction(endLabel, endOfOperatorRange));

        this._instructions.push(new TempLabelInstruction(comparisonFailed, endOfOperatorRange));
        this._instructions.push(new PushStringInstruction(Constants.False, endOfOperatorRange));

        this._instructions.push(new TempLabelInstruction(endLabel, endOfOperatorRange));
    }

    private emitAdditionExpression(expression: BoundAdditionExpression): void {
        this.emitExpression(expression.leftExpression);
        this.emitExpression(expression.rightExpression);
        this._instructions.push(new AddInstruction(expression.syntax.range));
    }

    private emitSubtractionExpression(expression: BoundSubtractionExpression): void {
        this.emitExpression(expression.leftExpression);
        this.emitExpression(expression.rightExpression);
        this._instructions.push(new SubtractInstruction(expression.syntax.range));
    }

    private emitMultiplicationExpression(expression: BoundMultiplicationExpression): void {
        this.emitExpression(expression.leftExpression);
        this.emitExpression(expression.rightExpression);
        this._instructions.push(new MultiplyInstruction(expression.syntax.range));
    }

    private emitDivisionExpression(expression: BoundDivisionExpression): void {
        this.emitExpression(expression.leftExpression);
        this.emitExpression(expression.rightExpression);
        this._instructions.push(new DivideInstruction(expression.syntax.range));
    }

    private emitArrayAccessExpression(expression: BoundArrayAccessExpression): void {
        for (let i = expression.indices.length - 1; i >= 0; i--) {
            this.emitExpression(expression.indices[i]);
        }

        this._instructions.push(new LoadArrayElementInstruction(expression.arrayName, expression.indices.length, expression.syntax.range));
    }

    private emitLibraryPropertyExpression(expression: BoundLibraryPropertyExpression): void {
        this._instructions.push(new LoadPropertyInstruction(expression.libraryName, expression.propertyName, expression.syntax.range));
    }

    private emitLibraryMethodInvocationExpression(expression: BoundLibraryMethodInvocationExpression): void {
        expression.argumentsList.forEach(argument => this.emitExpression(argument));
        this._instructions.push(new MethodInvocationInstruction(expression.libraryName, expression.methodName, expression.syntax.range));
    }

    private emitVariableExpression(expression: BoundVariableExpression): void {
        this._instructions.push(new LoadVariableInstruction(expression.variableName, expression.syntax.range));
    }

    private emitStringLiteralExpression(expression: BoundStringLiteralExpression): void {
        this._instructions.push(new PushStringInstruction(expression.value, expression.syntax.range));
    }

    private emitNumberLiteralExpression(expression: BoundNumberLiteralExpression): void {
        this._instructions.push(new PushNumberInstruction(expression.value, expression.syntax.range));
    }

    private emitParenthesisExpression(expression: BoundParenthesisExpression): void {
        this.emitExpression(expression.expression);
    }

    private generateJumpLabel(): string {
        return `internal_$$_${this._jumpLabelCounter++}`;
    }
}
