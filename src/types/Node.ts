export type NodeType =
    "Program" |
    "VariableDeclaration" |
    "LogNode" |
    "StringLiteralNode" |
    "NumberLiteralNode" |
    "IdentifierNode" |
    "BinaryExpressionNode" |
    "CommentNode";

export interface ASTNode {
    type: NodeType
};

export interface Program extends ASTNode {
    type: "Program",
    body: ASTNode[]
};

export type VariableDeclarationKind = "const" | "let" | "var";

export interface VariableDeclaration extends ASTNode {
    type: "VariableDeclaration",
    kind: VariableDeclarationKind,
    name: string,
    value: ASTNode
};

export interface LogNode extends ASTNode {
    type: "LogNode",
    value: ASTNode[]
};

export interface CommentNode extends ASTNode {
    type: "CommentNode",
    value: string
};

export interface StringLiteralNode extends ASTNode {
    type: "StringLiteralNode",
    value: string
};

export interface NumberLiteralNode extends ASTNode {
    type: "NumberLiteralNode",
    value: number
};

export interface IdentifierNode extends ASTNode {
    type: "IdentifierNode",
    name: string
};

export interface BinaryExpressionNode extends ASTNode {
    type: "BinaryExpressionNode",
    left: ASTNode,
    operator: string,
    right: ASTNode
};