import { BaseInstruction, InstructionFactory, InstructionKind, TempLabelInstruction, TempJumpInstruction, TempConditionalJumpInstruction } from "../models/instructions";
import { BaseBoundStatement, BoundStatementKind, LibraryMethodCallBoundStatement, IfBoundStatement, WhileBoundStatement, ForBoundStatement, LabelBoundStatement, SubModuleCallBoundStatement, VariableAssignmentBoundStatement, PropertyAssignmentBoundStatement, ArrayAssignmentBoundStatement, GoToBoundStatement } from "../models/bound-statements";
import { BaseBoundExpression, BoundExpressionKind, OrBoundExpression, AndBoundExpression, NotEqualBoundExpression, EqualBoundExpression, LessThanBoundExpression, ParenthesisBoundExpression, NumberLiteralBoundExpression, StringLiteralBoundExpression, VariableBoundExpression, LibraryMethodCallBoundExpression, LibraryPropertyBoundExpression, ArrayAccessBoundExpression, DivisionBoundExpression, MultiplicationBoundExpression, SubtractionBoundExpression, AdditionBoundExpression, NegationBoundExpression } from "../models/bound-expressions";
import { Constants } from "./values/base-value";
import { ForStatementSyntax, GoToStatementSyntax, ExpressionStatementSyntax } from "../syntax/nodes/statements";

export class ModuleEmitter {
    private jumpLabelCounter: number = 1;
    private _instructions: BaseInstruction[] = [];

    public get instructions(): ReadonlyArray<BaseInstruction> {
        return this._instructions;
    }

    public constructor(statements: ReadonlyArray<BaseBoundStatement>) {
        statements.forEach(statement => this.emitStatement(statement));
        this._instructions.push(InstructionFactory.Return());
        this.replaceTempInstructions();
    }

    private emitStatement(statement: BaseBoundStatement): void {
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

        this._instructions.push(InstructionFactory.TempLabel(endOfBlockLabel));
    }

    private emitIfPart(condition: BaseBoundExpression, statements: BaseBoundStatement[], endOfBlockLabel: string): void {
        const endOfPartLabel = this.generateJumpLabel();

        const lineNumber = condition.syntax.range.line;
        this._instructions.push(InstructionFactory.StatementStart(lineNumber));

        this.emitExpression(condition);
        this._instructions.push(InstructionFactory.TempConditionalJump(undefined, endOfPartLabel));

        statements.forEach(statement => this.emitStatement(statement));
        this._instructions.push(InstructionFactory.TempJump(endOfBlockLabel));

        this._instructions.push(InstructionFactory.TempLabel(endOfPartLabel));
    }

    private emitWhileStatement(statement: WhileBoundStatement): void {
        const startOfLoopLabel = this.generateJumpLabel();
        const endOfLoopLabel = this.generateJumpLabel();

        const lineNumber = statement.condition.syntax.range.line;
        this._instructions.push(InstructionFactory.StatementStart(lineNumber));

        this._instructions.push(InstructionFactory.TempLabel(startOfLoopLabel));
        this.emitExpression(statement.condition);
        this._instructions.push(InstructionFactory.TempConditionalJump(undefined, endOfLoopLabel));

        statement.statementsList.forEach(statement => this.emitStatement(statement));

        this._instructions.push(InstructionFactory.TempJump(startOfLoopLabel));
        this._instructions.push(InstructionFactory.TempLabel(endOfLoopLabel));
    }

