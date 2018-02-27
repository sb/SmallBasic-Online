import { TextRange } from "./text-markers";
import { TokenKindToString } from "../utils/string-factories";
import { Token, TokenKind } from "./tokens";
import { ErrorCode, Diagnostic } from "../utils/diagnostics";
import { BaseExpressionSyntax, ExpressionSyntaxFactory, ExpressionSyntaxKind } from "../models/syntax-expressions";
import {
    BaseCommandSyntax,
    CommandSyntaxFactory,
    ElseCommandSyntax,
    ElseIfCommandSyntax,
    EndForCommandSyntax,
    EndIfCommandSyntax,
    EndSubCommandSyntax,
    EndWhileCommandSyntax,
    ExpressionCommandSyntax,
    ForCommandSyntax,
    ForStepClauseCommandSyntax,
    GoToCommandSyntax,
    IfCommandSyntax,
    LabelCommandSyntax,
    SubCommandSyntax,
    WhileCommandSyntax
} from "../models/syntax-commands";

export class CommandsParser {
    private index: number = 0;
    private line: number = 0;
    private currentLineHasErrors: boolean = false;

    private _commands: BaseCommandSyntax[] = [];

    public get commands(): ReadonlyArray<BaseCommandSyntax> {
        return this._commands;
    }

    public constructor(private tokens: ReadonlyArray<Token>, private diagnostics: Diagnostic[]) {
        this.tokens = this.tokens.filter(token => {
            switch (token.kind) {
                // Ignore tokens that shouldn't be parsed.
                case TokenKind.Comment:
                case TokenKind.UnrecognizedToken:
                    return false;
                default:
                    return true;
            }
        });

        while (this.index < this.tokens.length) {
            this.currentLineHasErrors = false;
            this.parseNextCommand();

            while (this.index < this.tokens.length && this.line === this.tokens[this.index].range.line) {
                this.index++;
            }

            this.line++;
        }
    }

