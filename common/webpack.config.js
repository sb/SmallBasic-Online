const webpack = require("webpack");
const fs = require("fs");
const path = require("path");

module.exports = function (env) {
    const releasePlugins = [
        new webpack.optimize.UglifyJsPlugin()
    ];

    const nodeModulesPath = path.resolve(__dirname, "../node_modules");
    const nodeExternals = fs.readdirSync(nodeModulesPath).filter(folder => fs.lstatSync(path.resolve(nodeModulesPath, folder)).isDirectory());

    return {
        entry: env.entryFile,
        output: {
            filename: path.parse(env.outputFile).base,
            path: path.parse(env.outputFile).dir
        },
        target: "web",
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
                    loader: "ts-loader"
                },
                {
                    test: /\.jsx?$/,
                    loader: "source-map-loader",
                    enforce: "pre"
                }
            ]
        },
        resolve: {
            extensions: [".tsx", ".ts"]
        },
        plugins: !!env.release ? releasePlugins : [],
        externals: env.targetType === "node" ? nodeExternals : []
    };
}