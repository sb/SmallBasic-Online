import { ErrorCode, Diagnostic } from "../diagnostics";
import { BaseCommandSyntax, IfCommandSyntax, ElseIfCommandSyntax, ElseCommandSyntax, EndIfCommandSyntax, ForCommandSyntax, ForStepClause, EndForCommandSyntax, WhileCommandSyntax, EndWhileCommandSyntax, LabelCommandSyntax, GoToCommandSyntax, SubCommandSyntax, EndSubCommandSyntax, ExpressionCommandSyntax } from "./nodes/commands";
import { BaseExpressionSyntax, BinaryOperatorExpressionSyntax, UnaryOperatorExpressionSyntax, ObjectAccessExpressionSyntax, ArrayAccessExpressionSyntax, CallExpressionSyntax, IdentifierExpressionSyntax, NumberLiteralExpressionSyntax, StringLiteralExpressionSyntax, ParenthesisExpressionSyntax } from "./nodes/expressions";
import { TokenKind, Token } from "./tokens";
import { CompilerRange } from "./ranges";

export class CommandsParser {
    private _index: number = 0;
    private _line: number = 0;
    private _currentLineHasErrors: boolean = false;

    private _result: BaseCommandSyntax[] = [];
    private _diagnostics: Diagnostic[] = [];

    public get result(): ReadonlyArray<BaseCommandSyntax> {
        return this._result;
    }

    public get diagnostics(): ReadonlyArray<Diagnostic> {
        return this._diagnostics;
    }

    public constructor(private readonly _tokens: ReadonlyArray<Token>) {
        this._tokens = this._tokens.filter(token => {
            switch (token.kind) {
                // Ignore tokens that shouldn't be parsed.
                case TokenKind.Comment:
                case TokenKind.UnrecognizedToken:
                    return false;
                default:
                    return true;
            }
        });

        while (this._index < this._tokens.length) {
            this._currentLineHasErrors = false;
            this.parseNextCommand();

            while (this._index < this._tokens.length && this._line === this._tokens[this._index].range.start.line) {
                this._index++;
            }

            this._line++;
        }
    }

    private parseNextCommand(): void {
        let current = this.peek();

        if (current) {
            switch (current.kind) {
                case TokenKind.IfKeyword: this._result.push(this.parseIfCommand()); break;
                case TokenKind.ElseKeyword: this._result.push(this.parseElseCommand()); break;
                case TokenKind.ElseIfKeyword: this._result.push(this.parseElseIfCommand()); break;
                case TokenKind.EndIfKeyword: this._result.push(this.parseEndIfCommand()); break;

                case TokenKind.ForKeyword: this._result.push(this.parseForCommand()); break;
                case TokenKind.EndForKeyword: this._result.push(this.parseEndForCommand()); break;

                case TokenKind.WhileKeyword: this._result.push(this.parseWhileCommand()); break;
                case TokenKind.EndWhileKeyword: this._result.push(this.parseEndWhileCommand()); break;

                case TokenKind.GoToKeyword: this._result.push(this.parseGoToCommand()); break;
                case TokenKind.Identifier:
                    if (this.isNext(TokenKind.Colon, 1)) {
                        this._result.push(this.parseLabelCommand());
                    } else {
                        this._result.push(this.parseExpressionCommand());
                    }
                    break;

                case TokenKind.SubKeyword: this._result.push(this.parseSubCommand()); break;
                case TokenKind.EndSubKeyword: this._result.push(this.parseEndSubCommand()); break;

                case TokenKind.Minus:
                case TokenKind.NumberLiteral:
                case TokenKind.StringLiteral:
                case TokenKind.LeftParen:
                    this._result.push(this.parseExpressionCommand());
                    break;

                default:
                    this.eat(current.kind);
                    this.reportError(new Diagnostic(ErrorCode.UnrecognizedCommand, current.range, current.text));
                    break;
            }
        }

        current = this.peek();
        if (current) {
            this.reportError(new Diagnostic(ErrorCode.UnexpectedToken_ExpectingEOL, current.range, current.text));
        }
    }

    private parseIfCommand(): IfCommandSyntax {
        const ifKeyword = this.eat(TokenKind.IfKeyword);
        const expression = this.parseBaseExpression();
        const thenKeyword = this.eat(TokenKind.ThenKeyword);

        return new IfCommandSyntax(ifKeyword, expression, thenKeyword);
    }

    private parseElseIfCommand(): ElseIfCommandSyntax {
        const elseIfKeyword = this.eat(TokenKind.ElseIfKeyword);
        const expression = this.parseBaseExpression();
        const thenKeyword = this.eat(TokenKind.ThenKeyword);

        return new ElseIfCommandSyntax(elseIfKeyword, expression, thenKeyword);
    }

    private parseElseCommand(): ElseCommandSyntax {
        const elseKeyword = this.eat(TokenKind.ElseKeyword);

        return new ElseCommandSyntax(elseKeyword);
    }

