import GameObject from "../module/character/GameObject";
import Global from "../module/helper/Global";


export default class Tile extends GameObject{
    iamge : ImageBitmap;

    draw(ctx: CanvasRenderingContext2D, time: Number): void {
        ctx.drawImage(this.iamge, this.x, this.y);
    }

    update(): void {

    }

    constructor(x: number, y: number, image: string) {
        super({x: x, y: y, width: 32, height: 32});
        this.iamge = Global.getInstance().assetManager.loadedImage[image];
    }
        
}