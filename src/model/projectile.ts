import GameObject from "../module/character/GameObject";

export default class Projectile extends GameObject{
    angle: number;
    speed: number;
    damage: number;

    draw(ctx: CanvasRenderingContext2D, time: Number): void {
        ctx.fillStyle = "black";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update(): void {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
    }

    constructor(x: number, y: number, angle: number, speed: number, damage: number) {
        super({x: x, y: y, width: 5, height: 5});
        this.angle = angle;
        this.speed = speed;
        this.damage = damage;
    }

    setSpeed(speed: number): void {
        this.speed = speed;
    }

}