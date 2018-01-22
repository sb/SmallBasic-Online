import { convertFilePromise } from "./gulp-helpers";

function generateContents(identifier: string, entries: { [entryName: string]: string }): string {
    return `// This file is generated through a build task. Do not edit by hand.

export module ${identifier} {
${Object.keys(entries).map(entryName => `    export const ${entryName} = "${entries[entryName]}";`).join("\n")}
}
`;
}

export function generateLocStrings(identifier: string, inputPath: string, outputPath: string): Promise<void> {
    return convertFilePromise(inputPath, outputPath, value => {
        return Promise.resolve(generateContents(identifier, JSON.parse(value)));
    });
}
