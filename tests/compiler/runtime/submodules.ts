import "jasmine";
import { verifyRuntimeResult } from "../helpers";

describe("Compiler.Runtime.SubModules", () => {
    it("calls submodules from within submodules", () => {
        verifyRuntimeResult(`
Sub A
    TextWindow.WriteLine("hello from A")
    B()
EndSub
Sub B
    TextWindow.WriteLine("hello from B")
EndSub
A()`,
            [],
            [
                "hello from A",
                "hello from B"
            ]);
    });
});
