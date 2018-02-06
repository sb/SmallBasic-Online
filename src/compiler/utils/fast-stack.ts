export class FastStack<T> {
    private values: T[];
    private validLength: number;

    public constructor() {
        this.values = [];
        this.validLength = 0;
    }

    public push(value: T): void {
        if (this.validLength < this.values.length) {
            this.values[this.validLength] = value;
        } else {
            this.values.push(value);
        }
        this.validLength++;
    }

    public pop(): T {
        if (this.validLength > 0) {
            return this.values[--this.validLength];
        } else {
            throw new Error(`Stack is empty`);
        }
    }

    public peek(): T {
        if (this.validLength > 0) {
            return this.values[this.validLength - 1];
        } else {
            throw new Error(`Stack is empty`);
        }
    }

    public get count(): number {
        return this.validLength;
    }

    public get items(): T[] {
        return this.values.slice(0, this.validLength);
    }
}
