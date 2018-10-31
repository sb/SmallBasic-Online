import { LibraryTypeInstance, LibraryMethodInstance, LibraryPropertyInstance, LibraryEventInstance } from "../libraries";

const ClickSound = require("../../../app/content/sounds/click.wav");

enum Sound {
    Click
}

export class SoundLibrary implements LibraryTypeInstance {
    
    private executePlayStockSound(soundName: Sound): void {
        let audioFile : string = "";
        switch (soundName) {
            case Sound.Click:
                audioFile = ClickSound;
                break;
        }

        if (audioFile !== "")
        {
            let audio = new Audio(audioFile);
            audio.play();
        }
    }

    public readonly methods: { readonly [name: string]: LibraryMethodInstance } = {
        PlayClick: { execute: this.executePlayStockSound.bind(this, Sound.Click) }
    };

    public readonly properties: { readonly [name: string]: LibraryPropertyInstance } = {};

    public readonly events: { readonly [name: string]: LibraryEventInstance } = {};
}