    private parseEndIfCommand(): EndIfCommandSyntax {
        const endIfKeyword = this.eat(TokenKind.EndIfKeyword);

        return new EndIfCommandSyntax(endIfKeyword);
    }

    private parseForCommand(): ForCommandSyntax {
        const forKeyword = this.eat(TokenKind.ForKeyword);
        const identifierToken = this.eat(TokenKind.Identifier);
        const equalToken = this.eat(TokenKind.Equal);
        const fromExpression = this.parseBaseExpression();
        const toToken = this.eat(TokenKind.ToKeyword);
        const toExpression = this.parseBaseExpression();

        let stepClauseSyntax: ForStepClause | undefined;

        if (this.isNext(TokenKind.StepKeyword)) {
            const stepToken = this.eat(TokenKind.StepKeyword);
            const stepExpression = this.parseBaseExpression();

            stepClauseSyntax = {
                stepToken: stepToken,
                expression: stepExpression
            };
        }

        return new ForCommandSyntax(forKeyword, identifierToken, equalToken, fromExpression, toToken, toExpression, stepClauseSyntax);
    }

    private parseEndForCommand(): EndForCommandSyntax {
        const endForKeyword = this.eat(TokenKind.EndForKeyword);

        return new EndForCommandSyntax(endForKeyword);
    }

    private parseWhileCommand(): WhileCommandSyntax {
        const whileToken = this.eat(TokenKind.WhileKeyword);
        const expression = this.parseBaseExpression();

        return new WhileCommandSyntax(whileToken, expression);
    }

    private parseEndWhileCommand(): EndWhileCommandSyntax {
        const endWhileKeyword = this.eat(TokenKind.EndWhileKeyword);

        return new EndWhileCommandSyntax(endWhileKeyword);
    }

    private parseLabelCommand(): LabelCommandSyntax {
        const labelToken = this.eat(TokenKind.Identifier);
        const colonToken = this.eat(TokenKind.Colon);

        return new LabelCommandSyntax(labelToken, colonToken);
    }

    private parseGoToCommand(): GoToCommandSyntax {
        const gotoToken = this.eat(TokenKind.GoToKeyword);
        const labelToken = this.eat(TokenKind.Identifier);

        return new GoToCommandSyntax(gotoToken, labelToken);
    }

    private parseSubCommand(): SubCommandSyntax {
        const subToken = this.eat(TokenKind.SubKeyword);
        const nameToken = this.eat(TokenKind.Identifier);

        return new SubCommandSyntax(subToken, nameToken);
    }

    private parseEndSubCommand(): EndSubCommandSyntax {
        const endSubToken = this.eat(TokenKind.EndSubKeyword);

        return new EndSubCommandSyntax(endSubToken);
    }

    private parseExpressionCommand(): ExpressionCommandSyntax {
        const expression = this.parseBaseExpression();

        return new ExpressionCommandSyntax(expression);
    }

    private parseBaseExpression(): BaseExpressionSyntax {
        return this.parseBinaryOperator(0);
    }

    private parseBinaryOperator(precedence: number): BaseExpressionSyntax {
        if (precedence >= CommandsParser.BinaryOperatorPrecedence.length) {
            return this.parseUnaryOperator();
        }

        let expression = this.parseBinaryOperator(precedence + 1);
        const expectedOperatorKind = CommandsParser.BinaryOperatorPrecedence[precedence];

        while (this.isNext(expectedOperatorKind)) {
            const operatorToken = this.eat(expectedOperatorKind);
            const rightHandSide = this.parseBinaryOperator(precedence + 1);

            expression = new BinaryOperatorExpressionSyntax(expression, operatorToken, rightHandSide);
        }

        return expression;
    }

    private parseUnaryOperator(): BaseExpressionSyntax {
        if (this.isNext(TokenKind.Minus)) {
            const minusToken = this.eat(TokenKind.Minus);
            const expression = this.parseBaseExpression();

            return new UnaryOperatorExpressionSyntax(minusToken, expression);
        }

        return this.parseCoreExpression();
    }