    private parseNextCommand(): void {
        let current = this.peek();

        if (current) {
            switch (current.kind) {
                case TokenKind.IfKeyword: this._commands.push(this.parseIfCommand()); break;
                case TokenKind.ElseKeyword: this._commands.push(this.parseElseCommand()); break;
                case TokenKind.ElseIfKeyword: this._commands.push(this.parseElseIfCommand()); break;
                case TokenKind.EndIfKeyword: this._commands.push(this.parseEndIfCommand()); break;

                case TokenKind.ForKeyword: this._commands.push(this.parseForCommand()); break;
                case TokenKind.EndForKeyword: this._commands.push(this.parseEndForCommand()); break;

                case TokenKind.WhileKeyword: this._commands.push(this.parseWhileCommand()); break;
                case TokenKind.EndWhileKeyword: this._commands.push(this.parseEndWhileCommand()); break;

                case TokenKind.GoToKeyword: this._commands.push(this.parseGoToCommand()); break;
                case TokenKind.Identifier:
                    if (this.isNext(TokenKind.Colon, 1)) {
                        this._commands.push(this.parseLabelCommand());
                    } else {
                        this._commands.push(this.parseExpressionCommand());
                    }
                    break;

                case TokenKind.SubKeyword: this._commands.push(this.parseSubCommand()); break;
                case TokenKind.EndSubKeyword: this._commands.push(this.parseEndSubCommand()); break;

                case TokenKind.Minus:
                case TokenKind.NumberLiteral:
                case TokenKind.StringLiteral:
                case TokenKind.LeftParen:
                    this._commands.push(this.parseExpressionCommand());
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

        return CommandSyntaxFactory.If(ifKeyword, expression, thenKeyword);
    }

    private parseElseIfCommand(): ElseIfCommandSyntax {
        const elseIfKeyword = this.eat(TokenKind.ElseIfKeyword);
        const expression = this.parseBaseExpression();
        const thenKeyword = this.eat(TokenKind.ThenKeyword);

        return CommandSyntaxFactory.ElseIf(elseIfKeyword, expression, thenKeyword);
    }

    private parseElseCommand(): ElseCommandSyntax {
        const elseKeyword = this.eat(TokenKind.ElseKeyword);

        return CommandSyntaxFactory.Else(elseKeyword);
    }

    private parseEndIfCommand(): EndIfCommandSyntax {
        const endIfKeyword = this.eat(TokenKind.EndIfKeyword);

        return CommandSyntaxFactory.EndIf(endIfKeyword);
    }

    private parseForCommand(): ForCommandSyntax {
        const forKeyword = this.eat(TokenKind.ForKeyword);
        const identifierToken = this.eat(TokenKind.Identifier);
        const equalToken = this.eat(TokenKind.Equal);
        const fromExpression = this.parseBaseExpression();
        const toToken = this.eat(TokenKind.ToKeyword);
        const toExpression = this.parseBaseExpression();

        let stepClauseSyntax: ForStepClauseCommandSyntax | undefined;

        if (this.isNext(TokenKind.StepKeyword)) {
            const stepToken = this.eat(TokenKind.StepKeyword);
            const stepExpression = this.parseBaseExpression();

            stepClauseSyntax = CommandSyntaxFactory.ForStepClause(stepToken, stepExpression);
        }

        return CommandSyntaxFactory.For(forKeyword, identifierToken, equalToken, fromExpression, toToken, toExpression, stepClauseSyntax);
    }

    private parseEndForCommand(): EndForCommandSyntax {
        const endForKeyword = this.eat(TokenKind.EndForKeyword);

        return CommandSyntaxFactory.EndFor(endForKeyword);
    }

    private parseWhileCommand(): WhileCommandSyntax {
        const whileToken = this.eat(TokenKind.WhileKeyword);
        const expression = this.parseBaseExpression();

        return CommandSyntaxFactory.While(whileToken, expression);
    }

    private parseEndWhileCommand(): EndWhileCommandSyntax {
        const endWhileKeyword = this.eat(TokenKind.EndWhileKeyword);

        return CommandSyntaxFactory.EndWhile(endWhileKeyword);
    }

    private parseLabelCommand(): LabelCommandSyntax {
        const labelToken = this.eat(TokenKind.Identifier);
        const colonToken = this.eat(TokenKind.Colon);

        return CommandSyntaxFactory.Label(labelToken, colonToken);
    }

    private parseGoToCommand(): GoToCommandSyntax {
        const gotoToken = this.eat(TokenKind.GoToKeyword);
        const labelToken = this.eat(TokenKind.Identifier);

        return CommandSyntaxFactory.GoTo(gotoToken, labelToken);
    }

    private parseSubCommand(): SubCommandSyntax {
        const subToken = this.eat(TokenKind.SubKeyword);
        const nameToken = this.eat(TokenKind.Identifier);

        return CommandSyntaxFactory.Sub(subToken, nameToken);
    }

    private parseEndSubCommand(): EndSubCommandSyntax {
        const endSubToken = this.eat(TokenKind.EndSubKeyword);

        return CommandSyntaxFactory.EndSub(endSubToken);
    }

    private parseExpressionCommand(): ExpressionCommandSyntax {
        const expression = this.parseBaseExpression();

        return CommandSyntaxFactory.Expression(expression);
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

            expression = ExpressionSyntaxFactory.BinaryOperator(expression, operatorToken, rightHandSide);
        }

        return expression;
    }

    private parseUnaryOperator(): BaseExpressionSyntax {
        if (this.isNext(TokenKind.Minus)) {
            const minusToken = this.eat(TokenKind.Minus);
            const expression = this.parseBaseExpression();

            return ExpressionSyntaxFactory.UnaryOperator(minusToken, expression);
        }

        return this.parseCoreExpression();
    }

    private parseCoreExpression(): BaseExpressionSyntax {
        let expression = this.parseTerminalExpression();

        if (expression.kind === ExpressionSyntaxKind.Missing) {
            return expression;
        }

        let current: Token | undefined;
        postfixExpression: while (current = this.peek()) {
            switch (current.kind) {
                case TokenKind.Dot: {
                    const dotToken = this.eat(TokenKind.Dot);
                    const identifierToken = this.eat(TokenKind.Identifier);

                    expression = ExpressionSyntaxFactory.ObjectAccess(expression, dotToken, identifierToken);
                    break;
                }
                case TokenKind.LeftSquareBracket: {
                    const leftSquareBracket = this.eat(TokenKind.LeftSquareBracket);
                    const indexExpression = this.parseBaseExpression();
                    const rightSquareBracket = this.eat(TokenKind.RightSquareBracket);

                    expression = ExpressionSyntaxFactory.ArrayAccess(expression, leftSquareBracket, indexExpression, rightSquareBracket);
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
                                            TokenKindToString(TokenKind.Comma)));

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
                    expression = ExpressionSyntaxFactory.Call(expression, leftParen, argumentsList, commasList, rightParen);
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
            const range = this.tokens[this.index - 1].range;
            this.reportError(new Diagnostic(ErrorCode.UnexpectedEOL_ExpectingExpression, range));
            return ExpressionSyntaxFactory.Missing(range);
        }

        switch (current.kind) {
            case TokenKind.Identifier: {
                const identifierToken = this.eat(TokenKind.Identifier);
                return ExpressionSyntaxFactory.Identifier(identifierToken.text, identifierToken);
            }
            case TokenKind.NumberLiteral: {
                const numberToken = this.eat(TokenKind.NumberLiteral);
                let value = parseFloat(numberToken.text);

                if (isNaN(value)) {
                    this.reportError(new Diagnostic(ErrorCode.ValueIsNotANumber, numberToken.range, numberToken.text));
                    value = 0;
                }

                return ExpressionSyntaxFactory.NumberLiteral(value, numberToken);
            }
            case TokenKind.StringLiteral: {
                const stringToken = this.eat(TokenKind.StringLiteral);
                let value = stringToken.text;

                if (value.length < 1 || value[0] !== "\"") {
                    throw new Error(`String literal '${value}' should have never been parsed without a starting double quotes`);
                }

                value = value.substr(1);
                if (value.length && value[value.length - 1] === "\"") {
                    value = value.substr(0, value.length - 1);
                }

                return ExpressionSyntaxFactory.StringLiteral(value, stringToken);
            }
            case TokenKind.LeftParen: {
                const leftParen = this.eat(TokenKind.LeftParen);
                const expression = this.parseBaseExpression();
                const rightParen = this.eat(TokenKind.RightParen);

                return ExpressionSyntaxFactory.Parenthesis(leftParen, expression, rightParen);
            }
            default: {
                this.reportError(new Diagnostic(ErrorCode.UnexpectedToken_ExpectingExpression, current.range, current.text));
                return ExpressionSyntaxFactory.Missing(current.range);
            }
        }
    }

    private isNext(kind: TokenKind, offset?: number): boolean {
        const current = this.peek(offset);
        return !!current && current.kind === kind;
    }

    private peek(offset?: number): Token | undefined {
        offset || (offset = 0);
        if (this.index + offset < this.tokens.length) {
            const current = this.tokens[this.index + offset];
            if (current.range.line === this.line) {
                return current;
            }
        }

        return;
    }

    private eat(kind: TokenKind): Token {
        if (this.index < this.tokens.length) {
            const current = this.tokens[this.index];
            if (current.range.line === this.line) {
                if (current.kind === kind) {
                    this.index++;
                    return current;
                } else {
                    this.reportError(new Diagnostic(
                        ErrorCode.UnexpectedToken_ExpectingToken,
                        current.range,
                        current.text,
                        TokenKindToString(kind)));
                }
            } else {
                this.reportError(new Diagnostic(
                    ErrorCode.UnexpectedEOL_ExpectingToken,
                    this.tokens[this.index - 1].range,
                    TokenKindToString(kind)));
            }
        } else {
            this.reportError(new Diagnostic(
                ErrorCode.UnexpectedEOL_ExpectingToken,
                this.tokens[this.index - 1].range,
                TokenKindToString(kind)));
        }

        return this.createMissingToken(this.tokens[this.tokens.length - 1].range);
    }

    private createMissingToken(range: TextRange): Token {
        return {
            kind: TokenKind.MissingToken,
            text: "<Missing>",
            range: range
        };
    }

    private reportError(error: Diagnostic): void {
        if (!this.currentLineHasErrors) {
            this.diagnostics.push(error);
            this.currentLineHasErrors = true;
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
