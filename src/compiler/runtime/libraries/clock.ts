import { LibraryTypeInstance, LibraryMethodInstance, LibraryPropertyInstance } from "../libraries";
import { StringValue } from "../values/string-value";
import { BaseValue } from "../values/base-value";

export class ClockLibrary implements LibraryTypeInstance {
    private getTime(): BaseValue {
        const time = new Date().toLocaleTimeString();
        return new StringValue(time);
    }

    public readonly methods: { readonly [name: string]: LibraryMethodInstance } = {
    };

    public readonly properties: { readonly [name: string]: LibraryPropertyInstance } = {
        Time: { getter: this.getTime.bind(this) }
    };
}
