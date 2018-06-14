import { BaseInstruction, InstructionKind, TempLabelInstruction, TempJumpInstruction, JumpInstruction, TempConditionalJumpInstruction, ConditionalJumpInstruction } from "./instructions";

export module Optimizations {
    export function removeTempInstructions(instructions: BaseInstruction[]): void {
        const labelToIndexMap: { [key: string]: number } = {};

        for (let i = 0; i < instructions.length; i++) {
            if (instructions[i].kind === InstructionKind.TempLabel) {
                const label = instructions[i] as TempLabelInstruction;
                if (labelToIndexMap[label.name]) {
                    throw new Error(`Label ${label.name} exists twice in the same instruction set`);
                }
                labelToIndexMap[label.name] = i;
                instructions.splice(i, 1);
                i--;
            }
        }

        function replaceJump(target: string | undefined): number | undefined {
            if (target) {
                const index = labelToIndexMap[target];
                if (index === undefined) {
                    throw new Error(`Index for label ${target} was not calculated`);
                } else {
                    return index;
                }
            } else {
                return undefined;
            }
        }

        for (let i = 0; i < instructions.length; i++) {
            switch (instructions[i].kind) {
                case InstructionKind.TempJump: {
                    const jump = instructions[i] as TempJumpInstruction;
                    instructions[i] = new JumpInstruction(replaceJump(jump.target)!, jump.sourceRange);
                    break;
                }
                case InstructionKind.TempConditionalJump: {
                    const jump = instructions[i] as TempConditionalJumpInstruction;
                    instructions[i] = new ConditionalJumpInstruction(replaceJump(jump.trueTarget), replaceJump(jump.falseTarget), jump.sourceRange);
                    break;
                }
            }
        }
    }
}
