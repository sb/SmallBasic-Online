import {
    BaseCommandSyntax,
    CommandSyntaxKind,
    ElseCommandSyntax,
    ElseIfCommandSyntax,
    EndForCommandSyntax,
    EndIfCommandSyntax,
    EndSubCommandSyntax,
    EndWhileCommandSyntax,
    ExpressionCommandSyntax,
    ForCommandSyntax,
    GoToCommandSyntax,
    IfCommandSyntax,
    LabelCommandSyntax,
    MissingCommandSyntax,
    SubCommandSyntax,
    WhileCommandSyntax
} from "../models/syntax-commands";
import {
    ArrayAccessExpressionSyntax,
    BaseExpressionSyntax,
    BinaryOperatorExpressionSyntax,
    CallExpressionSyntax,
    ExpressionSyntaxKind,
    ObjectAccessExpressionSyntax,
    ParenthesisExpressionSyntax,
    UnaryOperatorExpressionSyntax,
    IdentifierExpressionSyntax,
    NumberLiteralExpressionSyntax,
    StringLiteralExpressionSyntax,
    MissingExpressionSyntax
} from "../models/syntax-expressions";

export interface TextRange {
    readonly line: number;
    readonly start: number;
    readonly end: number;
}

function union(first: TextRange, last: TextRange): TextRange {
    if (first.line !== last.line) {
        throw `First and last lines must match. Found '${first.line}' and '${last.line}'`;
    }

    return {
        line: first.line,
        start: first.start,
        end: last.end
    };
}

export function getExpressionRange(current: BaseExpressionSyntax): TextRange {
    switch (current.kind) {
        case ExpressionSyntaxKind.UnaryOperator: {
            const unary = current as UnaryOperatorExpressionSyntax;
            return union(unary.operatorToken.range, getExpressionRange(unary.expression));
        }
        case ExpressionSyntaxKind.BinaryOperator: {
            const binary = current as BinaryOperatorExpressionSyntax;
            return union(getExpressionRange(binary.leftExpression), getExpressionRange(binary.rightExpression));
        }
        case ExpressionSyntaxKind.Call: {
            const call = current as CallExpressionSyntax;
            return union(getExpressionRange(call.baseExpression), call.rightParenToken.range);
        }
        case ExpressionSyntaxKind.ObjectAccess: {
            const objectAccess = current as ObjectAccessExpressionSyntax;
            return union(getExpressionRange(objectAccess.baseExpression), objectAccess.identifierToken.range);
        }
        case ExpressionSyntaxKind.ArrayAccess: {
            const arrayAccess = current as ArrayAccessExpressionSyntax;
            return union(getExpressionRange(arrayAccess.baseExpression), arrayAccess.rightBracketToken.range);
        }
        case ExpressionSyntaxKind.Parenthesis: {
            const parenthesis = current as ParenthesisExpressionSyntax;
            return union(parenthesis.leftParenToken.range, parenthesis.rightParenToken.range);
        }
        case ExpressionSyntaxKind.Identifier: {
            return (current as IdentifierExpressionSyntax).token.range;
        }
        case ExpressionSyntaxKind.NumberLiteral: {
            return (current as NumberLiteralExpressionSyntax).token.range;
        }
        case ExpressionSyntaxKind.StringLiteral: {
            return (current as StringLiteralExpressionSyntax).token.range;
        }
        case ExpressionSyntaxKind.Missing: {
            return (current as MissingExpressionSyntax).range;
        }
    }
}

export function getCommandRange(current: BaseCommandSyntax): TextRange {
    switch (current.kind) {
        case CommandSyntaxKind.If: {
            const ifCommand = current as IfCommandSyntax;
            return union(ifCommand.ifToken.range, ifCommand.thenToken.range);
        }
        case CommandSyntaxKind.Else: {
            return (current as ElseCommandSyntax).elseToken.range;
        }
        case CommandSyntaxKind.ElseIf: {
            const elseIfCommand = current as ElseIfCommandSyntax;
            return union(elseIfCommand.elseIfToken.range, elseIfCommand.thenToken.range);
        }
        case CommandSyntaxKind.EndIf: {
            return (current as EndIfCommandSyntax).endIfToken.range;
        }
        case CommandSyntaxKind.For: {
            const forCommand = current as ForCommandSyntax;
            const lastExpression = forCommand.stepClause ? forCommand.stepClause.expression : forCommand.toExpression;
            return union(forCommand.forToken.range, getExpressionRange(lastExpression));
        }
        case CommandSyntaxKind.EndFor: {
            return (current as EndForCommandSyntax).endForToken.range;
        }
        case CommandSyntaxKind.Sub: {
            const subCommand = current as SubCommandSyntax;
            return union(subCommand.subToken.range, subCommand.nameToken.range);
        }
        case CommandSyntaxKind.EndSub: {
            return (current as EndSubCommandSyntax).endSubToken.range;
        }
        case CommandSyntaxKind.While: {
            const whileCommand = current as WhileCommandSyntax;
            return union(whileCommand.whileToken.range, getExpressionRange(whileCommand.expression));
        }
        case CommandSyntaxKind.EndWhile: {
            return (current as EndWhileCommandSyntax).endWhileToken.range;
        }
        case CommandSyntaxKind.Expression: {
            return getExpressionRange((current as ExpressionCommandSyntax).expression);
        }
        case CommandSyntaxKind.Label: {
            const labelCommand = current as LabelCommandSyntax;
            return union(labelCommand.labelToken.range, labelCommand.colonToken.range);
        }
        case CommandSyntaxKind.GoTo: {
            const goToCommand = current as GoToCommandSyntax;
            return union(goToCommand.goToToken.range, goToCommand.labelToken.range);
        }
        case CommandSyntaxKind.Missing: {
            return (current as MissingCommandSyntax).range;
        }
        case CommandSyntaxKind.ForStepClause: {
            throw `Unsupported command kind: ${CommandSyntaxKind[current.kind]}`;
        }
    }
}
