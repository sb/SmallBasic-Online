import { TokenKind } from "../syntax/tokens";
import { CommandSyntaxKind } from "../models/syntax-commands";
import { KeyToString, StringKey } from "../utils/strings";

export function CommandSyntaxKindToString(kind: CommandSyntaxKind): string {
    switch (kind) {
        case CommandSyntaxKind.If: return KeyToString(StringKey.SyntaxKind_IfCommandSyntax);
        case CommandSyntaxKind.Else: return KeyToString(StringKey.SyntaxKind_ElseCommandSyntax);
        case CommandSyntaxKind.ElseIf: return KeyToString(StringKey.SyntaxKind_ElseIfCommandSyntax);
        case CommandSyntaxKind.EndIf: return KeyToString(StringKey.SyntaxKind_EndIfCommandSyntax);
        case CommandSyntaxKind.For: return KeyToString(StringKey.SyntaxKind_ForCommandSyntax);
        case CommandSyntaxKind.EndFor: return KeyToString(StringKey.SyntaxKind_EndForCommandSyntax);
        case CommandSyntaxKind.While: return KeyToString(StringKey.SyntaxKind_WhileCommandSyntax);
        case CommandSyntaxKind.EndWhile: return KeyToString(StringKey.SyntaxKind_EndWhileCommandSyntax);
        case CommandSyntaxKind.Label: return KeyToString(StringKey.SyntaxKind_LabelCommandSyntax);
        case CommandSyntaxKind.GoTo: return KeyToString(StringKey.SyntaxKind_GoToCommandSyntax);
        case CommandSyntaxKind.Sub: return KeyToString(StringKey.SyntaxKind_SubCommandSyntax);
        case CommandSyntaxKind.EndSub: return KeyToString(StringKey.SyntaxKind_EndSubCommandSyntax);
        case CommandSyntaxKind.Expression: return KeyToString(StringKey.SyntaxKind_ExpressionCommandSyntax);

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

        case TokenKind.Identifier: return KeyToString(StringKey.TokenKind_Identifier);
        case TokenKind.NumberLiteral: return KeyToString(StringKey.TokenKind_NumberLiteral);
        case TokenKind.StringLiteral: return KeyToString(StringKey.TokenKind_StringLiteral);
        case TokenKind.Comment: return KeyToString(StringKey.TokenKind_Comment);

        default:
            throw `Unrecognized token kind: ${TokenKind[kind]}`;
    }
}