    private parseCoreExpression(): BaseExpressionSyntax {
        let current: Token | undefined;
        let expression = this.parseTerminalExpression();

        postfixExpression: while (current = this.peek()) {
            switch (current.kind) {
                case TokenKind.Dot: {
                    const dotToken = this.eat(TokenKind.Dot);
                    const identifierToken = this.eat(TokenKind.Identifier);

                    expression = new ObjectAccessExpressionSyntax(expression, dotToken, identifierToken);
                    break;
                }
                case TokenKind.LeftSquareBracket: {
                    const leftSquareBracket = this.eat(TokenKind.LeftSquareBracket);
                    const indexExpression = this.parseBaseExpression();
                    const rightSquareBracket = this.eat(TokenKind.RightSquareBracket);

                    expression = new ArrayAccessExpressionSyntax(expression, leftSquareBracket, indexExpression, rightSquareBracket);
                    break;
                }
                case TokenKind.LeftParen: {
                    const leftParen = this.eat(TokenKind.LeftParen);

                    const argumentsList: BaseExpressionSyntax[] = [];
                    const commasList: Token[] = [];

                    current = this.peek();
                    let expectingComma = false;

                    if (current && (current.kind !== TokenKind.RightParen)) {
                        loop: while (current) {
                            if (expectingComma) {
                                switch (current.kind) {
                                    case TokenKind.Comma: {
                                        commasList.push(this.eat(TokenKind.Comma));
                                        break;
                                    }
                                    case TokenKind.RightParen: {
                                        break loop;
                                    }
                                    default: {
                                        this.reportError(new Diagnostic(
                                            ErrorCode.UnexpectedToken_ExpectingToken,
                                            current.range,
                                            current.text,
                                            Token.toDisplayString(TokenKind.Comma)));

                                        commasList.push(this.createMissingToken(current.range));
                                        break;
                                    }
                                }
                            }
                            else {
                                argumentsList.push(this.parseBaseExpression());
                            }

                            expectingComma = !expectingComma;
                            current = this.peek();
                        }
                    }

                    const rightParen = this.eat(TokenKind.RightParen);
                    expression = new CallExpressionSyntax(expression, leftParen, argumentsList, commasList, rightParen);
                    break;
                }
                default:
                    break postfixExpression;
            }
        }

        return expression;
    }

    private parseTerminalExpression(): BaseExpressionSyntax {
        const current = this.peek();
        if (!current) {
            const range = this._tokens[this._index - 1].range;
            this.reportError(new Diagnostic(ErrorCode.UnexpectedEOL_ExpectingExpression, range));
            return new IdentifierExpressionSyntax(this.createMissingToken(range));
        }

        switch (current.kind) {
            case TokenKind.Identifier: {
                const identifierToken = this.eat(TokenKind.Identifier);
                return new IdentifierExpressionSyntax(identifierToken);
            }
            case TokenKind.NumberLiteral: {
                const numberToken = this.eat(TokenKind.NumberLiteral);
                return new NumberLiteralExpressionSyntax(numberToken);
            }
            case TokenKind.StringLiteral: {
                const stringToken = this.eat(TokenKind.StringLiteral);
                return new StringLiteralExpressionSyntax(stringToken);
            }
            case TokenKind.LeftParen: {
                const leftParen = this.eat(TokenKind.LeftParen);
                const expression = this.parseBaseExpression();
                const rightParen = this.eat(TokenKind.RightParen);

                return new ParenthesisExpressionSyntax(leftParen, expression, rightParen);
            }
            default: {
                this.eat(current.kind);
                this.reportError(new Diagnostic(ErrorCode.UnexpectedToken_ExpectingExpression, current.range, current.text));
                return new IdentifierExpressionSyntax(this.createMissingToken(current.range));
            }
        }
    }

    private isNext(kind: TokenKind, offset?: number): boolean {
        const current = this.peek(offset);
        return !!current && current.kind === kind;
    }

    private peek(offset?: number): Token | undefined {
        offset || (offset = 0);
        if (this._index + offset < this._tokens.length) {
            const current = this._tokens[this._index + offset];
            if (current.range.start.line === this._line) {
                return current;
            }
        }

        return;
    }

    private eat(kind: TokenKind): Token {
        if (this._index < this._tokens.length) {
            const current = this._tokens[this._index];
            if (current.range.start.line === this._line) {
                if (current.kind === kind) {
                    this._index++;
                    return current;
                } else {
                    this.reportError(new Diagnostic(ErrorCode.UnexpectedToken_ExpectingToken, current.range, current.text, Token.toDisplayString(kind)));
                    return this.createMissingToken(current.range);
                }
            }
        }

        const range = this._tokens[this._index - 1].range;
        this.reportError(new Diagnostic(ErrorCode.UnexpectedEOL_ExpectingToken, range, Token.toDisplayString(kind)));
        return this.createMissingToken(range);
    }

    private createMissingToken(range: CompilerRange): Token {
        return new Token("<Missing>", TokenKind.MissingToken, range);
    }

    private reportError(error: Diagnostic): void {
        if (!this._currentLineHasErrors) {
            this._diagnostics.push(error);
            this._currentLineHasErrors = true;
        }
    }

    private static BinaryOperatorPrecedence: TokenKind[] = [
        TokenKind.Or,
        TokenKind.And,
        TokenKind.Equal,
        TokenKind.NotEqual,
        TokenKind.LessThan,
        TokenKind.GreaterThan,
        TokenKind.LessThanOrEqual,
        TokenKind.GreaterThanOrEqual,
        TokenKind.Plus,
        TokenKind.Minus,
        TokenKind.Multiply,
        TokenKind.Divide
    ];
}
