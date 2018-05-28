import { CompilerRange } from "./ranges";

export enum TokenKind {
    UnrecognizedToken,

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
        public readonly range: CompilerRange) {
    }
}
