import "jasmine";
import { CompletionService } from "../../../src/compiler/services/completion-service";
import { getMarkerPosition } from "../helpers";

const marker = "$";

function testItemExists(text: string, expectedItem?: string): void {
    const position = getMarkerPosition(text, marker);
    const result = CompletionService.provideCompletion(text.replace(marker, ""), position);

    if (expectedItem) {
        expect(result.filter(item => item.title === expectedItem).length).toBe(1);
    } else {
        expect(result.length).toBe(0);
    }
}

function testItemDoesNotExist(text: string, notExpectedItem: string): void {
    const position = getMarkerPosition(text, marker);
    const result = CompletionService.provideCompletion(text.replace(marker, ""), position);

    expect(result.filter(item => item.title === notExpectedItem).length).toBe(0);
}

describe("Compiler.Services.CompletionService", () => {
    it("provides completion for a specific library", () => {
        testItemExists(`x = TextW${marker}`, "TextWindow");
    });

    it("does not provide completion for libraries not starting with the same prefix", () => {
        testItemDoesNotExist(`x = TextW${marker}`, "Time");
    });

    it("provides completion for a specific method", () => {
        testItemExists(`x = TextWindow.WriteL${marker}`, "WriteLine");
    });

    it("provides completion for a specific method - after dot", () => {
        testItemExists(`x = TextWindow.${marker}`, "WriteLine");
    });

    it("does not provide completion for methods not starting with the same prefix", () => {
        testItemDoesNotExist(`x = TextWindow.Wri${marker}`, "ForegroundColor");
    });
});
