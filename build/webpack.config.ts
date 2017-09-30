import * as webpack from "webpack";

const config: webpack.Configuration = {
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
    }
};

export default config;
