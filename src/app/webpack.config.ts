import * as path from "path";
import * as base from "../../common/webpack.config";

export default function (env?: base.IExternalParams) {
    return base.factory({
        env: env,
        entryPath: path.resolve(__dirname, "app.tsx"),
        outputRelativePath: "app",
        outputFile: "app.js",
        target: "web",
        externals: {
            "react": "React",
            "react-dom": "ReactDOM"
        },
        ejsTemplate: {
            templatePath: path.resolve(__dirname, "index.ejs"),
            scripts: [
                {
                    debug: "https://cdnjs.cloudflare.com/ajax/libs/react/16.0.0/umd/react.development.js",
                    release: "https://cdnjs.cloudflare.com/ajax/libs/react/16.0.0/umd/react.production.min.js"
                },
                {
                    debug: "https://cdnjs.cloudflare.com/ajax/libs/react-dom/16.0.0/umd/react-dom.development.js",
                    release: "https://cdnjs.cloudflare.com/ajax/libs/react-dom/16.0.0/umd/react-dom.production.min.js"
                }
            ]
        }
    });
}
