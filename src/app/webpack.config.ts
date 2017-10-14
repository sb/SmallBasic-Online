import * as fs from "fs";
import * as path from "path";
import * as webpack from "webpack";
import * as base from "../../common/webpack.config";
import { IPackageInfo } from "./package-info";
import * as HtmlWebpackPlugin from "html-webpack-plugin";

export default function (env?: base.IExternalParams): webpack.Configuration {
    const release = !!env && (env.release === true || env.release === "true");

    const config = base.factory({
        env: env,
        entryPath: path.resolve(__dirname, "app.tsx"),
        outputRelativePath: "app",
        outputFile: "app.js",
        target: "web"
    });

    const packagePath = path.resolve(__dirname, "../../package.json");
    const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
    const packageInfo: IPackageInfo = {
        title: packageJson.title,
        version: packageJson.version,
        description: packageJson.description,
        repository: packageJson.repository.url
    };
    const packageInfoEncoded = new Buffer(JSON.stringify(packageInfo), "binary").toString("base64");

    const minifyOptions = release ? {
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
        favicon: path.resolve(__dirname, "view/images/favicon.png"),
        packageInfoEncoded: packageInfoEncoded
    }));

    return config;
}
