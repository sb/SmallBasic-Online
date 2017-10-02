import * as webpack from "webpack";
import * as path from "path";
import * as nodeExternals from "webpack-node-externals";

import * as baseConfig from "../../build/webpack.config";

function factory(env?: baseConfig.IBaseArguments): webpack.Configuration {
    let outputFolder = baseConfig.isRelease(env) ? "release" : "debug";
    
    return {
        ...baseConfig.factory(env),
        entry: path.join(__dirname, "./tests.ts"),
        output: {
            filename: "tests.js",
            path: path.join(__dirname, `../../dist/compiler/${outputFolder}/`)
        },
        target: "node",
        externals: [
            nodeExternals()
        ]
    };
}

export default factory;
