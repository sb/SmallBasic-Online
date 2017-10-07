import * as fs from "fs";
import { spawn } from "child_process";
import * as rimraf from "rimraf";

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
    return new Promise<void>(function (resolve, reject) {
        stream.on("finish", resolve).on("error", reject);
    });
}
