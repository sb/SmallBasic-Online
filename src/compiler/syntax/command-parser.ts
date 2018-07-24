import { ErrorCode, Diagnostic } from "../utils/diagnostics";
import { IfCommandSyntax, BaseSyntaxNode, BinaryOperatorExpressionSyntax, UnaryOperatorExpressionSyntax, ObjectAccessExpressionSyntax, ArrayAccessExpressionSyntax, InvocationExpressionSyntax, IdentifierExpressionSyntax, ParenthesisExpressionSyntax, ElseIfCommandSyntax, ElseCommandSyntax, EndIfCommandSyntax, ForCommandSyntax, ForStepClauseSyntax, EndForCommandSyntax, WhileCommandSyntax, EndWhileCommandSyntax, LabelCommandSyntax, GoToCommandSyntax, SubCommandSyntax, EndSubCommandSyntax, ExpressionCommandSyntax, ArgumentSyntax, NumberLiteralExpressionSyntax, StringLiteralExpressionSyntax } from "./syntax-nodes";
import { TokenKind, Token } from "./tokens";
import { CompilerRange } from "./ranges";
import { CommentCommandSyntax, TokenSyntax } from "./syntax-nodes";
import { CompilerUtils } from "../utils/compiler-utils";

export class CommandsParser {
    public static readonly MissingTokenText: string = "?";

    private _index: number = 0;
    private _line: number = 0;
    private _currentLineHasErrors: boolean = false;

    private _result: BaseSyntaxNode[] = [];

    public get result(): ReadonlyArray<BaseSyntaxNode> {
        return this._result;
    }

