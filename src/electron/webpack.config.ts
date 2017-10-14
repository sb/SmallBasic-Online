import * as path from "path";
import * as webpack from "webpack";
import * as base from "../../common/webpack.config";

export default function (env?: base.IExternalParams): webpack.Configuration {
    return base.factory({
        env: env,
        entryPath: path.resolve(__dirname, "index.ts"),
        outputRelativePath: "electron",
        outputFile: "index.js",
        target: "electron-main"
    });
}
