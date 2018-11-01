import "jasmine";
import { Compilation } from "../../../../src/compiler/compilation";
import { ExecutionEngine, ExecutionMode, ExecutionState } from "../../../../src/compiler/execution-engine";
import { TestSoundLibraryPlugin } from "../../helpers";
import { ClickSound, ChimeSound, ChimesSound, BellRingSound } from "../../../../src/compiler/runtime/libraries/sound";

describe("Compiler.Runtime.Libraries.Sound", () => {
    it("plays a clicking sound", () => {
        const compilation = new Compilation(`
Sound.PlayClick()`);

        const plugin = new TestSoundLibraryPlugin();
        const engine = new ExecutionEngine(compilation);
        
        engine.libraries.Sound.plugin = plugin;
        engine.execute(ExecutionMode.RunToEnd);

        expect(plugin.getLastAudioPlayed()).toBe(ClickSound);
        expect(engine.state).toBe(ExecutionState.Terminated);
        expect(engine.exception).toBeUndefined();
    });
    
    it("plays a chiming sound", () => {
        const compilation = new Compilation(`
Sound.PlayChime()`);

        const plugin = new TestSoundLibraryPlugin();
        const engine = new ExecutionEngine(compilation);
        
        engine.libraries.Sound.plugin = plugin;
        engine.execute(ExecutionMode.RunToEnd);

        expect(plugin.getLastAudioPlayed()).toBe(ChimeSound);
        expect(engine.state).toBe(ExecutionState.Terminated);
        expect(engine.exception).toBeUndefined();
    });

    it("plays the chimes sound", () => {
        const compilation = new Compilation(`
Sound.PlayChimes()`);

        const plugin = new TestSoundLibraryPlugin();
        const engine = new ExecutionEngine(compilation);
        
        engine.libraries.Sound.plugin = plugin;
        engine.execute(ExecutionMode.RunToEnd);

        expect(plugin.getLastAudioPlayed()).toBe(ChimesSound);
        expect(engine.state).toBe(ExecutionState.Terminated);
        expect(engine.exception).toBeUndefined();
    });

    it("plays a ringing bell sound", () => {
        const compilation = new Compilation(`
Sound.PlayBellRing()`);

        const plugin = new TestSoundLibraryPlugin();
        const engine = new ExecutionEngine(compilation);
        
        engine.libraries.Sound.plugin = plugin;
        engine.execute(ExecutionMode.RunToEnd);

        expect(plugin.getLastAudioPlayed()).toBe(BellRingSound);
        expect(engine.state).toBe(ExecutionState.Terminated);
        expect(engine.exception).toBeUndefined();
    });
});
