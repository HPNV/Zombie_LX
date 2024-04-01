import GameObject from '../module/character/GameObject';
import SceneEngine from '../module/engine/SceneEngine';
import Projectile from './projectile';

export default class Player extends GameObject {
    name: string;
    public speed: number;
    health: number;
    ctx: CanvasRenderingContext2D;
    X: number;
    Y: number;
    bullets: Projectile[];

    constructor(name: string,x: number,y: number) {
        super({x: 0, y: 0, width: 32, height: 75});
        this.name = name;
        this.speed = 0.2;
        this.x = x;
        this.y = y;
        this.health = 100;
        this.bullets = [];
    }
    
    draw(ctx: CanvasRenderingContext2D, time: Number): void {
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update(): void {
        if(this.health <= 0){
            SceneEngine.getInstance().currentScene.destroyGameObject(this);
        }
    }

    move(keys: Set<string>): void {
        var up = keys.has("w");
        var down = keys.has("s");
        var left = keys.has("a");
        var right = keys.has("d");


        if(up && right){
            this.y -= this.speed;
            this.x += this.speed;
        } else if(up && left){
            this.y -= this.speed;
            this.x -= this.speed;
        } else if(down && right){
            this.y += this.speed;
            this.x+= this.speed;
        } else if (up) {
            this.y -= this.speed;
        } else if (down) {
            this.y += this.speed;
        } else if (left) {
            this.x -= this.speed;
        } else if (right) {
            this.x += this.speed;
        }
    }

    setSpeed(deltaTime: number): void {
        this.speed = 0.2 * deltaTime;
        this.bullets.forEach(bullet => {
            bullet.setSpeed(bullet.speed * deltaTime);
        });
    }

    attack(mouseX:number,mouseY: number): Projectile {
        var angle = Math.atan2(mouseY - this.y, mouseX - this.x);
        var dx = Math.cos(angle);
        var dy = Math.sin(angle);
        this.x += dx;
        this.y += dy;
        return new Projectile(this.x, this.y, angle,2,10);
    }
}