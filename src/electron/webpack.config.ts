import * as path from "path";
import * as webpack from "webpack";
import { factory } from "../../build/webpack.config";

export default function (env: any): webpack.Configuration {
    return factory({
        env: env,
        entryPath: {
            "index": path.resolve(__dirname, "index.ts")
        },
        outputRelativePath: "electron",
        target: "electron-main"
    });
}
