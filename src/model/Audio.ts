import GameObject from '../module/character/GameObject';
import Global from '../module/helper/Global';

export default class AudioRender extends GameObject {
    audio: HTMLAudioElement | null;

    constructor(audioPath: string) {
        super({ x: 0, y: 0, width: 0, height: 0 });
        this.audio = audioPath !== "" ? Global.getInstance().assetManager.loadedAudio[audioPath] : null;
    }

    play(): void {
        if (this.audio) {
            this.audio.play();
        }
    }

    stop(): void {
        if (this.audio) {
            this.audio.pause();
            this.audio.currentTime = 0;
        }
    }

    draw(ctx: CanvasRenderingContext2D, time: Number): void {
        // No visual rendering for audio
    }

    update(): void {
        // No update logic needed for audio
    }
}
