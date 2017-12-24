import { ExecutionEngine, ExecutionMode } from "../execution-engine";
import { LibraryTypeDefinition } from "../supported-libraries";
import { StringValue } from "../values/string-value";

export const ClockLibrary: LibraryTypeDefinition = {
    methods: {
    },
    properties: {
        "Time": {
            getter: (engine: ExecutionEngine, _: ExecutionMode) => {
                // TODO: correctly implement user's locale
                const time = new Date().toLocaleTimeString();
                engine.evaluationStack.push(new StringValue(time));
                engine.executionStack.peek().instructionCounter++;
            }
        }
    }
};
