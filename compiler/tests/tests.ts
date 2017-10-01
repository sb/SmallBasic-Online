import "jasmine";
import * as compiler from "../src/compiler";

describe("compiler.ts", () => {
    it("gets four", () => {
        let result = compiler.getFour();
        expect(result).toEqual(4);
    });
});
