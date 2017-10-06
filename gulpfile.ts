import * as gulp from "gulp";
import * as helpers from "./common/gulp-helpers";

const jasminePath = "./node_modules/jasmine/bin/jasmine.js";
const webpackPath = "./node_modules/webpack/bin/webpack.js";
const webpackDevServerPath = "./node_modules/webpack-dev-server/bin/webpack-dev-server.js";
const deploymentRepository = "https://github.com/OmarTawfik/SuperBasic-Deployment";

gulp.task("build", () => helpers.cmdToPromise("node", [webpackPath, "--config", "./src/app/webpack.config.ts"]));

gulp.task("dev", () => helpers.cmdToPromise("node", [webpackDevServerPath, "--config", "./src/app/webpack.config.ts"]));

gulp.task("test", () => {
    return helpers.cmdToPromise("node", [webpackPath, "--config", "./tests/webpack.config.ts"]).then(() => {
        return helpers.cmdToPromise("node", [jasminePath, "./out/tests/tests.js"]);
    });
});

gulp.task("deploy:web", () => {
    return helpers.rimrafToPromise("./out/web")
        .then(() => helpers.cmdToPromise("git", ["clone", deploymentRepository, "./out/web"]))
        .then(() => helpers.rimrafToPromise("./out/web/!(.git)"))
        .then(() => helpers.cmdToPromise("node", [webpackPath, "--config", "./src/app/webpack.config.ts", "--env.release"]))
        .then(() => helpers.streamToPromise(gulp.src("./out/app/**").pipe(gulp.dest("./out/web"))))
        .then(() => helpers.cmdToPromise("git", ["add", "*"], "./out/web"))
        .then(() => helpers.cmdToPromise("git", ["commit", "-m", "Local Deployment"], "./out/web"))
        .then(() => helpers.cmdToPromise("git", ["push"], "./out/web"));
});

gulp.task("deploy:electron", () => {
    return helpers.cmdToPromise("node", [webpackPath, "--config", "./src/electron/webpack.config.ts"])
        .then(() => helpers.cmdToPromise("node", [webpackPath, "--config", "./src/app/webpack.config.ts", "--env.release"]))
        .then(() => helpers.streamToPromise(gulp.src("./out/app/**").pipe(gulp.dest("./out/electron"))));
});