    private emitForStatement(statement: ForBoundStatement): void {
        const beforeCheckLabel = this.generateJumpLabel();
        const positiveLoopLabel = this.generateJumpLabel();
        const negativeLoopLabel = this.generateJumpLabel();
        const afterCheckLabel = this.generateJumpLabel();
        const endOfBlockLabel = this.generateJumpLabel();

        const lineNumber = statement.fromExpression.syntax.range.line;
        this._instructions.push(InstructionFactory.StatementStart(lineNumber));

        this.emitExpression(statement.fromExpression);
        this._instructions.push(InstructionFactory.StoreVariable(statement.identifier));

        this._instructions.push(InstructionFactory.StatementStart(lineNumber));
        this._instructions.push(InstructionFactory.TempLabel(beforeCheckLabel));

        if (statement.stepExpression) {
            this.emitExpression(statement.stepExpression);
            this._instructions.push(InstructionFactory.PushNumber(0));
            this._instructions.push(InstructionFactory.LessThan());
            this._instructions.push(InstructionFactory.TempConditionalJump(negativeLoopLabel, positiveLoopLabel));
        }

        this._instructions.push(InstructionFactory.TempLabel(positiveLoopLabel));
        this.emitExpression(statement.toExpression);
        this._instructions.push(InstructionFactory.LoadVariable(statement.identifier));
        this._instructions.push(InstructionFactory.LessThan());
        this._instructions.push(InstructionFactory.TempConditionalJump(endOfBlockLabel, afterCheckLabel));

        this._instructions.push(InstructionFactory.TempLabel(negativeLoopLabel));
        this._instructions.push(InstructionFactory.LoadVariable(statement.identifier));
        this.emitExpression(statement.toExpression);
        this._instructions.push(InstructionFactory.LessThan());
        this._instructions.push(InstructionFactory.TempConditionalJump(endOfBlockLabel, undefined));

        this._instructions.push(InstructionFactory.TempLabel(afterCheckLabel));

        statement.statementsList.forEach(statement => this.emitStatement(statement));

        this._instructions.push(InstructionFactory.StatementStart(lineNumber));
        this._instructions.push(InstructionFactory.LoadVariable(statement.identifier));

        if (statement.stepExpression) {
            this.emitExpression(statement.stepExpression);
        } else {
            this._instructions.push(InstructionFactory.PushNumber(1));
        }

        this._instructions.push(InstructionFactory.Add((statement.syntax as ForStatementSyntax).forCommand.range));
        this._instructions.push(InstructionFactory.StoreVariable(statement.identifier));
        this._instructions.push(InstructionFactory.TempJump(beforeCheckLabel));

        this._instructions.push(InstructionFactory.TempLabel(endOfBlockLabel));
    }

    private emitLabelStatement(statement: LabelBoundStatement): void {
        this._instructions.push(InstructionFactory.TempLabel(statement.identifier));
    }

    private emitGoToStatement(statement: GoToBoundStatement): void {
        const lineNumber = (statement.syntax as GoToStatementSyntax).command.labelToken.range.line;
        this._instructions.push(InstructionFactory.StatementStart(lineNumber));

        this._instructions.push(InstructionFactory.TempJump(statement.identifier));
    }

    private emitLibraryMethodCall(statement: LibraryMethodCallBoundStatement): void {
        const range = (statement.syntax as ExpressionStatementSyntax).command.expression.range;
        this._instructions.push(InstructionFactory.StatementStart(range.line));

        statement.argumentsList.forEach(argument => this.emitExpression(argument));
        this._instructions.push(InstructionFactory.MethodCall(statement.library, statement.method, range));
    }

    private emitSubModuleCall(statement: SubModuleCallBoundStatement): void {
        const lineNumber = (statement.syntax as ExpressionStatementSyntax).command.expression.range.line;
        this._instructions.push(InstructionFactory.StatementStart(lineNumber));

        this._instructions.push(InstructionFactory.CallSubModule(statement.name));
    }

    private emitVariableAssignment(statement: VariableAssignmentBoundStatement): void {
        const lineNumber = (statement.syntax as ExpressionStatementSyntax).command.expression.range.line;
        this._instructions.push(InstructionFactory.StatementStart(lineNumber));

        this.emitExpression(statement.value);
        this._instructions.push(InstructionFactory.StoreVariable(statement.identifier));
    }

    private emitArrayAssignment(statement: ArrayAssignmentBoundStatement): void {
        const range = (statement.syntax as ExpressionStatementSyntax).command.expression.range;
        this._instructions.push(InstructionFactory.StatementStart(range.line));

        statement.indices.reverse().forEach(index => this.emitExpression(index));
        this.emitExpression(statement.value);

        this._instructions.push(InstructionFactory.StoreArrayElement(statement.identifier, statement.indices.length, range));
    }

    private emitPropertyAssignment(statement: PropertyAssignmentBoundStatement): void {
        const lineNumber = (statement.syntax as ExpressionStatementSyntax).command.expression.range.line;
        this._instructions.push(InstructionFactory.StatementStart(lineNumber));

        this.emitExpression(statement.value);
        this._instructions.push(InstructionFactory.StoreProperty(statement.library, statement.property, statement.value.syntax.range));
    }

