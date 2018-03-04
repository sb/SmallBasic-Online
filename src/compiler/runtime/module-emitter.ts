import { BaseInstruction, InstructionKind, TempLabelInstruction, TempJumpInstruction, TempConditionalJumpInstruction, StoreVariableInstruction, PushNumberInstruction, LessThanInstruction, LoadVariableInstruction, AddInstruction, MethodCallInstruction, CallSubModuleInstruction, StoreArrayElementInstruction, StorePropertyInstruction, NegateInstruction, GreaterThanInstruction, LessThanOrEqualInstruction, GreaterThanOrEqualInstruction, PushStringInstruction, EqualInstruction, SubtractInstruction, MultiplyInstruction, DivideInstruction, LoadPropertyInstruction, LoadArrayElementInstruction, JumpInstruction, ConditionalJumpInstruction } from "./instructions";
import { BaseBoundStatement, BoundStatementKind, LibraryMethodCallBoundStatement, IfBoundStatement, WhileBoundStatement, ForBoundStatement, LabelBoundStatement, SubModuleCallBoundStatement, VariableAssignmentBoundStatement, PropertyAssignmentBoundStatement, ArrayAssignmentBoundStatement, GoToBoundStatement } from "../binding/nodes/statements";
import { BaseBoundExpression, BoundExpressionKind, OrBoundExpression, AndBoundExpression, NotEqualBoundExpression, EqualBoundExpression, LessThanBoundExpression, ParenthesisBoundExpression, NumberLiteralBoundExpression, StringLiteralBoundExpression, VariableBoundExpression, LibraryMethodCallBoundExpression, LibraryPropertyBoundExpression, ArrayAccessBoundExpression, DivisionBoundExpression, MultiplicationBoundExpression, SubtractionBoundExpression, AdditionBoundExpression, NegationBoundExpression } from "../binding/nodes/expressions";
import { Constants } from "./values/base-value";
import { BaseStatementSyntax } from "../syntax/nodes/statements";
import { BaseExpressionSyntax } from "../syntax/nodes/expressions";

export class ModuleEmitter {
    private jumpLabelCounter: number = 1;
    private _instructions: BaseInstruction[] = [];

    public get instructions(): ReadonlyArray<BaseInstruction> {
        return this._instructions;
    }

    public constructor(statements: ReadonlyArray<BaseBoundStatement<BaseStatementSyntax>>) {
        statements.forEach(statement => this.emitStatement(statement));
        this.replaceTempInstructions();
    }

    private emitStatement(statement: BaseBoundStatement<BaseStatementSyntax>): void {
        switch (statement.kind) {
            case BoundStatementKind.If: this.emitIfStatement(statement as IfBoundStatement); break;
            case BoundStatementKind.While: this.emitWhileStatement(statement as WhileBoundStatement); break;
            case BoundStatementKind.For: this.emitForStatement(statement as ForBoundStatement); break;
            case BoundStatementKind.Label: this.emitLabelStatement(statement as LabelBoundStatement); break;
            case BoundStatementKind.GoTo: this.emitGoToStatement(statement as GoToBoundStatement); break;
            case BoundStatementKind.SubModuleCall: this.emitSubModuleCall(statement as SubModuleCallBoundStatement); break;
            case BoundStatementKind.LibraryMethodCall: this.emitLibraryMethodCall(statement as LibraryMethodCallBoundStatement); break;
            case BoundStatementKind.VariableAssignment: this.emitVariableAssignment(statement as VariableAssignmentBoundStatement); break;
            case BoundStatementKind.PropertyAssignment: this.emitPropertyAssignment(statement as PropertyAssignmentBoundStatement); break;
            case BoundStatementKind.ArrayAssignment: this.emitArrayAssignment(statement as ArrayAssignmentBoundStatement); break;
            default: throw new Error(`Unexpected statement kind: ${BoundStatementKind[statement.kind]}`);
        }
    }

    private emitIfStatement(statement: IfBoundStatement): void {
        const endOfBlockLabel = this.generateJumpLabel();

        this.emitIfPart(statement.ifPart.condition, statement.ifPart.statementsList, endOfBlockLabel);

        statement.elseIfParts.forEach(part => this.emitIfPart(part.condition, part.statementsList, endOfBlockLabel));

        if (statement.elsePart) {
            statement.elsePart.statementsList.forEach(statement => this.emitStatement(statement));
        }

        this._instructions.push(new TempLabelInstruction(endOfBlockLabel, statement.syntax.endIfCommand.range));
    }

    private emitIfPart(condition: BaseBoundExpression<BaseExpressionSyntax>, statements: BaseBoundStatement<BaseStatementSyntax>[], endOfBlockLabel: string): void {
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
        this._instructions.push(new TempLabelInstruction(statement.labelName, statement.syntax.command.range));
    }

    private emitGoToStatement(statement: GoToBoundStatement): void {
        this._instructions.push(new TempJumpInstruction(statement.labelName, statement.syntax.command.range));
    }

    private emitLibraryMethodCall(statement: LibraryMethodCallBoundStatement): void {
        statement.argumentsList.forEach(argument => this.emitExpression(argument));
        this._instructions.push(new MethodCallInstruction(statement.libraryName, statement.methodName, statement.syntax.command.range));
    }

    private emitSubModuleCall(statement: SubModuleCallBoundStatement): void {
        this._instructions.push(new CallSubModuleInstruction(statement.subModuleName, statement.syntax.command.range));
    }

    private emitVariableAssignment(statement: VariableAssignmentBoundStatement): void {
        this.emitExpression(statement.value);
        this._instructions.push(new StoreVariableInstruction(statement.variableName, statement.syntax.command.range));
    }

