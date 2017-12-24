import { BaseInstruction, InstructionFactory, InstructionKind, TempLabelInstruction, TempJumpInstruction, TempJumpIfFalseInstruction } from "../models/instructions";
import { BaseBoundStatement, BoundStatementKind, LibraryMethodCallBoundStatement, IfBoundStatement, WhileBoundStatement, ForBoundStatement, LabelBoundStatement, SubModuleCallBoundStatement, VariableAssignmentBoundStatement, PropertyAssignmentBoundStatement, ArrayAssignmentBoundStatement, GoToBoundStatement } from "../models/bound-statements";
import { getExpressionRange, getCommandRange } from "../syntax/text-markers";
import { BaseBoundExpression, BoundExpressionKind, OrBoundExpression, AndBoundExpression, NotEqualBoundExpression, EqualBoundExpression, LessThanBoundExpression, GreaterThanBoundExpression, ParenthesisBoundExpression, NumberLiteralBoundExpression, StringLiteralBoundExpression, VariableBoundExpression, LibraryMethodCallBoundExpression, LibraryPropertyBoundExpression, ArrayAccessBoundExpression, DivisionBoundExpression, MultiplicationBoundExpression, SubtractionBoundExpression, AdditionBoundExpression, GreaterThanOrEqualBoundExpression, LessThanOrEqualBoundExpression, NegationBoundExpression } from "../models/bound-expressions";
import { ExpressionStatementSyntax, GoToStatementSyntax, ForStatementSyntax } from "../models/syntax-statements";
import { Constants } from "./values/base-value";

export class ModuleEmitter {
    private jumpLabelCounter: number = 1;

    public readonly instructions: BaseInstruction[];

