import * as fs from "fs";
import * as path from "path";
import * as rimraf from "rimraf";
import { spawn } from "child_process";
import { lstatSync, readdirSync } from "fs";

export function cmdToPromise(command: string, args: string[], cwd?: string): Promise<void> {
    console.log(`Executing command: ${command} ${args.join(" ")}`);
    return new Promise<void>((resolve, reject) => {
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

export function rimrafToPromise(path: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        if (fs.existsSync(path)) {
            console.log(`Deleting path: ${path}`);
            rimraf(path, error => !!error ? reject(error) : resolve());
        } else {
            resolve();
        }
    });
}

export function streamToPromise(stream: NodeJS.ReadWriteStream): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        stream.on("finish", resolve).on("error", reject);
    });
}

export function getNodeModules(): string[] {
    const packagesFolder = path.join(__dirname, "../node_modules");

    return readdirSync(packagesFolder)
        .map(name => path.join(packagesFolder, name))
        .filter(item => lstatSync(item).isDirectory())
        .map(item => `commonjs ${path.parse(item).base}`);
}

export function runWebpack(params: { projectPath: string; release: boolean; watch: boolean }): Promise<void> {
    return cmdToPromise("node", [
        params.watch
            ? path.resolve(__dirname, "../node_modules/webpack-dev-server/bin/webpack-dev-server.js")
            : path.resolve(__dirname, "../node_modules/webpack/bin/webpack.js"),
        "--config", params.projectPath,
        "--env.release", params.release ? "true" : "false"]);
}

export function convertFilePromise(inputPath: string, outputPath: string, converter: (value: string) => Promise<string>): Promise<void> {
    console.log(`Transforming input file ${inputPath} to output file ${outputPath} `);
    const input = fs.readFileSync(inputPath, "utf8");

    return converter(input).then(output => {
        fs.writeFileSync(outputPath, output, "utf8");
        return Promise.resolve<void>();
    });
}

// TODO: optimization pass to remove temp instructions
// TODO: arithmetic operations to library calls
// TODO: separate library methods and properties to separate definitions
// TODO: review the rest of the instructions (like jumps)
