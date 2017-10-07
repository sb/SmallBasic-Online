import "jasmine";
import * as React from "react";
import * as ReactTestRenderer from "react-test-renderer";

import { Hello } from "../../src/app/components/hello";

describe("Hello", () => {
    it("displays four", () => {
        const hello = ReactTestRenderer.create(<Hello />).toJSON();

        expect(hello.type).toEqual("h1");
        expect(hello.children).toEqual(["Hello. Value is ", "4", "!"]);
    });
});
