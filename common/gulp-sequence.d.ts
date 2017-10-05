declare module "gulp-sequence" {
    function sequence(...args: (string | string[])[]): ((err?: any) => void);
    export = sequence;
}
