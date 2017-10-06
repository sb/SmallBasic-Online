import * as path from "path";
import * as base from "../../common/webpack.config";

export default function (env?: base.IExternalParams) {
    return base.factory({
        env: env,
        entryPath: path.resolve(__dirname, "main.ts"),
        outputRelativePath: "electron",
        outputFile: "main.js",
        target: "electron-main",
        externals: base.getNodeModules()
    });
}
