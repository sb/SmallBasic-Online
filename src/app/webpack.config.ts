import * as path from "path";
import * as webpack from "webpack";
import * as HtmlWebpackPlugin from "html-webpack-plugin";
import { factory, parseEnvArguments } from "../../common/webpack.config";

export default function (env: any): webpack.Configuration {
    const config = factory({
        env: env,
        entryPath: path.resolve(__dirname, "app.tsx"),
        outputRelativePath: "app",
        outputFile: "app.js",
        target: "web"
    });

    const minifyOptions = parseEnvArguments(env).release ? {
        caseSensitive: true,
        collapseWhitespace: true,
        conservativeCollapse: true,
        removeComments: true
    } : undefined;

    config.plugins!.push(new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "view/index.ejs"),
        minify: minifyOptions,
        hash: true,
        showErrors: false,
        favicon: path.resolve(__dirname, "view/images/favicon.png")
    }));

    return config;
}
