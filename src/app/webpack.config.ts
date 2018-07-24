import * as path from "path";
import * as webpack from "webpack";
import * as HtmlWebpackPlugin from "html-webpack-plugin";
import { factory, parseEnvArguments } from "../../build/webpack.config";
import { Chunk } from "html-webpack-plugin";

export default function (env: any): webpack.Configuration {
    const parsedArgs = parseEnvArguments(env);

    const config = factory({
        env: env,
        entryPath: {
            "monaco": "@timkendrick/monaco-editor/dist/standalone/index.js",
            "app": path.resolve(__dirname, "prototype.ts")
        },
        outputRelativePath: "app",
        target: "web"
    });

    const minifyOptions = parsedArgs.release ? {
        caseSensitive: true,
        collapseWhitespace: true,
        conservativeCollapse: true,
        removeComments: true
    } : undefined;

    config.plugins!.push(new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "content/index.ejs"),
        minify: minifyOptions,
        hash: true,
        showErrors: false,
        favicon: path.resolve(__dirname, "content/appicon.png"),
        chunksSortMode: (a, b) => getChunkIndex(a) - getChunkIndex(b)
    }));

    return config;
}

function getChunkIndex(chunk: Chunk): number {
    if (chunk.names.length !== 1) {
        throw new Error(`Chunk '${JSON.stringify(chunk.names)}' should have exactly one name`);
    }

    const name = chunk.names[0];

    switch (name) {
        case "monaco": return 0;
        case "app": return 1;
        default: throw new Error(`Chunk '${name}' does not have a predefined order`);
    }
}
