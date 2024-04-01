import AssetManager from "../engine/AssetManager";

export default class Global{
    debug: boolean;

    width: number;
    height: number;
    private static instance: Global = null;
    assetManager: AssetManager;
    name: string;
    tile_size: number;
    fpsCap: boolean;
    clearCap: boolean;
    deltaTime: number;

    maxTileCount: number;
    flipNum = 0;

    private constructor(){
        this.width = 0;
        this.height = 0;
        this.debug = false;
        this.assetManager = new AssetManager();
        this.name = "";
        this.tile_size = 50;
        this.fpsCap = true;
        this.clearCap = false;
        this.maxTileCount = 5;
        this.flipNum = 0;
    }

    public static getInstance(): Global{
        if(this.instance===null){
            this.instance = new Global();
        }
        return this.instance;
    }

}