import { BaseSyntax } from "../../syntax/syntax-nodes";

export abstract class BaseBoundNode<TSyntax extends BaseSyntax> {
    public constructor(
        public readonly syntax: TSyntax) {
    }
}
