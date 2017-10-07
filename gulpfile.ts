import * as fs from "fs";
import * as gulp from "gulp";
import * as path from "path";
import * as helpers from "./common/gulp-helpers";

const jasminePath = path.resolve(__dirname, "./node_modules/jasmine/bin/jasmine.js");
const webpackPath = path.resolve(__dirname, "./node_modules/webpack/bin/webpack.js");
const electronBuilderPath = path.resolve(__dirname, "./node_modules/.bin/electron-builder.cmd");
const webpackDevServerPath = path.resolve(__dirname, "./node_modules/webpack-dev-server/bin/webpack-dev-server.js");

const deploymentRepository = "https://github.com/OmarTawfik/SuperBasic-Deployment";

const appProjectPath = path.resolve(__dirname, "./src/app/webpack.config.ts");
const testsProjectPath = path.resolve(__dirname, "./tests/webpack.config.ts");
const electronProjectPath = path.resolve(__dirname, "./src/electron/webpack.config.ts");

gulp.task("build", () => helpers.cmdToPromise("node", [webpackPath, "--config", appProjectPath]));

gulp.task("dev", () => helpers.cmdToPromise("node", [webpackDevServerPath, "--config", appProjectPath]));

gulp.task("test", () => {
    return helpers.cmdToPromise("node", [webpackPath, "--config", testsProjectPath]).then(() => {
        return helpers.cmdToPromise("node", [jasminePath, "./out/tests/tests.js"]);
    });
});

gulp.task("deploy", () => {
    return helpers.rimrafToPromise("./out/web")
        .then(() => helpers.cmdToPromise("git", ["clone", deploymentRepository, "./out/web"]))
        .then(() => helpers.rimrafToPromise("./out/web/!(.git)"))
        .then(() => helpers.cmdToPromise("node", [webpackPath, "--config", appProjectPath, "--env.release"]))
        .then(() => helpers.streamToPromise(gulp.src("./out/app/**").pipe(gulp.dest("./out/web"))))
        .then(() => helpers.cmdToPromise("git", ["add", "*"], "./out/web"))
        .then(() => helpers.cmdToPromise("git", ["commit", "-m", "Local Deployment"], "./out/web"))
        .then(() => helpers.cmdToPromise("git", ["push"], "./out/web"));
});

gulp.task("package", () => {
    return helpers.cmdToPromise("node", [webpackPath, "--config", electronProjectPath])
        .then(() => helpers.cmdToPromise("node", [webpackPath, "--config", appProjectPath]))
        .then(() => helpers.streamToPromise(gulp.src("./out/app/**").pipe(gulp.dest("./out/electron/app"))))
        .then(() => helpers.streamToPromise(gulp.src("./package.json").pipe(gulp.dest("./out/electron/app"))))
        .then(() => new Promise<void>(resolve => {
            const config = {
                productName: "SmallBasic",
                directories: {
                    app: path.resolve(__dirname, "./out/electron/app"),
                    output: path.relative(__dirname, "./out/electron/dist")
                },
                win: { target: [{ target: "nsis", arch: ["ia32"] }] }
            };
            fs.writeFileSync("./out/electron/config.json", JSON.stringify(config), "utf8");
            resolve();
        }))
        .then(() => helpers.cmdToPromise(electronBuilderPath, ["build", "--config", "./out/electron/config.json"]));
});
