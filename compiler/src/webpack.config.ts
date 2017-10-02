import * as webpack from "webpack";
import * as path from "path";

import * as baseConfig from "../../build/webpack.config";

function factory(env?: baseConfig.IBaseArguments): webpack.Configuration {
    let outputFolder = baseConfig.isRelease(env) ? "release" : "debug";
    
    return {
        ...baseConfig.factory(env),
        entry: path.join(__dirname, "./compiler.ts"),
        output: {
            filename: "compiler.js",
            path: path.join(__dirname, `../../dist/compiler/${outputFolder}/`)
        },
        target: "web"
    };
}

export default factory;
