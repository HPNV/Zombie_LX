import GameObject from '../module/character/GameObject';
import SceneEngine from '../module/engine/SceneEngine';
import Global from '../module/helper/Global';
export default class Enemy extends GameObject{
    health: number;
    speed: number;
    damage: number;
    image: ImageBitmap | null;

    constructor(x: number, y: number, damage: number,image: string) {
        super({x: x, y: y, width: 64, height: 70});
        this.health = 20;
        this.speed = 0.1;
        this.damage = damage;
        this.image = image !== "" ? Global.getInstance().assetManager.loadedImage[image] : null;
    }

    draw(ctx: CanvasRenderingContext2D, time: Number): void {
        if(this.image) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        } else {
            ctx.fillStyle = "blue";
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    update(): void {
        this.speed = 0.1 * SceneEngine.getInstance().deltaTimeMilli();
    }

    move(playerX: number, playerY: number): void {
        let angle = Math.atan2(playerY - this.y, playerX - this.x);
        this.x += Math.cos(angle) * this.speed;
        this.y += Math.sin(angle) * this.speed;
    }
    
}