import GameObject from '../module/character/GameObject';
import Global from '../module/helper/Global';

export default class SkillCard extends GameObject{
    text: string;
    image: ImageBitmap;
    constructor(x: number, y: number, text: string) {
        super({x: x, y: y, width: 106 * 2, height: 164 * 2});
        this.text = text;
        this.image = Global.getInstance().assetManager.loadedImage["Card"];
    }

    draw(ctx: CanvasRenderingContext2D, time: Number): void {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "white";
        ctx.font = "24px Arial";
        ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2);
    }

    update(): void {
        
    }    

    clicked(x: number, y: number): boolean {
        return x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height;
    }
}