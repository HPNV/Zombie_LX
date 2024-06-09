import GameObject from '../module/character/GameObject';
import SceneEngine from '../module/engine/SceneEngine';
import Global from '../module/helper/Global';

export default class Enemy extends GameObject {
    health: number;
    maxHealth: number;
    speed: number;
    damage: number;
    image: ImageBitmap | null;
    movingLeft: boolean;

    constructor(x: number, y: number, damage: number, image: string) {
        super({ x: x, y: y, width: 64, height: 70 });
        this.maxHealth = 20;
        this.health = this.maxHealth;
        this.speed = 0.1;
        this.damage = damage;
        this.image = image !== "" ? Global.getInstance().assetManager.loadedImage[image] : null;
        this.movingLeft = false;
    }

    draw(ctx: CanvasRenderingContext2D, time: Number): void {
        if (this.image) {
            ctx.save(); // Save the current state

            if (this.movingLeft) {
                ctx.translate(this.x + this.width, this.y); // Move the origin to the sprite's position
                ctx.scale(-1, 1); // Flip the sprite horizontally
                ctx.drawImage(this.image, 0, 0, this.width, this.height);
            } else {
                ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            }

            ctx.restore(); // Restore the previous state
        } else {
            ctx.fillStyle = "blue";
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }

        this.drawHealthBar(ctx);
    }

    drawHealthBar(ctx: CanvasRenderingContext2D): void {
        const barWidth = this.width;
        const barHeight = 5;
        const barX = this.x;
        const barY = this.y + this.height + 2;

        ctx.fillStyle = 'red';
        ctx.fillRect(barX, barY, barWidth, barHeight);

        const healthWidth = (this.health / this.maxHealth) * barWidth;
        ctx.fillStyle = 'green';
        ctx.fillRect(barX, barY, healthWidth, barHeight);
    }

    update(): void {
        this.speed = 0.1 * SceneEngine.getInstance().deltaTimeMilli();
    }

    move(playerX: number, playerY: number): void {
        let angle = Math.atan2(playerY - this.y, playerX - this.x);
        let newX = this.x + Math.cos(angle) * this.speed;
        let newY = this.y + Math.sin(angle) * this.speed;

        this.movingLeft = newX < this.x;

        this.x = newX;
        this.y = newY;
    }
}
