import { BaseValue } from "./values/base-value";
import { TextWindowColors } from "./libraries/text-window";

export class IOBuffer {
    private value?: BaseValue;

    public foreground: TextWindowColors;
    public background: TextWindowColors;

    public constructor() {
        this.foreground = TextWindowColors.White;
        this.background = TextWindowColors.Black;
    }

    public hasValue(): boolean {
        return !!this.value;
    }

    public writeValue(value: BaseValue): void {
        if (this.value) {
            throw new Error(`Existing value not read yet`);
        }

        this.value = value;
    }

    public readValue(): BaseValue {
        if (!this.value) {
            throw new Error(`No value exists in buffer`);
        }

        const value = this.value;
        this.value = undefined;
        return value;
    }
}
