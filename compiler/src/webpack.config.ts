import * as webpack from "webpack";
import * as path from "path";
import baseConfig from "../../build/webpack.config";

const config: webpack.Configuration = {
    ...baseConfig,
    entry: path.join(__dirname, "./compiler.ts"),
    output: {
        filename: "compiler.js",
        path: path.join(__dirname, "../../dist/compiler")
    },
    target: "web"
};

export default config;
