import * as webpack from "webpack";
import * as path from "path";
import * as nodeExternals from "webpack-node-externals";

import baseConfig from "../../build/webpack.config";

const config: webpack.Configuration = {
    ...baseConfig,
    entry: path.join(__dirname, "./tests.ts"),
    output: {
        filename: "tests.js",
        path: path.join(__dirname, "../../dist/compiler")
    },
    target: "node",
    externals: [
        nodeExternals()
    ]
};

export default config;
