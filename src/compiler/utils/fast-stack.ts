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
        return this.values[this.validLength--];
    }

    public peek(): T {
        if (this.validLength > 0) {
            return this.values[this.validLength];
        } else {
            throw `Stack is empty`;
        }
    }

    public count(): number {
        return this.validLength;
    }
}
