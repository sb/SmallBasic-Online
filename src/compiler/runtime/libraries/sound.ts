import { LibraryTypeInstance, LibraryMethodInstance, LibraryPropertyInstance, LibraryEventInstance } from "../libraries";

const ClickSound = require("../../../app/content/sounds/click.wav");
const ChimeSound = require("../../../app/content/sounds/chime.wav");
const ChimesSound = require("../../../app/content/sounds/pause.wav");
const BellRingSound = require("../../../app/content/sounds/bellring.wav");

enum Sound {
    Click,
    Chime,
    Chimes,
    BellRing
}

export class SoundLibrary implements LibraryTypeInstance {
    
    private executePlayStockSound(soundName: Sound): void {
        let audioFile : string = "";
        switch (soundName) {
            case Sound.Click:
                audioFile = ClickSound;
                break;
            case Sound.Chime:
                audioFile = ChimeSound;
                break;
            case Sound.Chimes:
                audioFile = ChimesSound;
                break;
            case Sound.BellRing:
                audioFile = BellRingSound;
                break;
        }

        if (audioFile !== "")
        {
            let audio = new Audio(audioFile);
            audio.play();
        }
    }

    public readonly methods: { readonly [name: string]: LibraryMethodInstance } = {
        PlayClick: { execute: this.executePlayStockSound.bind(this, Sound.Click) },
        PlayClickAndWait: { execute: () => { throw new Error("Not Implemented yet."); } },
        PlayChime: { execute: this.executePlayStockSound.bind(this, Sound.Chime) },
        PlayChimeAndWait: { execute: () => { throw new Error("Not Implemented yet."); } },
        PlayChimes: { execute: this.executePlayStockSound.bind(this, Sound.Chimes) },
        PlayChimesAndWait: { execute: () => { throw new Error("Not Implemented yet."); } },
        PlayBellRing: { execute: this.executePlayStockSound.bind(this, Sound.BellRing) },
        PlayBellRingAndWait: { execute: () => { throw new Error("Not Implemented yet."); } },
        PlayMusic: { execute: () => { throw new Error("Not Implemented yet."); } },
        Play: { execute: () => { throw new Error("Not Implemented yet."); } },
        PlayAndWait: { execute: () => { throw new Error("Not Implemented yet."); } },
        Pause: { execute: () => { throw new Error("Not Implemented yet."); } },
        Stop: { execute: () => { throw new Error("Not Implemented yet."); } }
    };

    public readonly properties: { readonly [name: string]: LibraryPropertyInstance } = {};

    public readonly events: { readonly [name: string]: LibraryEventInstance } = {};
}
