export default class AssetManager{
    private _ipaths: any;
    private _assetDone: Function;
    private _images: any;
    private _doneCount: number;
    private _loadedImage: any;

    get ipaths(): any {
        return this._ipaths;
    }

    get assetDone(): Function {
        return this._assetDone;
    }

    get images(): any {
        return this._images;
    }

    get doneCount(): number {
        return this._doneCount;
    }

    get loadedImage(): any {
        return this._loadedImage;
    }

    constructor(){
        this._ipaths = [];
        this._assetDone = null;
        this._images = [];
        this._doneCount =0;
        this._loadedImage = {};
    }

    addPath(name: string,path: string){
        this._ipaths.push({
            "name":name,
            "path":path
        });
    }

    addAssetDoneListener(assetDone: Function){
        this._assetDone = assetDone;
    }

    loadAsset(){
        let clonePaths = [...this._ipaths];
        clonePaths.forEach(c => {
            let name = c["name"];
            let path = c["path"];

            let img = new Image();
            img.src = "./assets/images/"+path;
            img.onload = () =>{
                this._loadedImage[name] = img;
                this._doneCount++;

                this.check();
            }
        });
        this.check();
    }

    check(){
        if(this._doneCount == this._ipaths.length){
            this._assetDone();
        }
    }

    loadImage(path: string){
        let img = new Image();
        img.src = "./assets/images/"+path;
        return img;
    }

}

