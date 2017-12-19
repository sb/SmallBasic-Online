import { convertFilePromise } from "./gulp-helpers";
import * as path from "path";

function generateContents(identifier: string, entries: { [entryName: string]: string }): string {
    return `// This file is generated through a build task. Do not edit by hand.

export module ${identifier} {
    export enum Keys {
${Object.keys(entries).map(entryName => `        ${entryName}`).join(",\n")}
    }

    export function toString(key: Keys): string {
        switch (key) {${Object.keys(entries).map(entryName => `
            case Keys.${entryName}:
                return "${entries[entryName]}";`).join("")}
            default:
                throw "Key not found: " + key;
        }
    }
}
`;
}

export function generateLocStrings(identifier: string, resource: string): Promise<void> {
    const language = "en";
    const inputPath = path.resolve(__dirname, `./strings/${language}/${resource}.json`);
    const outputPath = path.resolve(__dirname, `../src/compiler/strings/${resource}.ts`);

    return convertFilePromise(inputPath, outputPath, value => {
        return Promise.resolve(generateContents(identifier, JSON.parse(value)));
    });
}
