import * as fs from "fs";
import * as gulp from "gulp";
import * as path from "path";
import * as helpers from "./build/gulp-helpers";
import { generateLocStrings } from "./build/generate-loc-strings";

const userLanguage = "en";

gulp.task("generate-errors-strings", () => generateLocStrings("ErrorResources", path.resolve(__dirname, `./build/strings/${userLanguage}/compiler/errors.json`), path.resolve(__dirname, `./src/compiler/strings/errors.ts`)));
gulp.task("generate-syntax-nodes-strings", () => generateLocStrings("SyntaxNodesResources", path.resolve(__dirname, `./build/strings/${userLanguage}/compiler/syntax-nodes.json`), path.resolve(__dirname, `./src/compiler/strings/syntax-nodes.ts`)));
gulp.task("generate-documentation-strings", () => generateLocStrings("DocumentationResources", path.resolve(__dirname, `./build/strings/${userLanguage}/compiler/documentation.json`), path.resolve(__dirname, `./src/compiler/strings/documentation.ts`)));
gulp.task("generate-app-editor-strings", () => generateLocStrings("EditorResources", path.resolve(__dirname, `./build/strings/${userLanguage}/app/editor.json`), path.resolve(__dirname, `./src/app/strings/editor.ts`)));

gulp.task("generate-loc-strings", [
    "generate-errors-strings",
    "generate-syntax-nodes-strings",
    "generate-documentation-strings",
    "generate-app-editor-strings",
]);

gulp.task("build-source", ["generate-loc-strings"], () => helpers.runWebpack({ projectPath: "./src/app/webpack.config.ts", release: false, watch: false }));

gulp.task("watch-source", () => {
    gulp.watch("build/**", ["generate-loc-strings"]);
    return helpers.runWebpack({
        projectPath: "./src/app/webpack.config.ts",
        release: false,
        watch: true
    });
});

gulp.task("build-tests", () => helpers.runWebpack({ projectPath: "./tests/webpack.config.ts", release: false, watch: false }));
gulp.task("run-tests",  ["build-tests"], () => helpers.cmdToPromise("node", ["./node_modules/jasmine/bin/jasmine.js", "./out/tests/tests.js"]));

gulp.task("watch-tests", () => {
    gulp.watch("build/**", ["generate-loc-strings"]);
    gulp.watch(["src/**", "tests/**"], ["run-tests"]);
});

gulp.task("release", ["generate-loc-strings"], () => helpers.runWebpack({ projectPath: "./src/app/webpack.config.ts", release: true, watch: false }));

gulp.task("package", ["release"], () => {
    const setupConfigPath = "./out/electron/electron-builder-config.json";
    const electronBuilderPath = path.resolve(__dirname, "./node_modules/.bin/electron-builder.cmd");

    return helpers.rimrafToPromise("./out/electron")
        .then(() => helpers.runWebpack({
            projectPath: "./src/electron/webpack.config.ts",
            release: true,
            watch: false
        }))
        .then(() => helpers.streamToPromise(gulp.src("./out/app/**").pipe(gulp.dest("./out/electron"))))
        .then(() => helpers.streamToPromise(gulp.src("./package.json").pipe(gulp.dest("./out/electron"))))
        .then(() => helpers.rimrafToPromise("./out/installers"))
        .then(() => new Promise<void>((resolve, reject) => {
            const config = {
                productName: "SmallBasic-Online",
                directories: {
                    app: "./out/electron",
                    output: "./out/installers"
                },
                win: {
                    target: [
                        { target: "nsis", arch: ["ia32"] }
                    ],
                    icon: "./src/electron/installer"
                }
            };
            fs.writeFile(setupConfigPath, JSON.stringify(config), "utf8", error => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        }))
        .then(() => helpers.cmdToPromise(electronBuilderPath, ["build", "--config", setupConfigPath]));
});
