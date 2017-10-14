import "jasmine";
import * as compiler from "../../src/app/compiler";

describe("compiler.ts", () => {
    it("gets four", () => {
        let result = compiler.getFour();
        expect(result).toEqual(4);
    });
});
