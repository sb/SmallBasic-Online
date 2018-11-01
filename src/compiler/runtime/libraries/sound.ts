import { LibraryTypeInstance, LibraryMethodInstance, LibraryPropertyInstance, LibraryEventInstance } from "../libraries";
import { SoundLibraryPlugin } from "../../../app/components/common/sound-plugin";
import { ExecutionEngine } from "../../execution-engine";
import { ValueKind } from "../values/base-value";

export const ClickSound = require("../../../app/content/sounds/click.wav");
export const ChimeSound = require("../../../app/content/sounds/chime.wav");
export const ChimesSound = require("../../../app/content/sounds/pause.wav");
export const BellRingSound = require("../../../app/content/sounds/bellring.wav");

enum Sound {
    Click,
    Chime,
    Chimes,
    BellRing
}

export interface ISoundLibraryPlugin {
    midiEnabled(): boolean;
    playAudio(audioFile : string): void;
    playNotes(notes: string): void;
}

export class SoundLibrary implements LibraryTypeInstance {
    private _pluginInstance: ISoundLibraryPlugin | undefined;

    public get plugin(): ISoundLibraryPlugin {
        if (!this._pluginInstance) {
            this._pluginInstance = new SoundLibraryPlugin();
        }

        return this._pluginInstance;
    }

    public set plugin(plugin: ISoundLibraryPlugin) {
        this._pluginInstance = plugin;
    }

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

        this.plugin.playAudio(audioFile);
    }

    private executePlayMusic(engine : ExecutionEngine): void {
        if (this.plugin.midiEnabled()) {
            const notes = engine.popEvaluationStack();
            if (notes.kind === ValueKind.String) {
                this.plugin.playNotes(notes.toValueString());
            }
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
        PlayMusic: { execute: engine => this.executePlayMusic(engine) },
        Play: { execute: () => { throw new Error("Not Implemented yet."); } },
        PlayAndWait: { execute: () => { throw new Error("Not Implemented yet."); } },
        Pause: { execute: () => { throw new Error("Not Implemented yet."); } },
        Stop: { execute: () => { throw new Error("Not Implemented yet."); } }
    };

    public readonly properties: { readonly [name: string]: LibraryPropertyInstance } = {};

    public readonly events: { readonly [name: string]: LibraryEventInstance } = {};
}
