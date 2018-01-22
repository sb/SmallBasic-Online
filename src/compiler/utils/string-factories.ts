import { TokenKind } from "../syntax/tokens";
import { CommandSyntaxKind } from "../models/syntax-commands";
import { SyntaxKindResources } from "../strings/syntax-kinds";
import { TokenKindResources } from "../strings/token-kinds";

export function CommandSyntaxKindToString(kind: CommandSyntaxKind): string {
    switch (kind) {
        case CommandSyntaxKind.If: return SyntaxKindResources.IfCommandSyntax;
        case CommandSyntaxKind.Else: return SyntaxKindResources.ElseCommandSyntax;
        case CommandSyntaxKind.ElseIf: return SyntaxKindResources.ElseIfCommandSyntax;
        case CommandSyntaxKind.EndIf: return SyntaxKindResources.EndIfCommandSyntax;
        case CommandSyntaxKind.For: return SyntaxKindResources.ForCommandSyntax;
        case CommandSyntaxKind.EndFor: return SyntaxKindResources.EndForCommandSyntax;
        case CommandSyntaxKind.While: return SyntaxKindResources.WhileCommandSyntax;
        case CommandSyntaxKind.EndWhile: return SyntaxKindResources.EndWhileCommandSyntax;
        case CommandSyntaxKind.Label: return SyntaxKindResources.LabelCommandSyntax;
        case CommandSyntaxKind.GoTo: return SyntaxKindResources.GoToCommandSyntax;
        case CommandSyntaxKind.Sub: return SyntaxKindResources.SubCommandSyntax;
        case CommandSyntaxKind.EndSub: return SyntaxKindResources.EndSubCommandSyntax;
        case CommandSyntaxKind.Expression: return SyntaxKindResources.ExpressionCommandSyntax;

        default:
            throw new Error(`Unrecognized syntax kind: ${CommandSyntaxKind[kind]}`);
    }
}

export function TokenKindToString(kind: TokenKind): string {
    switch (kind) {
        case TokenKind.IfKeyword: return "If";
        case TokenKind.ThenKeyword: return "Then";
        case TokenKind.ElseKeyword: return "Else";
        case TokenKind.ElseIfKeyword: return "ElseIf";
        case TokenKind.EndIfKeyword: return "EndIf";
        case TokenKind.ForKeyword: return "For";
        case TokenKind.ToKeyword: return "To";
        case TokenKind.StepKeyword: return "Step";
        case TokenKind.EndForKeyword: return "EndFor";
        case TokenKind.GoToKeyword: return "GoTo";
        case TokenKind.WhileKeyword: return "While";
        case TokenKind.EndWhileKeyword: return "EndWhile";
        case TokenKind.SubKeyword: return "Sub";
        case TokenKind.EndSubKeyword: return "EndSub";

        case TokenKind.Dot: return ".";
        case TokenKind.RightParen: return ")";
        case TokenKind.LeftParen: return "(";
        case TokenKind.RightSquareBracket: return "]";
        case TokenKind.LeftSquareBracket: return "[";
        case TokenKind.Comma: return ",";
        case TokenKind.Equal: return "=";
        case TokenKind.NotEqual: return "<>";
        case TokenKind.Plus: return "+";
        case TokenKind.Minus: return "-";
        case TokenKind.Multiply: return "*";
        case TokenKind.Divide: return "/";
        case TokenKind.Colon: return ":";
        case TokenKind.LessThan: return "<";
        case TokenKind.GreaterThan: return ">";
        case TokenKind.LessThanOrEqual: return "<=";
        case TokenKind.GreaterThanOrEqual: return ">=";
        case TokenKind.Or: return "Or";
        case TokenKind.And: return "And";

        case TokenKind.Identifier: return TokenKindResources.Identifier;
        case TokenKind.NumberLiteral: return TokenKindResources.NumberLiteral;
        case TokenKind.StringLiteral: return TokenKindResources.StringLiteral;
        case TokenKind.Comment: return TokenKindResources.Comment;

        default:
            throw new Error(`Unrecognized token kind: ${TokenKind[kind]}`);
    }
}