    private emitExpression(expression: BaseBoundExpression): void {
        switch (expression.kind) {
            case BoundExpressionKind.Negation: this.emitNegationExpression(expression as NegationBoundExpression); break;
            case BoundExpressionKind.Or: this.emitOrExpression(expression as OrBoundExpression); break;
            case BoundExpressionKind.And: this.emitAndExpression(expression as AndBoundExpression); break;
            case BoundExpressionKind.NotEqual: this.emitNotEqualExpression(expression as NotEqualBoundExpression); break;
            case BoundExpressionKind.Equal: this.emitEqualExpression(expression as EqualBoundExpression); break;
            case BoundExpressionKind.LessThan: this.emitComparisonExpression(expression as LessThanBoundExpression, InstructionFactory.LessThan()); break;
            case BoundExpressionKind.GreaterThan: this.emitComparisonExpression(expression as LessThanBoundExpression, InstructionFactory.GreaterThan()); break;
            case BoundExpressionKind.LessThanOrEqual: this.emitComparisonExpression(expression as LessThanBoundExpression, InstructionFactory.LessThanOrEqual()); break;
            case BoundExpressionKind.GreaterThanOrEqual: this.emitComparisonExpression(expression as LessThanBoundExpression, InstructionFactory.GreaterThanOrEqual()); break;
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
        this._instructions.push(InstructionFactory.Negate(expression.syntax.range));
    }

    private emitOrExpression(expression: OrBoundExpression): void {
        const trySecondLabel = this.generateJumpLabel();
        const trueLabel = this.generateJumpLabel();
        const falseLabel = this.generateJumpLabel();
        const endLabel = this.generateJumpLabel();

        this.emitExpression(expression.leftExpression);
        this._instructions.push(InstructionFactory.TempConditionalJump(trueLabel, trySecondLabel));

        this._instructions.push(InstructionFactory.TempLabel(trySecondLabel));
        this.emitExpression(expression.rightExpression);
        this._instructions.push(InstructionFactory.TempConditionalJump(undefined, falseLabel));

        this._instructions.push(InstructionFactory.TempLabel(trueLabel));
        this._instructions.push(InstructionFactory.PushString(Constants.True));
        this._instructions.push(InstructionFactory.TempJump(endLabel));

        this._instructions.push(InstructionFactory.TempLabel(falseLabel));
        this._instructions.push(InstructionFactory.PushString(Constants.False));

        this._instructions.push(InstructionFactory.TempLabel(endLabel));
    }

    private emitAndExpression(expression: AndBoundExpression): void {
        const falseLabel = this.generateJumpLabel();
        const endLabel = this.generateJumpLabel();

        this.emitExpression(expression.leftExpression);
        this._instructions.push(InstructionFactory.TempConditionalJump(undefined, falseLabel));
        this.emitExpression(expression.rightExpression);
        this._instructions.push(InstructionFactory.TempConditionalJump(undefined, falseLabel));

        this._instructions.push(InstructionFactory.PushString(Constants.True));
        this._instructions.push(InstructionFactory.TempJump(endLabel));

        this._instructions.push(InstructionFactory.TempLabel(falseLabel));
        this._instructions.push(InstructionFactory.PushString(Constants.False));

        this._instructions.push(InstructionFactory.TempLabel(endLabel));
    }

    private emitEqualExpression(expression: EqualBoundExpression): void {
        const notEqualLabel = this.generateJumpLabel();
        const endLabel = this.generateJumpLabel();

        this.emitExpression(expression.leftExpression);
        this.emitExpression(expression.rightExpression);

        this._instructions.push(InstructionFactory.Equal());
        this._instructions.push(InstructionFactory.TempConditionalJump(undefined, notEqualLabel));

        this._instructions.push(InstructionFactory.PushString(Constants.True));
        this._instructions.push(InstructionFactory.TempJump(endLabel));

        this._instructions.push(InstructionFactory.TempLabel(notEqualLabel));
        this._instructions.push(InstructionFactory.PushString(Constants.False));

        this._instructions.push(InstructionFactory.TempLabel(endLabel));
    }

    private emitNotEqualExpression(expression: NotEqualBoundExpression): void {
        const notEqualLabel = this.generateJumpLabel();
        const endLabel = this.generateJumpLabel();

        this.emitExpression(expression.leftExpression);
        this.emitExpression(expression.rightExpression);

        this._instructions.push(InstructionFactory.Equal());
        this._instructions.push(InstructionFactory.TempConditionalJump(undefined, notEqualLabel));

        this._instructions.push(InstructionFactory.PushString(Constants.False));
        this._instructions.push(InstructionFactory.TempJump(endLabel));

        this._instructions.push(InstructionFactory.TempLabel(notEqualLabel));
        this._instructions.push(InstructionFactory.PushString(Constants.True));

        this._instructions.push(InstructionFactory.TempLabel(endLabel));
    }

    private emitComparisonExpression(expression: LessThanBoundExpression, comparison: BaseInstruction): void {
        const comparisonFailed = this.generateJumpLabel();
        const endLabel = this.generateJumpLabel();

        this.emitExpression(expression.leftExpression);
        this.emitExpression(expression.rightExpression);

        this._instructions.push(comparison);
        this._instructions.push(InstructionFactory.TempConditionalJump(undefined, comparisonFailed));

        this._instructions.push(InstructionFactory.PushString(Constants.True));
        this._instructions.push(InstructionFactory.TempJump(endLabel));

        this._instructions.push(InstructionFactory.TempLabel(comparisonFailed));
        this._instructions.push(InstructionFactory.PushString(Constants.False));

        this._instructions.push(InstructionFactory.TempLabel(endLabel));
    }

    private emitAdditionExpression(expression: AdditionBoundExpression): void {
        this.emitExpression(expression.leftExpression);
        this.emitExpression(expression.rightExpression);
        this._instructions.push(InstructionFactory.Add(expression.syntax.range));
    }

    private emitSubtractionExpression(expression: SubtractionBoundExpression): void {
        this.emitExpression(expression.leftExpression);
        this.emitExpression(expression.rightExpression);
        this._instructions.push(InstructionFactory.Subtract(expression.syntax.range));
    }

    private emitMultiplicationExpression(expression: MultiplicationBoundExpression): void {
        this.emitExpression(expression.leftExpression);
        this.emitExpression(expression.rightExpression);
        this._instructions.push(InstructionFactory.Multiply(expression.syntax.range));
    }

    private emitDivisionExpression(expression: DivisionBoundExpression): void {
        this.emitExpression(expression.leftExpression);
        this.emitExpression(expression.rightExpression);
        this._instructions.push(InstructionFactory.Divide(expression.syntax.range));
    }

    private emitArrayAccessExpression(expression: ArrayAccessBoundExpression): void {
        expression.indices.reverse().forEach(index => this.emitExpression(index));
        this._instructions.push(InstructionFactory.LoadArrayElement(expression.name, expression.indices.length, expression.syntax.range));
    }

    private emitLibraryPropertyExpression(expression: LibraryPropertyBoundExpression): void {
        this._instructions.push(InstructionFactory.LoadProperty(expression.library, expression.name, expression.syntax.range));
    }

    private emitLibraryMethodCallExpression(expression: LibraryMethodCallBoundExpression): void {
        expression.argumentsList.forEach(argument => this.emitExpression(argument));
        this._instructions.push(InstructionFactory.MethodCall(expression.library, expression.name, expression.syntax.range));
    }

    private emitVariableExpression(expression: VariableBoundExpression): void {
        this._instructions.push(InstructionFactory.LoadVariable(expression.name));
    }

    private emitStringLiteralExpression(expression: StringLiteralBoundExpression): void {
        this._instructions.push(InstructionFactory.PushString(expression.value));
    }

    private emitNumberLiteralExpression(expression: NumberLiteralBoundExpression): void {
        this._instructions.push(InstructionFactory.PushNumber(expression.value));
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
                if (index) {
                    return index;
                } else {
                    throw new Error(`Index for label ${target} was not calculated`);
                }
            } else {
                return undefined;
            }
        }

        for (let i = 0; i < this._instructions.length; i++) {
            switch (this._instructions[i].kind) {
                case InstructionKind.TempJump: {
                    const jump = this._instructions[i] as TempJumpInstruction;
                    this._instructions[i] = InstructionFactory.Jump(replaceJump(jump.target)!);
                    break;
                }
                case InstructionKind.TempConditionalJump: {
                    const jump = this._instructions[i] as TempConditionalJumpInstruction;
                    this._instructions[i] = InstructionFactory.ConditionalJump(replaceJump(jump.trueTarget), replaceJump(jump.falseTarget));
                    break;
                }
            }
        }
    }

    private generateJumpLabel(): string {
        return `internal_$$_${this.jumpLabelCounter++}`;
    }
}
