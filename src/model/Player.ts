import GameObject from '../module/character/GameObject';
import SceneEngine from '../module/engine/SceneEngine';
import Global from '../module/helper/Global';
import Projectile from './projectile';

export default class Player extends GameObject {
    name: string;
    baseSpeed: number;
    speed: number;
    health: number;
    ctx: CanvasRenderingContext2D;
    X: number;
    Y: number;
    level: number;
    exp: number;
    bullets: Projectile[];
    bulletCount: number;
    reloadTime: number;
    image: ImageBitmap | null;
    movingLeft: boolean;
    damage: number;

    constructor(name: string, x: number, y: number) {
        super({ x: 0, y: 0, width: 100, height: 100 });
        this.name = name;
        this.speed = 0;
        this.baseSpeed = 0.2;
        this.x = x;
        this.y = y;
        this.level = 1;
        this.exp = 0;
        this.health = 100;
        this.bullets = [];
        this.bulletCount = 10;
        this.reloadTime = 5000;
        this.image = Global.getInstance().assetManager.loadedImage["Player"];
        this.movingLeft = false;
        this.damage = 10;
    }

    draw(ctx: CanvasRenderingContext2D, time: Number): void {
        if (this.image) {
            ctx.save();
            if (this.movingLeft) {
                ctx.scale(-1, 1);
                ctx.drawImage(this.image, -this.x - this.width, this.y, this.width, this.height);
            } else {
                ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            }
            ctx.restore();
        } else {
            ctx.fillStyle = "red";
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    update(): void {
        if (this.health <= 0) {
            SceneEngine.getInstance().currentScene.destroyGameObject(this);
        }

        if (this.exp >= 100) {
            this.level += 1;
            this.exp = this.exp - 100;
        }
    }

    move(keys: Set<string>): void {
        var up = keys.has("w");
        var down = keys.has("s");
        var left = keys.has("a");
        var right = keys.has("d");

        if (up && right) {
            this.y -= this.speed;
            this.x += this.speed;
        } else if (up && left) {
            this.y -= this.speed;
            this.x -= this.speed;
        } else if (down && right) {
            this.y += this.speed;
            this.x += this.speed;
        } else if (down && left) {
            this.y += this.speed;
            this.x -= this.speed;
        } else if (up) {
            this.y -= this.speed;
        } else if (down) {
            this.y += this.speed;
        } else if (left) {
            this.x -= this.speed;
            this.movingLeft = true;
        } else if (right) {
            this.x += this.speed;
            this.movingLeft = false;
        }
    }

    setSpeed(deltaTime: number): void {
        this.speed = this.baseSpeed * deltaTime;
        this.bullets.forEach(bullet => {
            bullet.setSpeed(bullet.speed * deltaTime);
        });
    }

    attack(mouseX: number, mouseY: number): Projectile {
        var angle = Math.atan2(mouseY - this.y, mouseX - this.x);
        var dx = Math.cos(angle);
        var dy = Math.sin(angle);
        this.x += dx;
        this.y += dy;
        return new Projectile(this.x, this.y, angle, 2, this.damage, "bullet");
    }
}
