const webpack = require("webpack");
const fs = require("fs");
const path = require("path");

module.exports = function (env) {
    let config = {
        entry: env.entryFile,
        output: {
            filename: path.parse(env.outputFile).base,
            path: path.parse(env.outputFile).dir
        },
        target: env.targetType,
        devtool: "source-map",
        module: {
            rules: [{
                    test: /\.tsx?$/,
                    loader: "tslint-loader",
                    enforce: "pre",
                    options: {
                        emitErrors: true
                    }
                },
                {
                    test: /\.tsx?$/,
                    loader: "awesome-typescript-loader"
                },
                {
                    test: /\.jsx?$/,
                    loader: "source-map-loader",
                    enforce: "pre"
                }
            ]
        },
        resolve: {
            extensions: [".tsx", ".ts", ".jsx", ".js"]
        },
        plugins: [],
        externals: []
    };

    if (env.release) {
        config.plugins.push(new webpack.optimize.UglifyJsPlugin({
            sourceMap: true
        }));
    }

    if (env.external && env.external.length) {
        config.externals = config.externals.concat(env.external.split(";"));
    }

    return config;
}