    public constructor(statements: BaseBoundStatement[]) {
        this.instructions = [];
        statements.forEach(statement => this.emitStatement(statement));
        this.instructions.push(InstructionFactory.Return());
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
            default: throw `Unexpected statement kind: ${BoundStatementKind[statement.kind]}`;
        }
    }

    private emitIfStatement(statement: IfBoundStatement): void {
        const endOfBlockLabel = this.generateJumpLabel();

        this.emitIfPart(statement.ifPart.condition, statement.ifPart.statementsList, endOfBlockLabel);

        statement.elseIfParts.forEach(part => this.emitIfPart(part.condition, part.statementsList, endOfBlockLabel));

        if (statement.elsePart) {
            statement.elsePart.statementsList.forEach(statement => this.emitStatement(statement));
        }

        this.instructions.push(InstructionFactory.TempLabel(endOfBlockLabel));
    }

    private emitIfPart(condition: BaseBoundExpression, statements: BaseBoundStatement[], endOfBlockLabel: string): void {
        const lineNumber = getExpressionRange(condition.syntax).line;
        this.instructions.push(InstructionFactory.StatementStart(lineNumber));

        this.emitExpression(condition);

        const endOfPartLabel = this.generateJumpLabel();
        this.instructions.push(InstructionFactory.TempJumpIfFalse(endOfPartLabel));

        statements.forEach(statement => this.emitStatement(statement));
        this.instructions.push(InstructionFactory.TempJump(endOfBlockLabel));

        this.instructions.push(InstructionFactory.TempLabel(endOfPartLabel));
    }

    private emitWhileStatement(statement: WhileBoundStatement): void {
        const lineNumber = getExpressionRange(statement.condition.syntax).line;
        this.instructions.push(InstructionFactory.StatementStart(lineNumber));

        this.emitExpression(statement.condition);

        const endOfLoopLabel = this.generateJumpLabel();
        this.instructions.push(InstructionFactory.TempJumpIfFalse(endOfLoopLabel));

        statement.statementsList.forEach(statement => this.emitStatement(statement));
        this.instructions.push(InstructionFactory.TempLabel(endOfLoopLabel));
    }

    private emitForStatement(statement: ForBoundStatement): void {
        const endOfBlockLabel = this.generateJumpLabel();
        const lineNumber = getExpressionRange(statement.fromExpression.syntax).line;

        this.instructions.push(InstructionFactory.StatementStart(lineNumber));
        this.emitExpression(statement.fromExpression);
        this.instructions.push(InstructionFactory.StoreVariable(statement.identifier));

        const beforeCheckLabel = this.generateJumpLabel();
        this.instructions.push(InstructionFactory.StatementStart(lineNumber));
        this.instructions.push(InstructionFactory.TempLabel(beforeCheckLabel));
        this.emitExpression(statement.toExpression);
        this.instructions.push(InstructionFactory.LoadVariable(statement.identifier));
        this.instructions.push(InstructionFactory.LessThan());
        this.instructions.push(InstructionFactory.TempJumpIfFalse(endOfBlockLabel));

        statement.statementsList.forEach(statement => this.emitStatement(statement));

        this.instructions.push(InstructionFactory.StatementStart(lineNumber));
        this.instructions.push(InstructionFactory.LoadVariable(statement.identifier));

        if (statement.stepExpression) {
            this.emitExpression(statement.stepExpression);
        } else {
            this.instructions.push(InstructionFactory.PushNumber(1));
        }

        this.instructions.push(InstructionFactory.Add(getCommandRange((statement.syntax as ForStatementSyntax).forCommand)));
        this.instructions.push(InstructionFactory.StoreVariable(statement.identifier));
        this.instructions.push(InstructionFactory.TempJump(beforeCheckLabel));

        this.instructions.push(InstructionFactory.TempLabel(endOfBlockLabel));
    }

    private emitLabelStatement(statement: LabelBoundStatement): void {
        this.instructions.push(InstructionFactory.TempLabel(statement.identifier));
    }

    private emitGoToStatement(statement: GoToBoundStatement): void {
        const lineNumber = (statement.syntax as GoToStatementSyntax).command.labelToken.range.line;
        this.instructions.push(InstructionFactory.StatementStart(lineNumber));

        this.instructions.push(InstructionFactory.TempJump(statement.identifier));
    }

    private emitLibraryMethodCall(statement: LibraryMethodCallBoundStatement): void {
        const lineNumber = getExpressionRange((statement.syntax as ExpressionStatementSyntax).command.expression).line;
        this.instructions.push(InstructionFactory.StatementStart(lineNumber));

        this.instructions.push(InstructionFactory.CallLibraryMethod(statement.library, statement.method));
    }

    private emitSubModuleCall(statement: SubModuleCallBoundStatement): void {
        const lineNumber = getExpressionRange((statement.syntax as ExpressionStatementSyntax).command.expression).line;
        this.instructions.push(InstructionFactory.StatementStart(lineNumber));

        this.instructions.push(InstructionFactory.CallSubModule(statement.name));
    }

    private emitVariableAssignment(statement: VariableAssignmentBoundStatement): void {
        const lineNumber = getExpressionRange((statement.syntax as ExpressionStatementSyntax).command.expression).line;
        this.instructions.push(InstructionFactory.StatementStart(lineNumber));

        this.emitExpression(statement.value);
        this.instructions.push(InstructionFactory.StoreVariable(statement.identifier));
    }

    private emitArrayAssignment(statement: ArrayAssignmentBoundStatement): void {
        const range = getExpressionRange((statement.syntax as ExpressionStatementSyntax).command.expression);
        this.instructions.push(InstructionFactory.StatementStart(range.line));

        statement.indices.reverse().forEach(index => this.emitExpression(index));
        this.emitExpression(statement.value);

        this.instructions.push(InstructionFactory.StoreArray(statement.identifier, statement.indices.length, range));
    }

    private emitPropertyAssignment(statement: PropertyAssignmentBoundStatement): void {
        const lineNumber = getExpressionRange((statement.syntax as ExpressionStatementSyntax).command.expression).line;
        this.instructions.push(InstructionFactory.StatementStart(lineNumber));

        this.emitExpression(statement.value);
        this.instructions.push(InstructionFactory.StoreProperty(statement.library, statement.property));
    }

    private emitExpression(expression: BaseBoundExpression): void {
        switch (expression.kind) {
            case BoundExpressionKind.Negation: this.emitNegationExpression(expression as NegationBoundExpression); break;
            case BoundExpressionKind.Or: this.emitOrExpression(expression as OrBoundExpression); break;
            case BoundExpressionKind.And: this.emitAndExpression(expression as AndBoundExpression); break;
            case BoundExpressionKind.NotEqual: this.emitNotEqualExpression(expression as NotEqualBoundExpression); break;
            case BoundExpressionKind.Equal: this.emitEqualExpression(expression as EqualBoundExpression); break;
            case BoundExpressionKind.LessThan: this.emitLessThanExpression(expression as LessThanBoundExpression); break;
            case BoundExpressionKind.GreaterThan: this.emitGreaterThanExpression(expression as GreaterThanBoundExpression); break;
            case BoundExpressionKind.LessThanOrEqual: this.emitLessThanOrEqualExpression(expression as LessThanOrEqualBoundExpression); break;
            case BoundExpressionKind.GreaterThanOrEqual: this.emitGreaterThanOrEqualExpression(expression as GreaterThanOrEqualBoundExpression); break;
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
            default: throw `Unexpected bound expression kind: ${BoundExpressionKind[expression.kind]}`;
        }
    }

    private emitNegationExpression(expression: NegationBoundExpression): void {
        this.emitExpression(expression.expression);
        this.instructions.push(InstructionFactory.Negate());
    }

    private emitOrExpression(expression: OrBoundExpression): void {
        const trySecondLabel = this.generateJumpLabel();
        const trueLabel = this.generateJumpLabel();
        const falseLabel = this.generateJumpLabel();
        const endLabel = this.generateJumpLabel();

        this.emitExpression(expression.leftExpression);
        this.instructions.push(InstructionFactory.TempJumpIfFalse(trySecondLabel));
        this.instructions.push(InstructionFactory.TempJump(trueLabel));

        this.instructions.push(InstructionFactory.TempLabel(trySecondLabel));
        this.emitExpression(expression.rightExpression);
        this.instructions.push(InstructionFactory.TempJumpIfFalse(falseLabel));
        this.instructions.push(InstructionFactory.TempJump(trueLabel));

        this.instructions.push(InstructionFactory.TempLabel(trueLabel));
        this.instructions.push(InstructionFactory.PushString(Constants.True));
        this.instructions.push(InstructionFactory.TempJump(endLabel));

        this.instructions.push(InstructionFactory.TempLabel(falseLabel));
        this.instructions.push(InstructionFactory.PushString(Constants.False));

        this.instructions.push(InstructionFactory.TempLabel(endLabel));
    }

    private emitAndExpression(expression: AndBoundExpression): void {
        const falseLabel = this.generateJumpLabel();
        const endLabel = this.generateJumpLabel();

        this.emitExpression(expression.leftExpression);
        this.instructions.push(InstructionFactory.TempJumpIfFalse(falseLabel));
        this.emitExpression(expression.rightExpression);
        this.instructions.push(InstructionFactory.TempJumpIfFalse(falseLabel));

        this.instructions.push(InstructionFactory.PushString(Constants.True));
        this.instructions.push(InstructionFactory.TempJump(endLabel));

        this.instructions.push(InstructionFactory.TempLabel(falseLabel));
        this.instructions.push(InstructionFactory.PushString(Constants.False));

        this.instructions.push(InstructionFactory.TempLabel(endLabel));
    }

    private emitEqualExpression(expression: EqualBoundExpression): void {
        const notEqualLabel = this.generateJumpLabel();
        const endLabel = this.generateJumpLabel();

        this.emitExpression(expression.leftExpression);
        this.emitExpression(expression.rightExpression);

        this.instructions.push(InstructionFactory.Equal());
        this.instructions.push(InstructionFactory.TempJumpIfFalse(notEqualLabel));

        this.instructions.push(InstructionFactory.PushString(Constants.True));
        this.instructions.push(InstructionFactory.TempJump(endLabel));

        this.instructions.push(InstructionFactory.TempLabel(notEqualLabel));
        this.instructions.push(InstructionFactory.PushString(Constants.False));

        this.instructions.push(InstructionFactory.TempLabel(endLabel));
    }

    private emitNotEqualExpression(expression: NotEqualBoundExpression): void {
        const notEqualLabel = this.generateJumpLabel();
        const endLabel = this.generateJumpLabel();

        this.emitExpression(expression.leftExpression);
        this.emitExpression(expression.rightExpression);

        this.instructions.push(InstructionFactory.Equal());
        this.instructions.push(InstructionFactory.TempJumpIfFalse(notEqualLabel));

        this.instructions.push(InstructionFactory.PushString(Constants.False));
        this.instructions.push(InstructionFactory.TempJump(endLabel));

        this.instructions.push(InstructionFactory.TempLabel(notEqualLabel));
        this.instructions.push(InstructionFactory.PushString(Constants.True));

        this.instructions.push(InstructionFactory.TempLabel(endLabel));
    }

    private emitLessThanExpression(expression: LessThanBoundExpression): void {
        const notLessThan = this.generateJumpLabel();
        const endLabel = this.generateJumpLabel();

        this.emitExpression(expression.leftExpression);
        this.emitExpression(expression.rightExpression);

        this.instructions.push(InstructionFactory.LessThan());
        this.instructions.push(InstructionFactory.TempJumpIfFalse(notLessThan));

        this.instructions.push(InstructionFactory.PushString(Constants.True));
        this.instructions.push(InstructionFactory.TempJump(endLabel));

        this.instructions.push(InstructionFactory.TempLabel(notLessThan));
        this.instructions.push(InstructionFactory.PushString(Constants.False));

        this.instructions.push(InstructionFactory.TempLabel(endLabel));
    }

    private emitGreaterThanExpression(expression: GreaterThanBoundExpression): void {
        const notGreaterThan = this.generateJumpLabel();
        const endLabel = this.generateJumpLabel();

        this.emitExpression(expression.rightExpression);
        this.emitExpression(expression.leftExpression);

        this.instructions.push(InstructionFactory.LessThan());
        this.instructions.push(InstructionFactory.TempJumpIfFalse(notGreaterThan));

        this.instructions.push(InstructionFactory.PushString(Constants.True));
        this.instructions.push(InstructionFactory.TempJump(endLabel));

        this.instructions.push(InstructionFactory.TempLabel(notGreaterThan));
        this.instructions.push(InstructionFactory.PushString(Constants.False));

        this.instructions.push(InstructionFactory.TempLabel(endLabel));
    }

    private emitLessThanOrEqualExpression(expression: LessThanOrEqualBoundExpression): void {
        const greaterThanLabel = this.generateJumpLabel();
        const endLabel = this.generateJumpLabel();

        this.emitExpression(expression.rightExpression);
        this.emitExpression(expression.leftExpression);

        this.instructions.push(InstructionFactory.LessThan());
        this.instructions.push(InstructionFactory.TempJumpIfFalse(greaterThanLabel));

        this.instructions.push(InstructionFactory.PushString(Constants.True));
        this.instructions.push(InstructionFactory.TempJump(endLabel));

        this.instructions.push(InstructionFactory.TempLabel(greaterThanLabel));
        this.instructions.push(InstructionFactory.PushString(Constants.False));

        this.instructions.push(InstructionFactory.TempLabel(endLabel));
    }

    private emitGreaterThanOrEqualExpression(expression: GreaterThanOrEqualBoundExpression): void {
        const lessThanLabel = this.generateJumpLabel();
        const endLabel = this.generateJumpLabel();

        this.emitExpression(expression.leftExpression);
        this.emitExpression(expression.rightExpression);

        this.instructions.push(InstructionFactory.LessThan());
        this.instructions.push(InstructionFactory.TempJumpIfFalse(lessThanLabel));

        this.instructions.push(InstructionFactory.PushString(Constants.True));
        this.instructions.push(InstructionFactory.TempJump(endLabel));

        this.instructions.push(InstructionFactory.TempLabel(lessThanLabel));
        this.instructions.push(InstructionFactory.PushString(Constants.False));

        this.instructions.push(InstructionFactory.TempLabel(endLabel));
    }

    private emitAdditionExpression(expression: AdditionBoundExpression): void {
        this.emitExpression(expression.leftExpression);
        this.emitExpression(expression.rightExpression);
        this.instructions.push(InstructionFactory.Add(getExpressionRange(expression.syntax)));
    }

    private emitSubtractionExpression(expression: SubtractionBoundExpression): void {
        this.emitExpression(expression.leftExpression);
        this.emitExpression(expression.rightExpression);
        this.instructions.push(InstructionFactory.Subtract(getExpressionRange(expression.syntax)));
    }

    private emitMultiplicationExpression(expression: MultiplicationBoundExpression): void {
        this.emitExpression(expression.leftExpression);
        this.emitExpression(expression.rightExpression);
        this.instructions.push(InstructionFactory.Multiply(getExpressionRange(expression.syntax)));
    }

    private emitDivisionExpression(expression: DivisionBoundExpression): void {
        this.emitExpression(expression.leftExpression);
        this.emitExpression(expression.rightExpression);
        this.instructions.push(InstructionFactory.Divide(getExpressionRange(expression.syntax)));
    }

    private emitArrayAccessExpression(expression: ArrayAccessBoundExpression): void {
        expression.indices.forEach(index => this.emitExpression(index));
        this.instructions.push(InstructionFactory.LoadArray(expression.name, expression.indices.length, getExpressionRange(expression.syntax)));
    }

    private emitLibraryPropertyExpression(expression: LibraryPropertyBoundExpression): void {
        this.instructions.push(InstructionFactory.LoadProperty(expression.library, expression.name));
    }

    private emitLibraryMethodCallExpression(expression: LibraryMethodCallBoundExpression): void {
        expression.argumentsList.forEach(argument => this.emitExpression(argument));
        this.instructions.push(InstructionFactory.MethodCall(expression.library, expression.name, expression.argumentsList.length));
    }

    private emitVariableExpression(expression: VariableBoundExpression): void {
        this.instructions.push(InstructionFactory.LoadVariable(expression.name));
    }

    private emitStringLiteralExpression(expression: StringLiteralBoundExpression): void {
        this.instructions.push(InstructionFactory.PushString(expression.value));
    }

    private emitNumberLiteralExpression(expression: NumberLiteralBoundExpression): void {
        this.instructions.push(InstructionFactory.PushNumber(expression.value));
    }

    private emitParenthesisExpression(expression: ParenthesisBoundExpression): void {
        this.emitExpression(expression.expression);
    }

    private replaceTempInstructions(): void {
        const labelToIndexMap: { [key: string]: number } = {};

        for (let i = 0; i < this.instructions.length; i++) {
            if (this.instructions[i].kind === InstructionKind.TempLabel) {
                const label = this.instructions[i] as TempLabelInstruction;
                if (labelToIndexMap[label.name]) {
                    throw `Label ${label.name} exists twice in the same instruction set`;
                }
                labelToIndexMap[label.name] = i;
                this.instructions.splice(i, 1);
                i--;
            }
        }

        for (let i = 0; i < this.instructions.length; i++) {
            switch (this.instructions[i].kind) {
                case InstructionKind.TempJump: {
                    const jump = this.instructions[i] as TempJumpInstruction;
                    const target = labelToIndexMap[jump.target];
                    if (target) {
                        this.instructions[i] = InstructionFactory.Jump(target);
                    } else {
                        throw `Index for label ${jump.target} was not calculated`;
                    }
                    break;
                }
                case InstructionKind.TempJumpIfFalse: {
                    const jump = this.instructions[i] as TempJumpIfFalseInstruction;
                    const target = labelToIndexMap[jump.target];
                    if (target) {
                        this.instructions[i] = InstructionFactory.JumpIfFalse(target);
                    } else {
                        throw `Index for label ${jump.target} was not calculated`;
                    }
                    break;
                }
            }
        }
    }

    private generateJumpLabel(): string {
        return `internal_$$_${this.jumpLabelCounter++}`;
    }
}
