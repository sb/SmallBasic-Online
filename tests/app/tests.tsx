import "jasmine";
import * as React from "react";
import * as ReactTestRenderer from "react-test-renderer";

import { About } from "../../src/app/components/about/about";

describe("Hello", () => {
    it("shows about text", () => {
        const hello = ReactTestRenderer.create(<About />).toJSON();

        expect(hello.type).toEqual("div");
        expect(hello.children).toEqual(["About"]);
    });
});
