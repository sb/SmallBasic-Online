import { BaseSyntaxNode } from "../../syntax/syntax-nodes";

export abstract class BaseBoundNode<TSyntax extends BaseSyntaxNode> {
    public constructor(
        public readonly syntax: TSyntax) {
    }
}
