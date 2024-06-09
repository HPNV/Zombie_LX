import GameObject from '../module/character/GameObject';
import SceneEngine from '../module/engine/SceneEngine';
import Global from '../module/helper/Global';
import Projectile from './projectile';

export default class Enemy extends GameObject {
    health: number;
    maxHealth: number;
    speed: number;
    damage: number;
    image: ImageBitmap | null;
    movingLeft: boolean;

    constructor(x: number, y: number, damage: number, health: number, image: string) {
        super({ x: x, y: y, width: 64, height: 70 });
        this.maxHealth = health;
        this.health = this.maxHealth;
        this.speed = 0.1;
        this.damage = damage;
        this.image = image !== "" ? Global.getInstance().assetManager.loadedImage[image] : null;
        this.movingLeft = false;
    }

    draw(ctx: CanvasRenderingContext2D, time: Number): void {
        if (this.image) {
            ctx.save();

            if (this.movingLeft) {
                ctx.translate(this.x + this.width, this.y);
                ctx.scale(-1, 1);
                ctx.drawImage(this.image, 0, 0, this.width, this.height);
            } else {
                ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            }

            ctx.restore();
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

    attack(mouseX: number, mouseY: number): Projectile {
        var angle = Math.atan2(mouseY - this.y, mouseX - this.x);
        var dx = Math.cos(angle);
        var dy = Math.sin(angle);
        this.x += dx;
        this.y += dy;
        var projectile = new Projectile(this.x, this.y, angle, 2, 10, "Bbullet");
        return projectile
    }
}
