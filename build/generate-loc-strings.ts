import { convertFilePromise } from "./gulp-helpers";
import * as path from "path";

function generateContents(entries: { [entryName: string]: string }): string {
    return `// This file is generated through a build task. Do not edit by hand.

import {ErrorCode} from "./diagnostics";

export enum StringKey {
${Object.keys(entries).map(entryName => `    ${entryName}`).join(",\n")}
}

export function KeyToString(key: StringKey): string {
    return dictionary(StringKey[key]);
}

export function ErrorToString(code: ErrorCode): string {
    return dictionary(ErrorCode[code]);
}

function dictionary(key: string): string {
    switch (key) {${Object.keys(entries).map(entryName => `
        case "${entryName}":
            return "${entries[entryName]}";`).join("")}
        default:
            throw "Key not found" + key;
    }
}
`;
}

export function generateLocStrings(): Promise<void> {
    const inputPath = path.resolve(__dirname, "./loc/compiler/en.json");
    const outputPath = path.resolve(__dirname, "../src/compiler/utils/strings.ts");

    return convertFilePromise(inputPath, outputPath, value => {
        return Promise.resolve(generateContents(JSON.parse(value)));
    });
}
