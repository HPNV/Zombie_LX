export default class AssetManager {
    private _ipaths: any;
    private _apaths: any;
    private _assetDone: Function;
    private _images: any;
    private _audios: any;
    private _doneCount: number;
    private _loadedImage: any;
    private _loadedAudio: any;

    get ipaths(): any {
        return this._ipaths;
    }

    get apaths(): any {
        return this._apaths;
    }

    get assetDone(): Function {
        return this._assetDone;
    }

    get images(): any {
        return this._images;
    }

    get audios(): any {
        return this._audios;
    }

    get doneCount(): number {
        return this._doneCount;
    }

    get loadedImage(): any {
        return this._loadedImage;
    }

    get loadedAudio(): any {
        return this._loadedAudio;
    }

    get totalAssets(): number {
        return this._ipaths.length + this._apaths.length;
    }

    constructor() {
        this._ipaths = [];
        this._apaths = [];
        this._assetDone = null;
        this._images = [];
        this._audios = [];
        this._doneCount = 0;
        this._loadedImage = {};
        this._loadedAudio = {};
    }

    addImagePath(name: string, path: string) {
        this._ipaths.push({
            "name": name,
            "path": path
        });
    }

    addAudioPath(name: string, path: string) {
        this._apaths.push({
            "name": name,
            "path": path
        });
    }

    addAssetDoneListener(assetDone: Function) {
        this._assetDone = assetDone;
    }

    loadAssets() {
        this.loadAudios();
        this.loadImages();
    }

    loadImages() {
        let clonePaths = [...this._ipaths];
        clonePaths.forEach(c => {
            let name = c["name"];
            let path = c["path"];

            let img = new Image();
            img.src = "./assets/images/" + path;
            img.onload = () => {
                this._loadedImage[name] = img;
                this._doneCount++;

                this.check();
            }
        });
    }

    loadAudios() {
        let clonePaths = [...this._apaths];
        clonePaths.forEach(c => {
            let name = c["name"];
            let path = c["path"];

            let audio = new Audio("./assets/audio/" + path);
            audio.onloadeddata = () => {
                this._loadedAudio[name] = audio;
                this._doneCount++;

                this.check();
            }
        });
    }

    check() {
        if (this._doneCount === this._ipaths.length + this._apaths.length) {
            this._assetDone();
        }
    }

    loadImage(path: string) {
        let img = new Image();
        img.src = "./assets/images/" + path;
        return img;
    }

    loadAudio(path: string) {
        let audio = new Audio("./assets/audio/" + path);
        return audio;
    }
}
