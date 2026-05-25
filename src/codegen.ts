import { ASTNode, CommentNode, IdentifierNode, LogNode, NewExpressionNode, NumberLiteralNode, Program, StringLiteralNode, VariableDeclaration } from "./types/Node";

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

            // TODO: Grab Properties!
            case "NewExpressionNode":
                let outCode = `make type `;

                const thisNode = (node as NewExpressionNode);
                const identifier = thisNode.value.name;
                let children = thisNode.children;
                outCode += `"${(children[0] as StringLiteralNode).value}"`;

                children = children.slice(1);

                for (let param of children) {
                    switch(param.type) {
                        case "IdentifierNode":
                            outCode += (param as IdentifierNode).name;
                            break;
                        case "StringLiteralNode":
                            const cueName = (param as StringLiteralNode).value;
                            outCode += `\nset q name of (last item of (selected as list)) to "${cueName}"`;
                            break;
                        case "NumberLiteralNode":
                            const cueNum = (param as NumberLiteralNode).value;
                            outCode += `\nset q number of (last item of (selected as list)) to "${cueNum}"`;
                            break;
                    };
                };

                return outCode;

            default:
                throw new Error(`Unknown node type: ${node.type}`);
        };
    };
};