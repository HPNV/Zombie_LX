import GameObject from '../module/character/GameObject';
export default class Live extends GameObject{
    value: number;
    constructor(x: number, y: number, value: number) {
        super({x: x, y: y, width: 50, height: 50});
        this.value = value;
    }

    draw(ctx: CanvasRenderingContext2D, time: Number): void {
        ctx.fillStyle = "green";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update(): void {
        
    }    
}