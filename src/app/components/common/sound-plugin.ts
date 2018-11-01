import { ISoundLibraryPlugin } from "../../../compiler/runtime/libraries/sound";

export class SoundLibraryPlugin implements ISoundLibraryPlugin {

    private _midiEnabled : boolean | undefined;
    //private _midiAccess : WebMidi.MIDIAccess | undefined;

    public midiEnabled(): boolean {
        if (this._midiEnabled !== undefined) {
            return this._midiEnabled;
        }

        this._midiEnabled = false;
        if (navigator.requestMIDIAccess) {
            navigator.requestMIDIAccess()
                .then((midiAccess) => {
                    //this._midiAccess = midiAccess;

                    for (let entry of midiAccess.inputs) {
                        console.log("MIDI input device: " + entry[1].id);
                    }

                    for (let entry of midiAccess.outputs) {
                        console.log("MIDI output device: " + entry[1].id);
                        this._midiEnabled = true;
                    }
                })
                .catch((error) => {
                    this._midiEnabled = false;
                    throw new Error("MIDI not supported in this browser: " + error);
                });
        }

        return this._midiEnabled;
    }

    public playAudio(audioFile: string): void {
        if (audioFile !== "")
        {
            let audio = new Audio(audioFile);
            audio.play();
        }
    }

    public playNotes(notes: string): void {
        if (!this.midiEnabled())
        {
            throw new Error("MIDI not supported in this browser.");
        }

        throw new Error("Method not implemented. Trying to play \"" + notes + "\"");
    }
}
