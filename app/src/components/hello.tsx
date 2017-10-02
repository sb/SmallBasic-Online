import * as React from "react";

import * as compiler from "../../../compiler/src/compiler";

export const Hello = () => <h1>Hello. Value is {compiler.getFour()}!</h1>;
