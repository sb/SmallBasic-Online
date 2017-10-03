import * as path from "path";
import { lstatSync, readdirSync } from "fs";
import * as webpack from "webpack";
import * as HtmlWebpackPlugin from "html-webpack-plugin";

const codebaseRoot = path.resolve(__dirname, "..");

export interface IExternalParams {
    release?: boolean | string | string[];
}

export interface IFactoryParams {
    env?: IExternalParams;
    entryPath: string;
    outputRelativePath: string;
    outputFile: string;
    target: "web" | "node";
    ejsTemplate?: {
        templatePath: string;
        scripts: {
            debug: string;
            release: string;
        }[];
    };
    externals?: { [name: string]: string } | string[];
}

export function getNodeModules(): string[] {
    const packagesFolder = path.join(codebaseRoot, "node_modules");

    return readdirSync(packagesFolder)
        .map(name => path.join(packagesFolder, name))
        .filter(item => lstatSync(item).isDirectory())
        .map(item => `commonjs ${path.parse(item).base}`);
}

export function factory(params: IFactoryParams): webpack.Configuration {
    const release = params.env && params.env.release;
    const outputFolder = `${codebaseRoot}/out/${params.outputRelativePath}`;

    const config: webpack.Configuration = {
        entry: params.entryPath,
        output: {
            path: outputFolder,
            filename: params.outputFile
        },
        target: params.target,
        devtool: "source-map",
        module: {
            rules: [
                {
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
        devServer: {
            contentBase: outputFolder
        },
        externals: params.externals,
        plugins: []
    };

    if (params.ejsTemplate) {
        const htmlMinifierOptions = release ? {
            caseSensitive: true,
            collapseWhitespace: true,
            conservativeCollapse: true,
            minifyCSS: true,
            minifiJS: true,
            removeComments: true
        } : false;

        config.plugins!.push(new HtmlWebpackPlugin({
            template: params.ejsTemplate.templatePath,
            minify: htmlMinifierOptions,
            hash: true,
            showErrors: false,
            scripts: params.ejsTemplate.scripts.map(script => release ? script.release : script.debug)
        }));
    }

    if (release) {
        config.plugins!.push(new webpack.optimize.UglifyJsPlugin({
            sourceMap: true
        }));
    }

    return config;
}
