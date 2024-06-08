import GameObject from "../module/character/GameObject";
import Global from "../module/helper/Global";

export default class Projectile extends GameObject {
    angle: number;
    speed: number;
    damage: number;
    image: ImageBitmap | null;

    constructor(x: number, y: number, angle: number, speed: number, damage: number, image: string) {
        super({ x: x, y: y, width: 5, height: 5 });
        this.angle = angle;
        this.speed = speed;
        this.damage = damage;
        this.image = image !== "" ? Global.getInstance().assetManager.loadedImage[image] : null;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        if (this.image) {
            const rotatedImage = this.getRotatedImage(this.image, this.angle);
            ctx.drawImage(rotatedImage, this.x, this.y);
        } else {
            ctx.fillStyle = "black";
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    update(): void {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
    }

    setSpeed(speed: number): void {
        this.speed = speed;
    }

    private getRotatedImage(image: ImageBitmap, angle: number): HTMLCanvasElement {
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext('2d')!;
        ctx.translate(image.width / 2, image.height / 2);
        ctx.rotate(angle);
        ctx.drawImage(image, -image.width / 2, -image.height / 2);
        return canvas;
    }
}
