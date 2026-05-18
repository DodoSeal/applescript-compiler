import { Token, TokenType } from "./types/Token";
import Keywords from "./types/Keywords";
import * as fs from "fs";
import path from "path";

export default class Tokenizer {
    private position: number = 0;
    private line: number = 1;
    private column: number = 1;
    private input: string;

    constructor(input: string) {
        this.input = input;
    };

    public Tokenize(): Token[] {
        const tokens: Token[] = [];

        while (!this.isEof()) {
            const nextToken = this.readNext();

            if (nextToken.type === TokenType.EOF) break;

            if (nextToken.type !== TokenType.WHITESPACE) {
                tokens.push(nextToken);
            };
        };

        tokens.push({ type: TokenType.EOF, value: "", line: this.line, column: this.column });
        return tokens;
    };

    private readNext(): Token {
        this.skipWhitespace();
        if (this.isEof()) return { type: TokenType.EOF, value: "", line: this.line, column: this.column };
        
        const char = this.peek();
        const charNext = this.peek(1);

        // Handle Comments, needs refactor
        if (char === "/" && charNext === "/") {
            this.advance();
            this.advance();

            if (this.peek() === " ") this.advance();

            let value = "";
            while (this.peek() !== "\n" && this.peek() !== "\0") {
                value += this.advance();
            };

            return { type: TokenType.COMMENT, value, line: this.line, column: this.column } as Token;
        };

        if (this.isNumber(char))   return this.tokenizeNumber();
        if (this.isLetter(char))   return this.tokenizeIdentifier();
        if (this.isOperator(char)) return this.tokenizeOperator();
        if (this.isPunctuation(char)) return this.tokenizePunctuation();

        // Special handling for quotations, needs refactor
        if (char === `"` || char === `'` || char === "`") return this.tokenizeString();

        const unknownChar = this.advance();
        return { type: TokenType.UNKNOWN, value: unknownChar, line: this.line, column: this.column };
    };

    private tokenizeNumber(): Token {
        let value = "";

        while (this.isNumber(this.peek())) {
            value += this.advance();
        };

        if (this.peek() === '.' && this.isNumber(this.peek(1))) {
            value += this.advance();

            while (this.isNumber(this.peek())) {
                value += this.advance();
            };
        };

        return { type: TokenType.NUMBER, value, line: this.line, column: this.column };
    };

    private tokenizeString(): Token {
        const quotation = this.advance();
        let value = "";

        while (this.peek() !== quotation && this.peek() !== "\0 ") {
            value += this.advance();
        };

        if (this.peek() !== quotation && this.peek() !== "\0") {
            if (this.peek() === "\\") {
                this.advance();
                
                const escapedChar = this.advance();

                // WHAT DOES THIS EVEN MEAN
                value += ({ n: '\n', t: '\t', r: '\r' })[escapedChar] ?? escapedChar;
            } else {
                value += this.advance();
            };
        };

        this.advance();
        return { type: TokenType.STRING, value, line: this.line, column: this.column };
    };

    private tokenizeIdentifier(): Token {
        let value = "";

        while (this.isLetter(this.peek()) || this.isNumber(this.peek())) {
            value += this.advance();
        };

        let tokenType = Keywords.has(value) ? TokenType.KEYWORD : TokenType.IDENTIFIER;
        if (value === "print") tokenType = TokenType.LOG;
        return { type: tokenType, value, line: this.line, column: this.column };
    };

    private tokenizeOperator(): Token {
        let value = "";

        while (this.isOperator(this.peek())) {
            value += this.advance();
        };

        return { type: TokenType.OPERATOR, value, line: this.line, column: this.column };
    };

    private tokenizePunctuation(): Token {
        return { type: TokenType.SYMBOL, value: this.advance(), line: this.line, column: this.column };
    };

    private peek(offset: number = 0): string {
        return this.input[this.position + offset] ?? '\0';
    };

    private advance(): string {
        const char = this.input[this.position++] ?? '\0';
        if (char === '\n') { this.line++; this.column = 1; } else { this.column++; };

        return char;
    };

    private skipWhitespace(): void {
        while (this.position < this.input.length && /\s/.test(this.peek())) {
            this.advance();
        };
    };

    private isNumber(data: string)       { return /[0-9]/.test(data); };
    private isLetter(data: string)       { return /[a-zA-Z_]/.test(data); };
    private isOperator(data: string)     { return /[+\-*/%=!<>&|^~]/.test(data); };
    private isPunctuation(data: string)  { return /[;(){}[\],.]/.test(data); };

    private isEof(): boolean {
        if (this.position >= this.input.length) return true;
        
        return false;
    };
};

// const variableTestPath = path.join(__dirname, "../src/examples/variables.ts");
// const sourceCode = fs.readFileSync(variableTestPath, { encoding: "utf-8" }).toString();
// const debug = new Tokenizer(sourceCode);
// const output = debug.Tokenize();

// console.log(output);