import { ErrorCode, Diagnostic } from "../diagnostics";
import { Token, TokenKind } from "./tokens";
import { CompilerRange } from "./ranges";

export class Scanner {
    private _index: number = 0;
    private _line: number = 0;
    private _column: number = 0;

    private _result: Token[] = [];

    public get result(): ReadonlyArray<Token> {
        return this._result;
    }

    public constructor(private readonly _text: string, private readonly _diagnostics: Diagnostic[]) {
        while (this.scanNextToken());
    }

    private scanNextToken(): boolean {
        let current: string | undefined = undefined;
        let next: string | undefined = undefined;

        if (this._index + 1 < this._text.length) {
            current = this._text[this._index];
            next = this._text[this._index + 1];
        } else if (this._index < this._text.length) {
            current = this._text[this._index];
        } else {
            return false;
        }

        switch (current) {
            case "\r": switch (next) {
                case "\n": this._index += 2; this._line++; this._column = 0; return true;
                default: this._index++; this._line++; this._column = 0; return true;
            }

            case "\n": this._index++; this._line++; this._column = 0; return true;
            case " ": this._index++; this._column++; return true;
            case "\t": this._index++; this._column++; return true;

            case "(": this.addToken(current, TokenKind.LeftParen); return true;
            case ")": this.addToken(current, TokenKind.RightParen); return true;
            case "[": this.addToken(current, TokenKind.LeftSquareBracket); return true;
            case "]": this.addToken(current, TokenKind.RightSquareBracket); return true;

            case ".": this.addToken(current, TokenKind.Dot); return true;
            case ",": this.addToken(current, TokenKind.Comma); return true;
            case "=": this.addToken(current, TokenKind.Equal); return true;
            case ":": this.addToken(current, TokenKind.Colon); return true;

            case "+": this.addToken(current, TokenKind.Plus); return true;
            case "-": this.addToken(current, TokenKind.Minus); return true;
            case "*": this.addToken(current, TokenKind.Multiply); return true;
            case "/": this.addToken(current, TokenKind.Divide); return true;

            case "<": switch (next) {
                case ">": this.addToken(current + next, TokenKind.NotEqual); return true;
                case "=": this.addToken(current + next, TokenKind.LessThanOrEqual); return true;
                default: this.addToken(current, TokenKind.LessThan); return true;
            }

            case ">": switch (next) {
                case "=": this.addToken(current + next, TokenKind.GreaterThanOrEqual); return true;
                default: this.addToken(current, TokenKind.GreaterThan); return true;
            }

            case "\'": this.scanCommentToken(); return true;
            case "\"": this.scanStringToken(); return true;
        }

        if ("0" <= current && current <= "9") {
            this.scanNumberToken();
            return true;
        } else if (current === "_" || "a" <= current && current <= "z" || "A" <= current && current <= "Z") {
            this.scanWordToken();
            return true;
        }

        const token = this.addToken(current, TokenKind.UnrecognizedToken);
        this._diagnostics.push(new Diagnostic(ErrorCode.UnrecognizedCharacter, token.range, current));

        return true;
    }

    private scanCommentToken(): void {
        let lookAhead = this._index;
        while (lookAhead < this._text.length) {
            const current = this._text[lookAhead];
            if (current === "\r" || current === "\n") {
                break;
            }
            lookAhead++;
        }

        this.addToken(this._text.substr(this._index, lookAhead - this._index).trim(), TokenKind.Comment);
    }

    private scanStringToken(): void {
        let lookAhead = this._index + 1;
        while (lookAhead < this._text.length) {
            const ch = this._text[lookAhead];
            switch (ch) {
                case "\"":
                    this.addToken(this._text.substr(this._index, lookAhead - this._index + 1), TokenKind.StringLiteral);
                    return;
                case "\r":
                case "\n":
                    const token = this.addToken(this._text.substr(this._index, lookAhead - this._index), TokenKind.StringLiteral);
                    this._diagnostics.push(new Diagnostic(ErrorCode.UnterminatedStringLiteral, token.range));
                    return;
                default:
                    if (!Scanner.isSupportedCharacter(ch)) {
                        const column = this._column + lookAhead - this._index;
                        const range = CompilerRange.fromValues(this._line, column, this._line, column);
                        this._diagnostics.push(new Diagnostic(ErrorCode.UnrecognizedCharacter, range, ch));
                    }

                    lookAhead++;
                    break;
            }
        }

        const unrecognizedToken = this.addToken(this._text.substr(this._index, lookAhead - this._index), TokenKind.StringLiteral);
        this._diagnostics.push(new Diagnostic(ErrorCode.UnterminatedStringLiteral, unrecognizedToken.range));
    }

    private scanNumberToken(): void {
        let lookAhead = this._index;
        while (lookAhead < this._text.length && "0" <= this._text[lookAhead] && this._text[lookAhead] <= "9") {
            lookAhead++;
        }

        if (lookAhead < this._text.length && this._text[lookAhead] === ".") {
            lookAhead++;

            while (lookAhead < this._text.length && "0" <= this._text[lookAhead] && this._text[lookAhead] <= "9") {
                lookAhead++;
            }
        }

        this.addToken(this._text.substr(this._index, lookAhead - this._index), TokenKind.NumberLiteral);
    }

    private scanWordToken(): void {
        let lookAhead = this._index;
        while (lookAhead < this._text.length) {
            const current = this._text[lookAhead];
            if (current === "_" || "a" <= current && current <= "z" || "A" <= current && current <= "Z" || "0" <= current && current <= "9") {
                lookAhead++;
            } else {
                break;
            }
        }

        const word = this._text.substr(this._index, lookAhead - this._index);

        switch (word.toLowerCase()) {
            case "if": this.addToken(word, TokenKind.IfKeyword); return;
            case "then": this.addToken(word, TokenKind.ThenKeyword); return;
            case "else": this.addToken(word, TokenKind.ElseKeyword); return;
            case "elseif": this.addToken(word, TokenKind.ElseIfKeyword); return;
            case "endif": this.addToken(word, TokenKind.EndIfKeyword); return;
            case "for": this.addToken(word, TokenKind.ForKeyword); return;
            case "to": this.addToken(word, TokenKind.ToKeyword); return;
            case "step": this.addToken(word, TokenKind.StepKeyword); return;
            case "endfor": this.addToken(word, TokenKind.EndForKeyword); return;
            case "goto": this.addToken(word, TokenKind.GoToKeyword); return;
            case "while": this.addToken(word, TokenKind.WhileKeyword); return;
            case "endwhile": this.addToken(word, TokenKind.EndWhileKeyword); return;
            case "sub": this.addToken(word, TokenKind.SubKeyword); return;
            case "endsub": this.addToken(word, TokenKind.EndSubKeyword); return;
            case "or": this.addToken(word, TokenKind.Or); return;
            case "and": this.addToken(word, TokenKind.And); return;
            default: this.addToken(word, TokenKind.Identifier); return;
        }
    }

    private addToken(current: string, kind: TokenKind): Token {
        const token = new Token(current, kind, CompilerRange.fromValues(this._line, this._column, this._line, this._column + current.length));
        this._index += current.length;
        this._column += current.length;

        this._result.push(token);
        return token;
    }

    public static isSupportedCharacter(ch: string): boolean {
        if (ch.length !== 1) {
            throw `Must pass a single character at a time`;
        }

        const keycode = ch.charCodeAt(0);
        return 32 <= keycode && keycode <= 126;
    }
}