    private emitArrayAssignment(statement: ArrayAssignmentBoundStatement): void {
        statement.indices.reverse().forEach(index => this.emitExpression(index));
        this.emitExpression(statement.value);

        this._instructions.push(new StoreArrayElementInstruction(statement.arrayName, statement.indices.length, statement.syntax.command.range));
    }

    private emitPropertyAssignment(statement: PropertyAssignmentBoundStatement): void {
        this.emitExpression(statement.value);
        this._instructions.push(new StorePropertyInstruction(statement.libraryName, statement.propertyName, statement.value.syntax.range));
    }

    private emitExpression(expression: BaseBoundExpression<BaseExpressionSyntax>): void {
        switch (expression.kind) {
            case BoundExpressionKind.Negation: this.emitNegationExpression(expression as NegationBoundExpression); break;
            case BoundExpressionKind.Or: this.emitOrExpression(expression as OrBoundExpression); break;
            case BoundExpressionKind.And: this.emitAndExpression(expression as AndBoundExpression); break;
            case BoundExpressionKind.NotEqual: this.emitNotEqualExpression(expression as NotEqualBoundExpression); break;
            case BoundExpressionKind.Equal: this.emitEqualExpression(expression as EqualBoundExpression); break;
            case BoundExpressionKind.LessThan: this.emitComparisonExpression(expression as LessThanBoundExpression, new LessThanInstruction(expression.syntax.range)); break;
            case BoundExpressionKind.GreaterThan: this.emitComparisonExpression(expression as LessThanBoundExpression, new GreaterThanInstruction(expression.syntax.range)); break;
            case BoundExpressionKind.LessThanOrEqual: this.emitComparisonExpression(expression as LessThanBoundExpression, new LessThanOrEqualInstruction(expression.syntax.range)); break;
            case BoundExpressionKind.GreaterThanOrEqual: this.emitComparisonExpression(expression as LessThanBoundExpression, new GreaterThanOrEqualInstruction(expression.syntax.range)); break;
            case BoundExpressionKind.Addition: this.emitAdditionExpression(expression as AdditionBoundExpression); break;
            case BoundExpressionKind.Subtraction: this.emitSubtractionExpression(expression as SubtractionBoundExpression); break;
            case BoundExpressionKind.Multiplication: this.emitMultiplicationExpression(expression as MultiplicationBoundExpression); break;
            case BoundExpressionKind.Division: this.emitDivisionExpression(expression as DivisionBoundExpression); break;
            case BoundExpressionKind.ArrayAccess: this.emitArrayAccessExpression(expression as ArrayAccessBoundExpression); break;
            case BoundExpressionKind.LibraryProperty: this.emitLibraryPropertyExpression(expression as LibraryPropertyBoundExpression); break;
            case BoundExpressionKind.LibraryMethodCall: this.emitLibraryMethodCallExpression(expression as LibraryMethodCallBoundExpression); break;
            case BoundExpressionKind.Variable: this.emitVariableExpression(expression as VariableBoundExpression); break;
            case BoundExpressionKind.StringLiteral: this.emitStringLiteralExpression(expression as StringLiteralBoundExpression); break;
            case BoundExpressionKind.NumberLiteral: this.emitNumberLiteralExpression(expression as NumberLiteralBoundExpression); break;
            case BoundExpressionKind.Parenthesis: this.emitParenthesisExpression(expression as ParenthesisBoundExpression); break;
            default: throw new Error(`Unexpected bound expression kind: ${BoundExpressionKind[expression.kind]}`);
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
        expression.indices.reverse().forEach(index => this.emitExpression(index));
        this._instructions.push(new LoadArrayElementInstruction(expression.arrayName, expression.indices.length, expression.syntax.range));
    }

    private emitLibraryPropertyExpression(expression: LibraryPropertyBoundExpression): void {
        this._instructions.push(new LoadPropertyInstruction(expression.libraryName, expression.propertyName, expression.syntax.range));
    }

    private emitLibraryMethodCallExpression(expression: LibraryMethodCallBoundExpression): void {
        expression.argumentsList.forEach(argument => this.emitExpression(argument));
        this._instructions.push(new MethodCallInstruction(expression.libraryName, expression.MethodName, expression.syntax.range));
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

    private replaceTempInstructions(): void {
        const labelToIndexMap: { [key: string]: number } = {};

        for (let i = 0; i < this._instructions.length; i++) {
            if (this._instructions[i].kind === InstructionKind.TempLabel) {
                const label = this._instructions[i] as TempLabelInstruction;
                if (labelToIndexMap[label.name]) {
                    throw new Error(`Label ${label.name} exists twice in the same instruction set`);
                }
                labelToIndexMap[label.name] = i;
                this._instructions.splice(i, 1);
                i--;
            }
        }

        function replaceJump(target: string | undefined): number | undefined {
            if (target) {
                const index = labelToIndexMap[target];
                if (index === undefined) {
                    throw new Error(`Index for label ${target} was not calculated`);
                } else {
                    return index;
                }
            } else {
                return undefined;
            }
        }

        for (let i = 0; i < this._instructions.length; i++) {
            switch (this._instructions[i].kind) {
                case InstructionKind.TempJump: {
                    const jump = this._instructions[i] as TempJumpInstruction;
                    this._instructions[i] = new JumpInstruction(replaceJump(jump.target)!, jump.sourceRange);
                    break;
                }
                case InstructionKind.TempConditionalJump: {
                    const jump = this._instructions[i] as TempConditionalJumpInstruction;
                    this._instructions[i] = new ConditionalJumpInstruction(replaceJump(jump.trueTarget), replaceJump(jump.falseTarget), jump.sourceRange);
                    break;
                }
            }
        }
    }

    private generateJumpLabel(): string {
        return `internal_$$_${this.jumpLabelCounter++}`;
    }
}
