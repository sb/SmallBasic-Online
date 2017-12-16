import * as fs from "fs";
import * as gulp from "gulp";
import * as path from "path";
import * as helpers from "./build/gulp-helpers";

gulp.task("build-source", () => helpers.runWebpack({
    projectPath: "./src/app/webpack.config.ts",
    release: false,
    watch: false
}));

gulp.task("build-tests", () => helpers.runWebpack({
    projectPath: "./tests/webpack.config.ts",
    release: false,
    watch: false
}));

gulp.task("watch", () => helpers.runWebpack({
    projectPath: "./src/app/webpack.config.ts",
    release: false,
    watch: true
}));

gulp.task("release", () => helpers.rimrafToPromise("./out/app")
    .then(() => helpers.runWebpack({
        projectPath: "./src/app/webpack.config.ts",
        release: true,
        watch: false
})));

gulp.task("test", ["build-tests"], () => helpers.cmdToPromise("node", [
    "./node_modules/jasmine/bin/jasmine.js",
    "./out/tests/tests.js"
]));

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
                productName: "SuperBasic",
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
