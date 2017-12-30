import * as path from "path";
import { convertXMLFilePromise } from "./gulp-helpers";

declare interface IModelMember {
    "#name": string;
    attributes: {
        type: string;
        array?: boolean;
        optional?: boolean;
    };
}

declare interface IModelDefinition {
    attributes: {
        kind: string;
    };
    children: {
        "#name": string;
        children: IModelMember[];
    }[];
}

declare interface IMappedMember {
    name: string;
    type: string;
    array?: boolean;
    optional?: boolean;
}

declare interface IMappedType {
    name: string;
    kind: string;
    members: IMappedMember[];
}

const importsMap: { [typePart: string]: string } = {
    "Token": "../syntax/tokens",
    "TextRange": "../syntax/text-markers",
    "ExpressionSyntax": "./syntax-expressions",
    "CommandSyntax": "./syntax-commands",
    "StatementSyntax": "./syntax-statements",
    "ExpressionInfo": "../binding/expression-binder",
    "BoundExpression": "./bound-expressions",
    "BoundStatement": "./bound-statements"
};

const includes = (all: string, value: string) => all.indexOf(value) >= 0;
const startsWith = (all: string, value: string) => all.indexOf(value) === 0;
const endsWith = (all: string, value: string) => all.indexOf(value) === (all.length - value.length);

function generateContents(model: IModelDefinition): string {
    const imports: { [path: string]: { [type: string]: boolean } } = {};
    const types: IMappedType[] = [];

    const enumType = model.attributes.kind + "Kind";
    const baseType = "Base" + model.attributes.kind;

    function mapMember(member: IModelMember): IMappedMember {
        const memberName = member["#name"];
        let memberType = member.attributes.type;

        if (member.attributes.array && member.attributes.optional) {
            throw new Error(`Member ${memberName} cannot be an array and optional at the same time`);
        }

        if (!includes(memberType, model.attributes.kind)) {
            for (const typePart in importsMap) {
                if (includes(memberType, typePart)) {
                    const importPath = importsMap[typePart];
                    if (!imports[importPath]) {
                        imports[importPath] = {};
                    }

                    imports[importPath][memberType] = true;
                    break;
                }
            }
        }

        if (member.attributes.array) {
            memberType += "[]";
        } else if (member.attributes.optional) {
            memberType += " | undefined";
        }

        return {
            name: memberName,
            type: memberType,
            array: member.attributes.array,
            optional: member.attributes.optional
        };
    }

    const baseMembers = model.children
        .filter(child => child["#name"] === "_baseMembers")
        .map(child => child.children)
        .reduce((acc, current) => acc.concat(current), [])
        .map(mapMember);

    model.children.filter(child => !startsWith(child["#name"], "_")).forEach(type => {
        const typeName = type["#name"];
        type.children = type.children || [];

        if (!endsWith(typeName, model.attributes.kind)) {
            throw new Error(`Type ${typeName} doesn't end with ${model.attributes.kind}`);
        }

        types.push({
            name: typeName,
            kind: typeName.substr(0, typeName.length - model.attributes.kind.length),
            members: type.children.map(mapMember)
        });
    });

    let importLines = Object.keys(imports).map(path => `import { ${Object.keys(imports[path]).join(", ")} } from "${path}";`);
    if (importLines.length) {
        importLines = [``, ...importLines];
    }

    return [
        `// This file is generated through a build task. Do not edit by hand.`,
        ...importLines,
        ``,
        `export enum ${enumType} {`,
        types.map(type => `    ${type.kind}`).join(",\n"),
        `}`,
        ``,
        `export interface ${baseType} {`,
        `    readonly kind: ${enumType};`,
        ...baseMembers.map(member => `    readonly ${member.name}: ${member.type};`),
        `}`,
        ``,
        types.map(type => [
            `export interface ${type.name} extends ${baseType} {`,
            ...type.members.map(member => `    readonly ${member.name}: ${member.type};`),
            `}`
        ].join("\n")).join("\n\n"),
        ``,
        `export class ${model.attributes.kind}Factory {`,
        `    private constructor() {`,
        `    }`,
        ``,
        types.map(type => {
            const allMembers = baseMembers.concat(type.members);
            return [
                `    public static ${type.kind}(${allMembers.length ? `\n` + allMembers.map(member => `        ${member.name}: ${member.type}`).join(",\n") : ``})`,
                `        : ${type.name} {`,
                `        return {`,
                [`            kind: ${enumType}.${type.kind}`,
                ...allMembers.map(member => `            ${member.name}: ${member.name}`)].join(",\n"),
                `        };`,
                `    }`
            ].join("\n");
        }).join("\n\n"),
        `}`,
        ``
    ].join("\n");
}

export function generateModels(model: string): Promise<void> {
    const inputPath = path.resolve(__dirname, `./models/${model}.xml`);
    const outputPath = path.resolve(__dirname, `../src/compiler/models/${model}.ts`);

    return convertXMLFilePromise(inputPath, outputPath, (value: IModelDefinition) => {
        return Promise.resolve(generateContents(value));
    });
}
