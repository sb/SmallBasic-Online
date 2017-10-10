import * as path from "path";
import * as base from "../common/webpack.config";

export default function (env?: base.IExternalParams) {
    return base.factory({
        env: env,
        entryPath: path.resolve(__dirname, "imports.ts"),
        outputRelativePath: "tests",
        outputFile: "tests.js",
        target: "node"
    });
}
