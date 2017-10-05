/// <reference path="./common/gulp-sequence.d.ts" />
// tslint:disable-next-line:no-require-imports
import sequence = require("gulp-sequence");

import * as fs from "fs";
import * as gulp from "gulp";
import { spawn } from "child_process";
import * as rimraf from "rimraf";

const jasminePath = "./node_modules/jasmine/bin/jasmine.js";
const webpackPath = "./node_modules/webpack/bin/webpack.js";
const webpackDevServerPath = "./node_modules/webpack-dev-server/bin/webpack-dev-server.js";
const deploymentRepository = "https://github.com/OmarTawfik/SuperBasic-Deployment";

function spawnProcess(command: string, args: string[], cwd?: string): Promise<void> {
    console.log(`Executing command: ${command} ${args.join(" ")}`);

    return new Promise((resolve, reject) => {
        spawn(command, args, {
            stdio: "inherit",
            cwd: cwd
        }).on("exit", error => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}

gulp.task("build", () => spawnProcess("node", [webpackPath, "--config", "./src/app/webpack.config.ts"]));

gulp.task(`dev`, () => spawnProcess("node", [webpackDevServerPath, "--config", "./src/app/webpack.config.ts"]));

gulp.task("test", () => {
    return spawnProcess("node", [webpackPath, "--config", "./tests/webpack.config.ts"]).then(() => {
        return spawnProcess("node", [jasminePath, "./out/tests/tests.js"]);
    });
});

gulp.task("_deploy:1", callback => fs.existsSync("./out/deployment") ? rimraf("./out/deployment", callback) : callback());
gulp.task("_deploy:2", () => spawnProcess("git", ["clone", deploymentRepository, "./out/deployment"]));
gulp.task("_deploy:3", callback => rimraf("./out/deployment/!(.git)", callback));
gulp.task("_deploy:4", () => spawnProcess("node", [webpackPath, "--config", "./src/app/webpack.config.ts", "--env.release"]));
gulp.task("_deploy:5", () => gulp.src("./out/app/**").pipe(gulp.dest("./out/deployment")));
gulp.task("_deploy:6", () => spawnProcess("git", ["add", "*"], "./out/deployment"));
gulp.task("_deploy:7", () => spawnProcess("git", ["commit", "-m", "Local Deployment"], "./out/deployment"));
gulp.task("_deploy:8", () => spawnProcess("git", ["push"], "./out/deployment"));
gulp.task("deploy", sequence.apply(null, [1, 2, 3, 4, 5, 6, 7, 8].map(i => `_deploy:${i}`)));
