import GameObject from '../module/character/GameObject';
export default class Exp extends GameObject{
    value: number;

    constructor(x: number, y: number, minVal: number, maxVal: number) {
        super({x: x, y: y, width: 20, height: 20});
        this.value = minVal + Math.random() * (maxVal - minVal);
    }

    draw(ctx: CanvasRenderingContext2D, time: Number): void {
        ctx.fillStyle = "blue";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    update(): void {
        
    }
}