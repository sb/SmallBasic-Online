import * as path from "path";
import * as webpack from "webpack";
import * as helpers from "./gulp-helpers";
import { Entry } from "webpack";

export interface IExternalParams {
    release: boolean;
}

export interface IFactoryParams {
    env: any;
    entryPath: Entry;
    outputRelativePath: string;
    target: "web" | "node" | "electron-main";
}

export function parseEnvArguments(env: any): IExternalParams {
    return {
        release: !!env && (env.release === true || env.release === "true")
    };
}

export function factory(params: IFactoryParams): webpack.Configuration {
    const release = parseEnvArguments(params.env).release;
    const outputFolder = path.resolve("out", params.outputRelativePath);

    console.log(`Building ${release ? "release" : "debug"} configuration to folder: ${outputFolder}`);

    const config: webpack.Configuration = {
        entry: params.entryPath,
        output: {
            path: outputFolder,
            filename: "[name].js"
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
                },
                {
                    test: /\.css$/,
                    loaders: [
                        "style-loader",
                        "css-loader"
                    ]
                },
                {
                    test: /\.(png|gif|wav)$/,
                    use: [
                        {
                            loader: "file-loader",
                            options: {
                                name: "./images/[hash].[ext]"
                            }
                        }
                    ]
                }
            ]
        },
        resolve: {
            extensions: [".tsx", ".ts", ".jsx", ".js"]
        },
        devServer: {
            contentBase: outputFolder
        },
        plugins: [
            new webpack.DefinePlugin({
                "process.env": {
                    "NODE_ENV": JSON.stringify(release ? "production" : "dev")
                }
            }),
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NamedModulesPlugin()
        ]
    };

    if (params.target === "electron-main") {
        config.node = {
            __dirname: false,
            __filename: false
        };
    }

    if (params.target !== "web") {
        config.externals = helpers.getNodeModules();
    }

    if (release) {
        config.plugins!.push(new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            comments: false
        }));
    }

    return config;
}
