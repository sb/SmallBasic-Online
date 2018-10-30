import { ExecutionEngine } from "../../execution-engine";
import { LibraryTypeInstance, LibraryMethodInstance, LibraryPropertyInstance, LibraryEventInstance } from "../libraries";

export class SoundLibrary implements LibraryTypeInstance {
    
    private executePlayStockSound(engine: ExecutionEngine, soundName: string, sync: boolean): void {

    }

    public readonly methods: { readonly [name: string]: LibraryMethodInstance } = {
        PlayClick: { execute: this.executePlayStockSound.bind(this, "Click.wav", false) },
        PlayClickAndWait: { execute: this.executePlayStockSound.bind(this, "Click.wav", true) },
    };

    public readonly properties: { readonly [name: string]: LibraryPropertyInstance } = {};

    public readonly events: { readonly [name: string]: LibraryEventInstance } = {};
}
