import { LibraryTypeInstance, LibraryMethodInstance, LibraryPropertyInstance, LibraryEventInstance } from "../libraries";

export class FlickrLibrary implements LibraryTypeInstance {
    public readonly methods: { readonly [name: string]: LibraryMethodInstance } = {
    };

    public readonly properties: { readonly [name: string]: LibraryPropertyInstance } = {};

    public readonly events: { readonly [name: string]: LibraryEventInstance } = {};
}
