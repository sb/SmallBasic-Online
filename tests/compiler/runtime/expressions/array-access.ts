import "jasmine";
import { verifyRuntimeResult } from "../../helpers";

describe("Compiler.Runtime.Expressions.ArrayAccess", () => {
    it("can access multi-dimensional arrays", () => {
        verifyRuntimeResult(`
x[0] = 1
x[1][0] = 2
x[3][5] = 3

y = (x[1][0] + x[0]) * x[3][5]
TextWindow.WriteLine(y)`,
            [],
            ["9"]);
    });

    it("can access non-existent arrays", () => {
        verifyRuntimeResult(`
TextWindow.WriteLine(x[0])
TextWindow.WriteLine(x[0][0])
TextWindow.WriteLine(x[2][3])`,
            [],
            [
                "",
                "",
                ""
            ]);
    });
});
