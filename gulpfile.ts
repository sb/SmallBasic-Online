import * as gulp from "gulp";
import { spawn } from "child_process";

const webpackPath = "./node_modules/webpack/bin/webpack.js";
const webpackDevServerPath = "./node_modules/webpack-dev-server/bin/webpack-dev-server.js";
const jasminePath = "./node_modules/jasmine/bin/jasmine.js";

function spawnProcess(command: string, args: string[]): Promise<void> {
    console.log(`Executing command: ${command} ${args.join(" ")}`);

    return new Promise((resolve, reject) => {
        spawn(command, args, {
            stdio: "inherit"
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
