import { TextRange } from "./syntax-nodes";
import { SyntaxNodesResources } from "../../strings/syntax-nodes";

export enum TokenKind {
    UnrecognizedToken,
    MissingToken,

    IfKeyword,
    ThenKeyword,
    ElseKeyword,
    ElseIfKeyword,
    EndIfKeyword,
    ForKeyword,
    ToKeyword,
    StepKeyword,
    EndForKeyword,
    GoToKeyword,
    WhileKeyword,
    EndWhileKeyword,
    SubKeyword,
    EndSubKeyword,

    Dot,
    RightParen,
    LeftParen,
    RightSquareBracket,
    LeftSquareBracket,
    Comma,
    Equal,
    NotEqual,
    Plus,
    Minus,
    Multiply,
    Divide,
    Colon,
    LessThan,
    GreaterThan,
    LessThanOrEqual,
    GreaterThanOrEqual,
    Or,
    And,

    Identifier,
    NumberLiteral,
    StringLiteral,
    Comment
}

export class Token {
    public constructor(
        public readonly text: string,
        public readonly kind: TokenKind,
        public readonly range: TextRange) {
    }

    public static toDisplayString(kind: TokenKind): string {
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

            default:
                throw new Error(`Unrecognized token kind: ${TokenKind[kind]}`);
        }
    }
}
