import "jasmine";
import { verifyRuntimeResult } from "../../helpers";

describe("Compiler.Runtime.Statements.Labels", () => {
    it("can go to labels", () => {
        verifyRuntimeResult(`
GoTo two
one:
TextWindow.WriteLine(1)
GoTo three
two:
TextWindow.WriteLine(2)
GoTo one
three:
TextWindow.WriteLine(3)`,
            [],
            ["2", "1", "3"]);
    });
});
