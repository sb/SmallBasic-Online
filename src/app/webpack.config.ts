import * as path from "path";
import * as base from "../../common/webpack.config";

export default function (env?: base.IExternalParams) {
    return base.factory({
        env: env,
        entryPath: path.resolve(__dirname, "app.tsx"),
        outputRelativePath: "app",
        outputFile: "app.js",
        target: "web",
        ejsTemplate: path.resolve(__dirname, "view/index.ejs")
    });
}
