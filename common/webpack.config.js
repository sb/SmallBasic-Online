const webpack = require("webpack");
var HtmlWebpackPlugin = require('html-webpack-plugin');

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

    if (env.ejsTemplate) {
        const htmlMinifierOptions = {
            caseSensitive: true,
            collapseWhitespace: true,
            conservativeCollapse: true,
            minifyCSS: true,
            minifiJS: true,
            removeComments: true
        };

        config.plugins.push(new HtmlWebpackPlugin({
            template: env.ejsTemplate,
            inject: "head",
            minify: env.release ? htmlMinifierOptions : false,
            hash: true,
            showErrors: false,
            scripts: env.ejsTemplateScripts ? env.ejsTemplateScripts.split(";") : []
        }));
    }

    if (env.external) {
        config.externals = config.externals.concat(env.external.split(";"));
    }

    return config;
}