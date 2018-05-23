export module CompilerUtils {
    export function formatString(template: string, args: ReadonlyArray<string>): string {
        return template.replace(/{[0-9]+}/g, match => args[parseInt(match.replace(/^{/, "").replace(/}$/, ""))]);
    }
}
