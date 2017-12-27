import * as path from "path";
import * as webpack from "webpack";
import { factory } from "../build/webpack.config";

export default function (env: any): webpack.Configuration {
    return factory({
        env: env,
        entryPath: path.resolve(__dirname, "index.ts"),
        outputRelativePath: "tests",
        outputFile: "tests.js",
        target: "node"
    });
}
