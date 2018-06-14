import { ValueKind, BaseValue } from "../values/base-value";
import { NumberValue } from "../values/number-value";
import { LibraryMethodInstance, LibraryTypeInstance, LibraryPropertyInstance } from "../libraries";

export class TurtleLibrary implements LibraryTypeInstance {
    private _speed: number = 1;

    private getSpeed(): BaseValue {
        return new NumberValue(this._speed);
    }

    private setSpeed(value: BaseValue): void {
        value = value.tryConvertToNumber();
        if (value.kind === ValueKind.Number) {
            const newSpeed = (value as NumberValue).value;
            if (newSpeed < 1) {
                this._speed = 1;
            } else if (newSpeed > 10) {
                this._speed = 10;
            } else {
                this._speed = newSpeed;
            }
        }
    }

    public readonly methods: { readonly [name: string]: LibraryMethodInstance } = {
    };

    public readonly properties: { readonly [name: string]: LibraryPropertyInstance } = {
        Speed: { getter: this.getSpeed, setter: this.setSpeed }
    };
}
