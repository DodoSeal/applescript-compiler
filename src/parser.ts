import { ASTNode, CommentNode, IdentifierNode, LogNode, NewExpressionNode, NumberLiteralNode, Program, StringLiteralNode, VariableDeclaration, VariableDeclarationKind } from "./types/Node";
import { Token, TokenType } from "./types/Token";

export default class Parser {
    private tokens: Token[];
    private position: number = 0;

    constructor(tokens: Token[]) {
        this.tokens = tokens;
    };

    public Parse(): Program {
        const body: ASTNode[] = [];

        while (this.peek().type !== TokenType.EOF) {
            const token = this.peek();

            // Eat semicolons cause they're tasty!
            if (token.type === TokenType.SYMBOL && token.value === ";") { this.advance(); continue; };
            if (this.isVariableKeyword()) {
                body.push(this.parseVariableDeclaration());
                continue;
            };

            if (this.isNewKeyword()) {
                const newNode = this.parseNewExpression() as NewExpressionNode;
                const children: ASTNode[] = [];
                const parameters = this.parseParameters();

                for (let node of parameters) {
                    switch(node.type) {
                        case "IdentifierNode":
                            children.push({ type: "IdentifierNode", name: (node as IdentifierNode).name } as IdentifierNode);
                            break;
                        case "StringLiteralNode":
                            children.push({ type: "StringLiteralNode", value: (node as StringLiteralNode).value } as StringLiteralNode);
                            break;
                        case "NumberLiteralNode":
                            children.push({ type: "NumberLiteralNode", value: (node as NumberLiteralNode).value } as NumberLiteralNode);
                            break;
                    };
                };

                newNode.children = children;
                body.push(newNode);
            };

            if (token.type === TokenType.LOG) {
                body.push({
                    type: "LogNode",
                    value: this.parseParameters()
                } as LogNode);
                continue;
            };

            if (token.type === TokenType.COMMENT) {
                body.push(this.parseComment());
                continue;
            };
        };

        return { type: "Program", body };
    };

    private parseVariableDeclaration(): VariableDeclaration {
        const variableType = this.advance().value as VariableDeclarationKind;
        const variableName = this.typeCheck(TokenType.IDENTIFIER).value;
        const assignmentOperator = this.typeCheck(TokenType.OPERATOR).value;
        const variableValue = this.parseExpression();

        if (assignmentOperator !== "=") {
            // Refactor Errors
            throw new Error("Hey you! Yeah you! '=' is the only assignment operator I understand!");
        };

        return {
            type: "VariableDeclaration",
            kind: variableType,
            name: variableName,
            value: variableValue
        }
    };

    private parseExpression(): ASTNode {
        const token = this.advance();

        if (token.type === TokenType.STRING) return { type: "StringLiteralNode", value: token.value } as StringLiteralNode;
        if (token.type === TokenType.NUMBER) return { type: "NumberLiteralNode", value: Number(token.value) } as NumberLiteralNode;
        if (token.type === TokenType.IDENTIFIER) return { type: "IdentifierNode", name: token.value } as IdentifierNode;

        // Refactor Errors
        throw new Error(`Unexpected token: "${token.value}" in expression of type: "${token.type}" at Line: ${token.line}, Col: ${token.column}`);
    };

    private parseComment() {
        const token = this.advance();

        return { type: "CommentNode", value: token.value } as CommentNode;
    };

    private parseParameters(): ASTNode[] {
        const token = this.peek();

        const opening = this.typeCheck(TokenType.SYMBOL).value;
        if (opening !== "(") throw new Error(`Expecing "(" after ${token}`);

        const children: ASTNode[] = [];

        while (this.peek().value !== ")") {
            if (this.peek().value === ",") { this.advance(); continue; };
            const nextToken = this.peek();

            if (nextToken.type === TokenType.IDENTIFIER) {
                this.advance();
                children.push({ type: "IdentifierNode", name: nextToken.value } as IdentifierNode);
                continue;
            };

            children.push(this.parseExpression());
        };

        // Yummy ")"
        const closing = this.typeCheck(TokenType.SYMBOL).value;
        if (closing !== ")") throw new Error(`Expecing ")" after ${token}`);

        return children;
    };

    // TODO
    private parseOperator() {};

    private parseNewExpression(): ASTNode {
        const token = this.advance();
        const classIdentifier = this.typeCheck(TokenType.IDENTIFIER);

        return {
            type: "NewExpressionNode",
            value: {
                type: "IdentifierNode",
                name: classIdentifier.value
            }
        } as NewExpressionNode;
    };

    private peek(): Token {
        return this.tokens[this.position] ?? { type: TokenType.EOF, value: "", line: 0, column: 0 };;
    };

    private advance(): Token { 
        return this.tokens[this.position++] ?? { type: TokenType.EOF, value: "", line: 0, column: 0 };
    };

    private isVariableKeyword(): boolean {
        if (["const", "let", "var"].includes(this.peek().value)) return true;

        return false;
    };

    private isNewKeyword(): boolean {
        if (this.peek().value === "new" && this.peek().type === TokenType.KEYWORD) return true;

        return false;
    };

    private typeCheck(type: TokenType): Token {
        const nextToken = this.peek();

        if (nextToken.type !== type) {
            // Refactor Errors
            throw new Error(`Expected ${type} and got ${nextToken.type} | Value: "${nextToken.value}"`);
        };

        return this.advance();
    };
};

// const dummyTokens: Token[] = [
//   { type: TokenType.KEYWORD, value: 'const', line: 1, column: 6 },
//   { type: TokenType.IDENTIFIER, value: 'hello', line: 1, column: 12 },
//   { type: TokenType.OPERATOR, value: '=', line: 1, column: 14 },
//   { type: TokenType.STRING, value: 'Hello', line: 1, column: 22 },
//   { type: TokenType.SYMBOL, value: ';', line: 1, column: 23 },
//   { type: TokenType.LOG, value: 'print', line: 2, column: 6 },
//   { type: TokenType.SYMBOL, value: '(', line: 2, column: 12 },
//   { type: TokenType.IDENTIFIER, value: 'hello', line: 2, column: 14 },
//   { type: TokenType.SYMBOL, value: ',', line: 2, column: 14 },
//   { type: TokenType.IDENTIFIER, value: 'hello', line: 2, column: 14 },
//   { type: TokenType.SYMBOL, value: ')', line: 2, column: 23 },
//   { type: TokenType.SYMBOL, value: ';', line: 2, column: 24 }
// ];

// const debug = new Parser(dummyTokens);
// const parsed = debug.Parse();

// console.dir(parsed, { depth: null });