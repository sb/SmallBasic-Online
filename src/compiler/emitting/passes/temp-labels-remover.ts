import { BaseInstruction, InstructionKind, TempLabelInstruction, TempJumpInstruction, JumpInstruction, TempConditionalJumpInstruction, ConditionalJumpInstruction } from "../instructions";

export module TempLabelsRemover {
    export function remove(instructions: BaseInstruction[]): void {
        const map: { [key: string]: number } = {};

        for (let i = 0; i < instructions.length; i++) {
            if (instructions[i].kind === InstructionKind.TempLabel) {
                const label = instructions[i] as TempLabelInstruction;
                if (map[label.name]) {
                    throw new Error(`Label '${label.name}' exists twice in the same instruction set at '${map[label.name]}' and '${i}'`);
                }
                map[label.name] = i;
                instructions.splice(i, 1);
                i--;
            }
        }

        for (let i = 0; i < instructions.length; i++) {
            switch (instructions[i].kind) {
                case InstructionKind.TempJump: {
                    const jump = instructions[i] as TempJumpInstruction;
                    instructions[i] = new JumpInstruction(replaceJump(jump.target, map)!, jump.sourceRange);
                    break;
                }
                case InstructionKind.TempConditionalJump: {
                    const jump = instructions[i] as TempConditionalJumpInstruction;
                    instructions[i] = new ConditionalJumpInstruction(replaceJump(jump.trueTarget, map), replaceJump(jump.falseTarget, map), jump.sourceRange);
                    break;
                }
                case InstructionKind.Jump:
                case InstructionKind.ConditionalJump: {
                    throw new Error(`Unexpected instruction kind: ${InstructionKind[instructions[i].kind]}`);
                }
            }
        }
    }

    function replaceJump(target: string | undefined, map: { [key: string]: number }): number | undefined {
        if (target) {
            const index = map[target];
            if (index === undefined) {
                throw new Error(`Index for label ${target} was not calculated`);
            } else {
                return index;
            }
        } else {
            return undefined;
        }
    }
}
