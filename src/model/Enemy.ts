import GameObject from '../module/character/GameObject';
import SceneEngine from '../module/engine/SceneEngine';
export default class Enemy extends GameObject{
    health: number;
    speed: number;
    damage: number;

    constructor(x: number, y: number, damage: number) {
        super({x: x, y: y, width: 32, height: 50});
        this.health = 20;
        this.speed = 0.1;
        this.damage = damage;
    }

    draw(ctx: CanvasRenderingContext2D, time: Number): void {
        ctx.fillStyle = "blue";
        ctx.fillRect(this.x, this.y, this.width, this.height);
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