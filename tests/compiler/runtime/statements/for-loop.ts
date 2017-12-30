import "jasmine";
import { verifyRuntimeResult } from "../../helpers";

describe("Compiler.Runtime.Statements.ForLoop", () => {
    it("can execute without a step condition", () => {
        verifyRuntimeResult(`
For i = 1 To 5
    TextWindow.WriteLine(i)
EndFor`,
            [],
            ["1", "2", "3", "4", "5"]);
    });

    it("can execute without a step condition - inverse", () => {
        verifyRuntimeResult(`
For i = 5 To 1
    TextWindow.WriteLine(i)
EndFor`,
            [],
            []);
    });

    it("can execute with a step condition - one", () => {
        verifyRuntimeResult(`
For i = 1 To 5 Step 1
    TextWindow.WriteLine(i)
EndFor`,
            [],
            ["1", "2", "3", "4", "5"]);
    });

    it("can execute with a step condition - two", () => {
        verifyRuntimeResult(`
For i = 1 To 10 Step 2
    TextWindow.WriteLine(i)
EndFor`,
            [],
            ["1", "3", "5", "7", "9"]);
    });

    it("can execute with an inverse step condition - one", () => {
        verifyRuntimeResult(`
For i = 5 To 1 Step -1
    TextWindow.WriteLine(i)
EndFor`,
            [],
            ["5", "4", "3", "2", "1"]);
    });

    it("can execute with an inverse step condition - two", () => {
        verifyRuntimeResult(`
For i = 10 To 1 Step -2
    TextWindow.WriteLine(i)
EndFor`,
            [],
            ["10", "8", "6", "4", "2"]);
    });

    it("can execute with an equal start and end - no step", () => {
        verifyRuntimeResult(`
For i = 1 To 1
    TextWindow.WriteLine(i)
EndFor`,
            [],
            ["1"]);
    });
    
    it("can execute with an equal start and end - positive step", () => {
        verifyRuntimeResult(`
For i = 1 To 1 Step 1
    TextWindow.WriteLine(i)
EndFor`,
            [],
            ["1"]);
    });
    
    it("can execute with an equal start and end - negative step", () => {
        verifyRuntimeResult(`
For i = 1 To 1 Step -1
    TextWindow.WriteLine(i)
EndFor`,
            [],
            ["1"]);
    });
});