    public constructor(private readonly _tokens: ReadonlyArray<Token>, private readonly _diagnostics: Diagnostic[]) {
        this._tokens = this._tokens.filter(token => {
            switch (token.kind) {
                // Ignore tokens that shouldn't be parsed.
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
                case TokenKind.Comment: this._result.push(this.parseCommentCommand()); break;

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
            if (current.kind === TokenKind.Comment) {
                this._result.push(this.parseCommentCommand());
            } else {
                this.reportError(new Diagnostic(ErrorCode.UnexpectedToken_ExpectingEOL, current.range, current.text));
            }
        }
    }

    private parseCommentCommand(): CommentCommandSyntax {
        const comment = this.eat(TokenKind.Comment);
        return new CommentCommandSyntax(comment);
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

        let stepClauseSyntax: ForStepClauseSyntax | undefined;

        if (this.isNext(TokenKind.StepKeyword)) {
            const stepToken = this.eat(TokenKind.StepKeyword);
            const stepExpression = this.parseBaseExpression();

            stepClauseSyntax = new ForStepClauseSyntax(stepToken, stepExpression);
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

    private parseBaseExpression(): BaseSyntaxNode {
        return this.parseBinaryOperator(0);
    }

    private parseBinaryOperator(precedence: number): BaseSyntaxNode {
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

    private parseUnaryOperator(): BaseSyntaxNode {
        if (this.isNext(TokenKind.Minus)) {
            const minusToken = this.eat(TokenKind.Minus);
            const expression = this.parseBaseExpression();

            return new UnaryOperatorExpressionSyntax(minusToken, expression);
        }

        return this.parseCoreExpression();
    }

    private parseCoreExpression(): BaseSyntaxNode {
        let expression = this.parseTerminalExpression();

        while (true) {
            const currentToken = this.peek();
            if (!currentToken) {
                return expression;
            }

            switch (currentToken.kind) {
                case TokenKind.Dot:
                    expression = this.parseObjectAccessExpression(expression);
                    break;
                case TokenKind.LeftSquareBracket:
                    expression = this.parseArrayAccessExpressoin(expression);
                    break;
                case TokenKind.LeftParen:
                    expression = this.parseCallExpression(expression);
                    break;
                default:
                    return expression;
            }
        }
    }

    private parseObjectAccessExpression(leftHandSide: BaseSyntaxNode): BaseSyntaxNode {
        const dotToken = this.eat(TokenKind.Dot);
        const identifierToken = this.eat(TokenKind.Identifier);

        return new ObjectAccessExpressionSyntax(leftHandSide, dotToken, identifierToken);
    }

    private parseArrayAccessExpressoin(leftHandSide: BaseSyntaxNode): BaseSyntaxNode {
        const leftSquareBracket = this.eat(TokenKind.LeftSquareBracket);
        const indexExpression = this.parseBaseExpression();
        const rightSquareBracket = this.eat(TokenKind.RightSquareBracket);

        return new ArrayAccessExpressionSyntax(leftHandSide, leftSquareBracket, indexExpression, rightSquareBracket);
    }

    private parseCallExpression(leftHandSide: BaseSyntaxNode): BaseSyntaxNode {
        const leftParen = this.eat(TokenKind.LeftParen);
        const argumentsList: ArgumentSyntax[] = [];

        let currentToken = this.peek();
        let currentArgument: BaseSyntaxNode | undefined;

        loop: while (currentToken) {
            if (currentArgument) {
                switch (currentToken.kind) {
                    case TokenKind.Comma: {
                        const comma = this.eat(TokenKind.Comma);
                        argumentsList.push(new ArgumentSyntax(currentArgument, comma));
                        currentArgument = undefined;
                        break;
                    }
                    case TokenKind.RightParen: {
                        argumentsList.push(new ArgumentSyntax(currentArgument, undefined));
                        currentArgument = undefined;
                        break loop;
                    }
                    default: {
                        this.reportError(new Diagnostic(
                            ErrorCode.UnexpectedToken_ExpectingToken,
                            currentToken.range,
                            currentToken.text,
                            CompilerUtils.tokenToDisplayString(TokenKind.Comma)));

                        argumentsList.push(new ArgumentSyntax(currentArgument, undefined));
                        currentArgument = undefined;
                        break;
                    }
                }
            }
            else if (currentToken.kind === TokenKind.RightParen) {
                break loop;
            } else {
                currentArgument = this.parseBaseExpression();
            }

            currentToken = this.peek();
        }

        if (currentArgument) {
            argumentsList.push(new ArgumentSyntax(currentArgument, undefined));
        }

        const rightParen = this.eat(TokenKind.RightParen);
        return new InvocationExpressionSyntax(leftHandSide, leftParen, argumentsList, rightParen);
    }

    private parseTerminalExpression(): BaseSyntaxNode {
        const current = this.peek();
        if (!current) {
            const range = this._tokens[this._index - 1].range;
            this.reportError(new Diagnostic(ErrorCode.UnexpectedEOL_ExpectingExpression, range));
            return new IdentifierExpressionSyntax(this.createMissingToken(range, TokenKind.Identifier));
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
                return new IdentifierExpressionSyntax(this.createMissingToken(current.range, TokenKind.Identifier));
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

    private eat(kind: TokenKind): TokenSyntax {
        if (this._index < this._tokens.length) {
            const current = this._tokens[this._index];
            if (current.range.start.line === this._line) {
                if (current.kind === kind) {
                    this._index++;
                    return new TokenSyntax(current);
                } else {
                    this.reportError(new Diagnostic(ErrorCode.UnexpectedToken_ExpectingToken, current.range, current.text, CompilerUtils.tokenToDisplayString(kind)));
                    return this.createMissingToken(current.range, kind);
                }
            }
        }

        const range = this._tokens[this._index - 1].range;
        this.reportError(new Diagnostic(ErrorCode.UnexpectedEOL_ExpectingToken, range, CompilerUtils.tokenToDisplayString(kind)));
        return this.createMissingToken(range, kind);
    }

    private createMissingToken(range: CompilerRange, kind: TokenKind): TokenSyntax {
        return new TokenSyntax(new Token(CommandsParser.MissingTokenText, kind, range));
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
