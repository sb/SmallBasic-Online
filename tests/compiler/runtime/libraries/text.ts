import "jasmine";
import { verifyRuntimeResult } from "../../helpers";

describe("Compiler.Runtime.Libraries.Text", () => {
    it("can return appended text", () => {
        verifyRuntimeResult(`
x = 1
y = "value"
TextWindow.WriteLine(Text.Append(x, y))
TextWindow.WriteLine(Text.Append(x, "test"))`,
            [],
            [
                "1value",
                "1test"
            ]);
    });

    it("can can get length of the string", () => {
        verifyRuntimeResult(`
str1 = ""
str2 = "test"
TextWindow.WriteLine(Text.GetLength(0))
TextWindow.WriteLine(Text.GetLength("a"))
TextWindow.WriteLine(Text.GetLength(x))    ' Nothing
TextWindow.WriteLine(Text.GetLength(str1))
TextWindow.WriteLine(Text.GetLength(str2))`,
            [],
            [
                "1",
                "1",
                "0",
                "0",
                "4"
            ]);
    });
});
