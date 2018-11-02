import { ISoundLibraryPlugin } from "../../../compiler/runtime/libraries/sound";

export class SoundLibraryPlugin implements ISoundLibraryPlugin {

    private _midiEnabled : boolean | undefined;
    private _midiAccess : WebMidi.MIDIAccess | undefined;

    private _octave : number = 4;
    private _defaultLength : number = 4;

    private _notes : { [id: string]: number; } = {
        "C" : 0,
        "C+": 1, "C#": 1, "D-": 1,
        "D": 2,
        "D+": 3, "D#": 3, "E-": 3,
        "E": 4, 
        "F": 5,
        "F+": 6, "F#": 6, "G-": 6,
        "G": 7, 
        "G+": 8, "G#": 8, "A-": 8,
        "A": 9,
        "A+": 10, "A#": 10, "B-": 10,
        "B": 11
    };
    
    public midiEnabled(): boolean {
        if (this._midiEnabled !== undefined) {
            return this._midiEnabled;
        }

        this._midiEnabled = false;
        if (navigator.requestMIDIAccess) {
            navigator.requestMIDIAccess()
                .then((midiAccess) => {
                    this._midiAccess = midiAccess;

                    for (let entry of midiAccess.inputs) {
                        console.log("MIDI input device: " + entry[1].id);
                    }

                    for (let entry of midiAccess.outputs) {
                        console.log("MIDI output device: " + entry[1].id);
                        this._midiEnabled = true;
                        entry[1].send(this.GetInstrumentSetupBytes());
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

        let i : number = 0;
        let note : string = "";
        notes = notes.toUpperCase();

        let maxLength : number = notes.length;
        while (i < notes.length)
        {
            let length : number = this._defaultLength;

            let c = notes[i++];
            if (this.IsLetter(c)) {
                note = c;
            }
            else {
                if (c === ">")
                    this._octave = Math.min(8, this._octave + 1);
                else if (c === "<")
                    this._octave = Math.max(0, this._octave - 1);

                continue;
            }

            if (i < maxLength)
            {
                c = notes[i];
                if (c === "#" || c === "+" || c === "-")
                {
                    note += c;
                    i++;
                }

                if (i < maxLength)
                {
                    c = notes[i];
                    if (this.IsDigit(c))
                    {
                        length = Number(c);
                        i++;
                    }

                    if (i < maxLength)
                    {
                        c = notes[i];
                        if (this.IsDigit(c))
                        {
                            length = length * 10 + Number(c);
                            i++;
                        }
                    }
                }
            }

            if (note[0] === "O")
                this._octave = length;
            else
                this.PlayNote(this._octave, note, length);
        }
    }

    private PlayNote(octave: number, note: string, length: number) : void {
        let sleepTime : number = 16.0 * 100.0 / length;
        if (note === "P" || note === "R") {
            setTimeout(() => {
                // TODO: This is NOT the right way to do a Thread.Sleep, but putting it 
                // in here as a placeholder prior to (probably) refactoring the code. 
                return;
            }, sleepTime);
        }

        if (note === "L")
        {
            this._defaultLength = length;
            return;
        }

        let lowOrder = this._notes[note];
        if (lowOrder === undefined) {
            lowOrder = 0;
        }

        octave = Math.min(Math.max(0, octave), 8);

        let noteNumber = octave * 12 + lowOrder;
        this.PlaySingleNote(noteNumber);

        setTimeout(() => {
            // TODO: This is NOT the right way to do a Thread.Sleep, but putting it 
            // in here as a placeholder prior to (probably) refactoring the code. 
            return;
        }, sleepTime);
    }

    private PlaySingleNote(noteNumber : number) : void {
        if (this._midiAccess === undefined) {
            throw new Error("INTERNAL ERROR: We should always have MIDI access if we have reached this point.");
        }
        
        let noteBytes = [0x90, noteNumber, 100, 0];

        for (let entry of this._midiAccess.outputs) {
            entry[1].send(noteBytes);
        }
    }

    private IsLetter(c : string) : boolean {
        if (c.length !== 1) {
            throw new Error("INTERNAL ERROR: IsLetter should only be used with single characters.");
        }

        // NOTE: This works on the assumption that we will only be passed capitalized English (A-Z)
        // letters, since this function is currently only used by PlayNotes above. This is a hack 
        // because there doesn't seem to be an obvious equivalent to char.IsLetter() in C#.
        return c[0] >= "A" && c[0] <= "Z";
    }

    private IsDigit(c : string) : boolean {
        if (c.length !== 1) {
            throw new Error("INTERNAL ERROR: IsDigit should only be used with single characters.");
        }

        // NOTE: This is a hack because there doesn't seem to be an obvious equivalent to 
        // char.IsDigit() in C#.
        return c[0] >= "0" && c[0] <= "9";
    }

    private GetInstrumentSetupBytes(): number[] {
        return [ 0xC0, 0, 0, 0 ];
    }
}
