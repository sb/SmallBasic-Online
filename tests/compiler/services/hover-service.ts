import "jasmine";
import { provideHover } from "../../../src/compiler/services/hover-service";
import { ErrorResources } from "../../../src/strings/errors";
import { CompilerUtils } from "../../../src/compiler/compiler-utils";
import { getMarkerPosition } from "../helpers";

const marker = "$";

function testHover(text: string, expectedHover?: string): void {
    const position = getMarkerPosition(text, marker);
    const result = provideHover(text.replace(marker, ""), position);

    if(expectedHover) {
        expect(result).toBeDefined();
        expect(result!.range.line).toBe(position.line);
        expect(result!.range.start).toBeLessThanOrEqual(position.start);
        expect(result!.range.end).toBeGreaterThanOrEqual(position.end);
        expect(result!.text).toBe(expectedHover);
    } else {
        expect(result).toBeUndefined();
    }
}

describe("Compiler.Services.HoverService", () => {
    it("provides error description on hover - lhs", () => {
        testHover(`Text${marker}Window[0] = 5`, ErrorResources.UnexpectedVoid_ExpectingValue);
    });
    
    it("provides error description on hover - rhs", () => {
        const diagnostic = CompilerUtils.formatString(ErrorResources.UnexpectedArgumentsCount, ["1", "0"]);
        testHover(`x = TextWindow.Write${marker}Line()`, diagnostic);
    });
});
