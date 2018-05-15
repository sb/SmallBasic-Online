import { Compilation } from "../../compiler/compilation";
import { TextRange } from "../syntax/nodes/syntax-nodes";

export interface CompilerHoverResult {
    text: string;
    range: TextRange;
}

export function provideHover(text: string, position: TextRange): CompilerHoverResult | undefined {
    const compilation = new Compilation(text);

    for (let i = 0; i < compilation.diagnostics.length; i++) {
        const diagnostic = compilation.diagnostics[i];

        if (diagnostic.range.line === position.line
            && diagnostic.range.start <= position.start
            && position.end <= diagnostic.range.end) {
            return {
                range: diagnostic.range,
                text: diagnostic.toString()
            };
        }
    }

    return undefined;
}
