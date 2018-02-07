import "jasmine";
import { verifyRuntimeResult } from "../../helpers";

describe("Compiler.Runtime.Libraries.Array", () => {
    it("can check if an array contains index", () => {
        verifyRuntimeResult(`
x[0] = 1
x["test"] = 1
TextWindow.WriteLine(Array.ContainsIndex(x, 0))
TextWindow.WriteLine(Array.ContainsIndex(x, "test"))
TextWindow.WriteLine(Array.ContainsIndex(x, 2))
TextWindow.WriteLine(Array.ContainsIndex(y, 0))`,
            [],
            [
                "True",
                "True",
                "False",
                "False"
            ]);
    });

    it("can check if an array contains value", () => {
        verifyRuntimeResult(`
x[0] = 1
x[1] = "test"
TextWindow.WriteLine(Array.ContainsValue(x, 0))
TextWindow.WriteLine(Array.ContainsValue(x, 1))
TextWindow.WriteLine(Array.ContainsValue(x, "test"))
TextWindow.WriteLine(Array.ContainsValue(y, 0))`,
            [],
            [
                "False",
                "True",
                "True",
                "False"
            ]);
    });

    it("can can get indices of an array", () => {
        verifyRuntimeResult(`
ar["first"] = 5
ar[10] = 6
TextWindow.WriteLine(Array.GetAllIndices(0))    ' Nothing
TextWindow.WriteLine(Array.GetAllIndices("a"))  ' Nothing
TextWindow.WriteLine(Array.GetAllIndices(x))    ' Nothing
TextWindow.WriteLine(Array.GetAllIndices(ar))`,
            [],
            [
                "[]",
                "[]",
                "[]",
                `[1="10", 2="first"]`
            ]);
    });

    it("can can get item count of an array", () => {
        verifyRuntimeResult(`
ar1[0] = 0
ar2[0] = 1
ar2[1] = 2
TextWindow.WriteLine(Array.GetItemCount(0))    ' Nothing
TextWindow.WriteLine(Array.GetItemCount("a"))  ' Nothing
TextWindow.WriteLine(Array.GetItemCount(x))    ' Nothing
TextWindow.WriteLine(Array.GetItemCount(ar1))
TextWindow.WriteLine(Array.GetItemCount(ar2))`,
            [],
            [
                "0",
                "0",
                "0",
                "1",
                "2"
            ]);
    });

    it("can can check whether a value is an array or not", () => {
        verifyRuntimeResult(`
ar1[0] = 0
TextWindow.WriteLine(Array.IsArray(0))    ' No
TextWindow.WriteLine(Array.IsArray("a"))  ' No
TextWindow.WriteLine(Array.IsArray(x))    ' No
TextWindow.WriteLine(Array.IsArray(ar1))`,
            [],
            [
                "False",
                "False",
                "False",
                "True"
            ]);
    });
});
