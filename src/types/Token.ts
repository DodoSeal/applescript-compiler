// Tokens
export enum TokenType {
    STRING = "string",
    QUOTATION = "quotation",
    NUMBER = "number",
    KEYWORD = "keyword",
    IDENTIFIER = "identifier",
    LOG = "log",
    OPERATOR = "operator",
    SYMBOL = "symbol",
    COMMENT = "comment",
    WHITESPACE = "whitespace",
    UNKNOWN = "unknown",
    EOF = "eof"
};

export interface Token {
    type: TokenType
    value: string,
    line: number,
    column: number
};