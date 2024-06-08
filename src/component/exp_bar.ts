import GameObject from '../module/character/GameObject';
export default class Bar extends GameObject{
    value: number;
    color: string;
    constructor(x: number, y: number, value: number, color: string) {
        super({x: x, y: y, width: 0, height: 50});
        this.color = color;
        this.value = value;
    }

    draw(ctx: CanvasRenderingContext2D, time: Number): void {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update(): void {
        
    }    
}