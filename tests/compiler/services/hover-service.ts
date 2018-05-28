import "jasmine";
import { ErrorResources } from "../../../src/strings/errors";
import { CompilerUtils } from "../../../src/compiler/compiler-utils";
import { getMarkerPosition } from "../helpers";
import { HoverService } from "../../../src/compiler/services/hover-service";
import { DocumentationResources } from "../../../src/strings/documentation";

const marker = "$";

function testHover(text: string, expectedHover?: string[]): void {
    const position = getMarkerPosition(text, marker);
    const result = HoverService.provideHover(text.replace(marker, ""), position);

    if (expectedHover) {
        expect(result).toBeDefined();
        expect(result!.range.containsPosition(position)).toBeTruthy();
        expect(result!.text.length).toBe(expectedHover.length);
        for (let i = 0; i < expectedHover.length; i++) {
            expect(result!.text[i]).toBe(expectedHover[i]);
        }
    } else {
        expect(result).toBeUndefined();
    }
}

describe("Compiler.Services.HoverService", () => {
    it("provides error description on hover - lhs", () => {
        testHover(`
Text${marker}Window[0] = 5`, [
                ErrorResources.UnexpectedVoid_ExpectingValue
            ]);
    });

    it("provides error description on hover - rhs", () => {
        testHover(`
x = TextWindow.Write${marker}Line()`, [
                CompilerUtils.formatString(ErrorResources.UnexpectedArgumentsCount, ["1", "0"])
            ]);
    });

    it("provides library method name when hovered over - statement", () => {
        testHover(`
TextWindow.Write${marker}Line("")`, [
                "TextWindow.WriteLine",
                DocumentationResources.TextWindow_WriteLine
            ]);
    });

    it("provides library method name when hovered over - expression", () => {
        testHover(`
x = TextWindow.Rea${marker}d()`, [
                "TextWindow.Read",
                DocumentationResources.TextWindow_Read
            ]);
    });

    it("provides library property name when hovered over", () => {
        testHover(`
x = TextWindow.Foreground${marker}Color`, [
                "TextWindow.ForegroundColor",
                DocumentationResources.TextWindow_ForegroundColor
            ]);
    });
});
