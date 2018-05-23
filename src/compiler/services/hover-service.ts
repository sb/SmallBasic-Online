import { Compilation } from "../../compiler/compilation";
import { CompilerRange, CompilerPosition } from "../syntax/ranges";

export interface CompilerHoverResult {
    text: string;
    range: CompilerRange;
}

export function provideHover(text: string, position: CompilerPosition): CompilerHoverResult | undefined {
    const compilation = new Compilation(text);

    for (let i = 0; i < compilation.diagnostics.length; i++) {
        const diagnostic = compilation.diagnostics[i];

        if (diagnostic.range.containsPosition(position)) {
            return {
                range: diagnostic.range,
                text: diagnostic.toString()
            };
        }
    }

    return undefined;
}
