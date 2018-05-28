import { SyntaxKind } from "./syntax/syntax-nodes";
import { TokenKind } from "./syntax/tokens";
import { SyntaxNodesResources } from "../strings/syntax-nodes";

export module CompilerUtils {
    export function formatString(template: string, args: ReadonlyArray<string>): string {
        return template.replace(/{[0-9]+}/g, match => args[parseInt(match.replace(/^{/, "").replace(/}$/, ""))]);
    }
    
    export function stringStartsWith(value: string, prefix?: string): boolean {
        if (!prefix || !prefix.length) {
            return true;
        }

        value = value.toLowerCase();
        prefix = prefix.toLocaleLowerCase();

        if (value.length <= prefix.length) {
            return false;
        } else {
            return prefix === value.substr(0, prefix.length);
        }
    }

    export function commandToDisplayString(kind: SyntaxKind): string {
        switch (kind) {
            case SyntaxKind.IfCommand: return tokenToDisplayString(TokenKind.IfKeyword);
            case SyntaxKind.ElseCommand: return tokenToDisplayString(TokenKind.ElseKeyword);
            case SyntaxKind.ElseIfCommand: return tokenToDisplayString(TokenKind.ElseIfKeyword);
            case SyntaxKind.EndIfCommand: return tokenToDisplayString(TokenKind.EndIfKeyword);
            case SyntaxKind.ForCommand: return tokenToDisplayString(TokenKind.ForKeyword);
            case SyntaxKind.EndForCommand: return tokenToDisplayString(TokenKind.EndForKeyword);
            case SyntaxKind.WhileCommand: return tokenToDisplayString(TokenKind.WhileKeyword);
            case SyntaxKind.EndWhileCommand: return tokenToDisplayString(TokenKind.EndWhileKeyword);
            case SyntaxKind.LabelCommand: return SyntaxNodesResources.Label;
            case SyntaxKind.GoToCommand: return tokenToDisplayString(TokenKind.GoToKeyword);
            case SyntaxKind.SubCommand: return tokenToDisplayString(TokenKind.SubKeyword);
            case SyntaxKind.EndSubCommand: return tokenToDisplayString(TokenKind.EndSubKeyword);
            case SyntaxKind.ExpressionCommand: return SyntaxNodesResources.Expression;
            default: throw new Error(`Unexpected syntax kind: ${SyntaxKind[kind]}`);
        }
    }

    export function tokenToDisplayString(kind: TokenKind): string {
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

            case TokenKind.Identifier: return SyntaxNodesResources.Identifier;
            case TokenKind.NumberLiteral: return SyntaxNodesResources.NumberLiteral;
            case TokenKind.StringLiteral: return SyntaxNodesResources.StringLiteral;
            case TokenKind.Comment: return SyntaxNodesResources.Comment;

            default: throw new Error(`Unrecognized token kind: ${TokenKind[kind]}`);
        }
    }
}
