import { BaseSyntaxNode } from "../../syntax/nodes/syntax-nodes";

export abstract class BaseBoundNode<TSyntax extends BaseSyntaxNode> {
    public constructor(
        public readonly syntax: TSyntax) {
    }
}
