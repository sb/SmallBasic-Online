import { ExecutionEngine, ExecutionMode, ExecutionState } from "../execution-engine";
import { LibraryTypeDefinition } from "../supported-libraries";

export const TextWindowLibrary: LibraryTypeDefinition = {
    methods: {
        "Read": {
            argumentsCount: 0,
            returnsValue: true,
            execute: (engine: ExecutionEngine, _: ExecutionMode) => {
                if (engine.context.ioBuffer) {
                    engine.evaluationStack.push(engine.context.ioBuffer);
                    engine.executionStack.peek().instructionCounter++;

                    engine.context.state = ExecutionState.Running;
                    engine.context.ioBuffer = undefined;
                } else {
                    engine.context.state = ExecutionState.BlockedOnStringInput;
                }
            }
        },
        "ReadNumber": {
            argumentsCount: 0,
            returnsValue: true,
            execute: (engine: ExecutionEngine, _: ExecutionMode) => {
                if (engine.context.ioBuffer) {
                    engine.evaluationStack.push(engine.context.ioBuffer);
                    engine.executionStack.peek().instructionCounter++;

                    engine.context.state = ExecutionState.Running;
                    engine.context.ioBuffer = undefined;
                } else {
                    engine.context.state = ExecutionState.BlockedOnNumberInput;
                }
            }
        },
        "WriteLine": {
            argumentsCount: 1,
            returnsValue: false,
            execute: (engine: ExecutionEngine, _: ExecutionMode) => {
                engine.context.ioBuffer = engine.evaluationStack.pop();
                engine.executionStack.peek().instructionCounter++;
            }
        }
    },
    properties: {
    }
};
