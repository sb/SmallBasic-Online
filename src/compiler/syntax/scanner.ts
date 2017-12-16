import { TokenKind, Token } from "./tokens";
import { ErrorCode, Diagnostic } from "../utils/diagnostics";

export class Scanner {
    private index: number = 0;
    private line: number = 0;
    private column: number = 0;

    public readonly tokens: Token[] = [];

    public constructor(private text: string, private diagnostics: Diagnostic[]) {
        while (this.scanNextToken());
    }

    private scanNextToken(): boolean {
        let current: string | undefined = undefined;
        let next: string | undefined = undefined;

        if (this.index + 1 < this.text.length) {
            current = this.text[this.index];
            next = this.text[this.index + 1];
        } else if (this.index < this.text.length) {
            current = this.text[this.index];
        } else {
            return false;
        }

        switch (current) {
            case "\r": switch (next) {
                case "\n": this.index += 2; this.line++; this.column = 0; return true;
                default: this.index++; this.line++; this.column = 0; return true;
            }

            case "\n": this.index++; this.line++; this.column = 0; return true;
            case " ": this.index++; this.column++; return true;
            case "\t": this.index++; this.column++; return true;

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
        this.diagnostics.push(new Diagnostic(ErrorCode.Error_UnrecognizedCharacter, token.range, current));

        return true;
    }

    private scanCommentToken(): void {
        let lookAhead = this.index;
        while (lookAhead < this.text.length) {
            const current = this.text[lookAhead];
            if (current === "\r" || current === "\n") {
                break;
            }
            lookAhead++;
        }

        this.addToken(this.text.substr(this.index, lookAhead - this.index).trim(), TokenKind.Comment);
    }

    private scanStringToken(): void {
        let lookAhead = this.index + 1;
        while (lookAhead < this.text.length) {
            switch (this.text[lookAhead]) {
                case "\"":
                    this.addToken(this.text.substr(this.index, lookAhead - this.index + 1), TokenKind.StringLiteral);
                    return;
                case "\r":
                case "\n":
                    const token = this.addToken(this.text.substr(this.index, lookAhead - this.index), TokenKind.StringLiteral);
                    this.diagnostics.push(new Diagnostic(ErrorCode.Error_UnterminatedStringLiteral, token.range));
                    return;
                default:
                    lookAhead++;
                    break;
            }
        }

        const unrecognizedToken = this.addToken(this.text.substr(this.index, lookAhead - this.index), TokenKind.StringLiteral);
        this.diagnostics.push(new Diagnostic(ErrorCode.Error_UnterminatedStringLiteral, unrecognizedToken.range));
    }

    private scanNumberToken(): void {
        let lookAhead = this.index;
        while (lookAhead < this.text.length && "0" <= this.text[lookAhead] && this.text[lookAhead] <= "9") {
            lookAhead++;
        }

        if (lookAhead < this.text.length && this.text[lookAhead] === ".") {
            lookAhead++;

            while (lookAhead < this.text.length && "0" <= this.text[lookAhead] && this.text[lookAhead] <= "9") {
                lookAhead++;
            }
        }

        this.addToken(this.text.substr(this.index, lookAhead - this.index), TokenKind.NumberLiteral);
    }

    private scanWordToken(): void {
        let lookAhead = this.index;
        while (lookAhead < this.text.length) {
            const current = this.text[lookAhead];
            if (current === "_" || "a" <= current && current <= "z" || "A" <= current && current <= "Z" || "0" <= current && current <= "9") {
                lookAhead++;
            } else {
                break;
            }
        }

        const word = this.text.substr(this.index, lookAhead - this.index);

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
        const token: Token = {
            text: current,
            kind: kind,
            range: {
                line: this.line,
                start: this.column,
                end: this.column + current.length
            }
        };

        this.index += current.length;
        this.column += current.length;

        this.tokens.push(token);
        return token;
    }
}
