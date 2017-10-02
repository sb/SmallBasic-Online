import * as webpack from "webpack";

export interface IBaseArguments {
    release?: string;
}

export function isRelease(env?: IBaseArguments): boolean {
    return !!env && !!env.release;
}

export function factory(env?: IBaseArguments): webpack.Configuration {
    let plugins = [];

    if (isRelease(env)) {
        plugins.push(new webpack.optimize.UglifyJsPlugin());
    }

    return {
        devtool: "source-map",
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    loader: "tslint-loader",
                    enforce: "pre",
                    options: { emitErrors: true }
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
        plugins: plugins
    };
}
