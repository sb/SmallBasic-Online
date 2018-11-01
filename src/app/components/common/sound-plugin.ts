import { ISoundLibraryPlugin } from "../../../compiler/runtime/libraries/sound";

export class SoundLibraryPlugin implements ISoundLibraryPlugin {

    public playAudio(audioFile: string): void {
        if (audioFile !== "")
        {
            let audio = new Audio(audioFile);
            audio.play();
        }
    }
}
