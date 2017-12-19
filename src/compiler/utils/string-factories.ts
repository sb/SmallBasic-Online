import { TokenKind } from "../syntax/tokens";
import { CommandSyntaxKind } from "../models/syntax-commands";
import { SyntaxKindResources } from "../strings/syntax-kinds";
import { TokenKindResources } from "../strings/token-kinds";

export function CommandSyntaxKindToString(kind: CommandSyntaxKind): string {
    switch (kind) {
        case CommandSyntaxKind.If: return SyntaxKindResources.toString(SyntaxKindResources.Keys.IfCommandSyntax);
        case CommandSyntaxKind.Else: return SyntaxKindResources.toString(SyntaxKindResources.Keys.ElseCommandSyntax);
        case CommandSyntaxKind.ElseIf: return SyntaxKindResources.toString(SyntaxKindResources.Keys.ElseIfCommandSyntax);
        case CommandSyntaxKind.EndIf: return SyntaxKindResources.toString(SyntaxKindResources.Keys.EndIfCommandSyntax);
        case CommandSyntaxKind.For: return SyntaxKindResources.toString(SyntaxKindResources.Keys.ForCommandSyntax);
        case CommandSyntaxKind.EndFor: return SyntaxKindResources.toString(SyntaxKindResources.Keys.EndForCommandSyntax);
        case CommandSyntaxKind.While: return SyntaxKindResources.toString(SyntaxKindResources.Keys.WhileCommandSyntax);
        case CommandSyntaxKind.EndWhile: return SyntaxKindResources.toString(SyntaxKindResources.Keys.EndWhileCommandSyntax);
        case CommandSyntaxKind.Label: return SyntaxKindResources.toString(SyntaxKindResources.Keys.LabelCommandSyntax);
        case CommandSyntaxKind.GoTo: return SyntaxKindResources.toString(SyntaxKindResources.Keys.GoToCommandSyntax);
        case CommandSyntaxKind.Sub: return SyntaxKindResources.toString(SyntaxKindResources.Keys.SubCommandSyntax);
        case CommandSyntaxKind.EndSub: return SyntaxKindResources.toString(SyntaxKindResources.Keys.EndSubCommandSyntax);
        case CommandSyntaxKind.Expression: return SyntaxKindResources.toString(SyntaxKindResources.Keys.ExpressionCommandSyntax);

        default:
            throw `Unrecognized syntax kind: ${CommandSyntaxKind[kind]}`;
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

        case TokenKind.Identifier: return TokenKindResources.toString(TokenKindResources.Keys.Identifier);
        case TokenKind.NumberLiteral: return TokenKindResources.toString(TokenKindResources.Keys.NumberLiteral);
        case TokenKind.StringLiteral: return TokenKindResources.toString(TokenKindResources.Keys.StringLiteral);
        case TokenKind.Comment: return TokenKindResources.toString(TokenKindResources.Keys.Comment);

        default:
            throw `Unrecognized token kind: ${TokenKind[kind]}`;
    }
}
