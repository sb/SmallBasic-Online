import * as path from "path";
import * as webpack from "webpack";
import * as ExtractTextPlugin from "extract-text-webpack-plugin";

import * as helpers from "./gulp-helpers";

const extractCSS = new ExtractTextPlugin("[name].fonts.css");
const extractSCSS = new ExtractTextPlugin("[name].styles.css");

export interface IExternalParams {
    release?: boolean | string | string[];
}

export interface IFactoryParams {
    env?: IExternalParams;
    entryPath: string;
    outputFile: string;
    outputRelativePath: string;
    target: "web" | "node" | "electron-main";
}

export function factory(params: IFactoryParams): webpack.Configuration {
    const release = !!params.env && (params.env.release === true || params.env.release === "true");
    const outputFolder = path.resolve("out", params.outputRelativePath);

    console.log(`Building ${release ? "release" : "debug"} configuration to folder: ${outputFolder}`);

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
                },
                {
                    test: /\.scss$/,
                    use: ["css-hot-loader"].concat(<string[]>extractSCSS.extract({
                        fallback: "style-loader",
                        use: [
                            {
                                loader: "css-loader",
                                options: {
                                    alias: {
                                        "../img": path.resolve(__dirname, "../src/app/view/images")
                                    }
                                }
                            },
                            {
                                loader: "sass-loader"
                            }
                        ]
                    }))
                },
                {
                    test: /\.css$/,
                    use: extractCSS.extract({
                        fallback: "style-loader",
                        use: "css-loader"
                    })
                },
                {
                    test: /\.(png|jpg|jpeg|gif|ico)$/,
                    use: [
                        {
                            loader: "file-loader",
                            options: {
                                name: "./img/[name].[hash].[ext]"
                            }
                        }
                    ]
                },
                {
                    test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                    loader: "file-loader",
                    options: {
                        name: "./fonts/[name].[hash].[ext]"
                    }
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
            new webpack.NamedModulesPlugin(),
            extractCSS,
            extractSCSS
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
