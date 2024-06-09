import GameObject from '../module/character/GameObject';
import Global from '../module/helper/Global';

export default class ImageRender extends GameObject{
    image: ImageBitmap | null;

    constructor(x: number, y: number, image: string) {
        super({x: x, y: y, width: x, height: y});
        this.image = image !== "" ? Global.getInstance().assetManager.loadedImage[image] : null;
        this.width = this.image.width;
        this.height = this.image.height;
    }

    draw(ctx: CanvasRenderingContext2D, time: Number): void {
        if(this.image) {
            ctx.drawImage(this.image, this.x, this.y);
        } else {
            ctx.fillStyle = "black";
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    update(): void {
        
    }
    
    clicked(x: number, y: number): boolean {
        return x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height;
    }
}