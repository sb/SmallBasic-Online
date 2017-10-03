import * as React from "react";

import * as compiler from "../compiler/compiler";

export const Hello = () => <h1>Hello. Value is {compiler.getFour()}!</h1>;
