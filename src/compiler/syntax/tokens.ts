import { TextRange } from "./text-markers";

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

export interface Token {
    readonly text: string;
    readonly kind: TokenKind;
    readonly range: TextRange;
}
