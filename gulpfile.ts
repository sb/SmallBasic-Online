import * as fs from "fs";
import * as gulp from "gulp";
import * as path from "path";
import * as helpers from "./common/gulp-helpers";

gulp.task("build", () => helpers.runWebpack({
    projectPath: "./src/app/webpack.config.ts",
    release: false,
    watch: false
}));

gulp.task("start", () => helpers.runWebpack({
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

gulp.task("test", ["build"], () => {
    return helpers.runWebpack({
        projectPath: "./tests/webpack.config.ts",
        release: false,
        watch: false
    }).then(() => helpers.cmdToPromise("node", [
        "./node_modules/jasmine/bin/jasmine.js",
        "./out/tests/tests.js"
    ]));
});

gulp.task("deploy", ["release"], () => {
    const gitserverPath = "./out/gitserver";
    const deploymentRepository = "https://github.com/OmarTawfik/SuperBasic-Deployment";

    return helpers.rimrafToPromise(gitserverPath)
        .then(() => helpers.cmdToPromise("git", ["clone", deploymentRepository, gitserverPath]))
        .then(() => helpers.rimrafToPromise(path.resolve(gitserverPath, "!(.git)")))
        .then(() => helpers.streamToPromise(gulp.src("./out/app/**").pipe(gulp.dest(gitserverPath))))
        .then(() => helpers.cmdToPromise("git", ["add", "*"], gitserverPath))
        .then(() => helpers.cmdToPromise("git", ["commit", "-m", "Local Deployment"], gitserverPath))
        .then(() => helpers.cmdToPromise("git", ["push"], gitserverPath));
});

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
