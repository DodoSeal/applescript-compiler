import { ASTNode, CommentNode, IdentifierNode, LogNode, NumberLiteralNode, Program, StringLiteralNode, VariableDeclaration } from "./types/Node";

export class CodeGenerator {
    public Generate(node: ASTNode): string {
        switch (node.type) {
            case "Program":
                return (node as Program).body.map(n => this.Generate(n)).join("\n");

            case "VariableDeclaration": {
                const n = node as VariableDeclaration;
                return `-- This was a "${n.kind}" variable!\nset ${n.name} to ${this.Generate(n.value)}`;
            };

            case "StringLiteralNode":
                return `"${(node as StringLiteralNode).value}"`;

            case "NumberLiteralNode":
                return `${(node as NumberLiteralNode).value}`;

            case "IdentifierNode":
                return `${(node as IdentifierNode).name}`;

            case "LogNode":
                const args = (node as LogNode).value.map(n => this.Generate(n)).join(" & ");
                return `display dialog ${args}`;

            case "CommentNode":
                const comment = (node as CommentNode).value;
                return `-- ${comment}`;

            default:
                throw new Error(`Unknown node type: ${node.type}`);
        };
    };
};