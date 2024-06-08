import GameObject from '../module/character/GameObject';
export default class ProgressBar extends GameObject{
    value: number;
    color: string;
    constructor(x: number, y: number, value: number, color: string, width: number, height: number) {
        super({x: x, y: y, width: width, height: height});
        this.color = color;
        this.value = value;
    }

    draw(ctx: CanvasRenderingContext2D, time: Number): void {
        ctx.fillStyle = "grey";
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.value, this.height);
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "white";
        ctx.font = "24px Arial";
        ctx.fillText(`${Math.floor(this.value)}/${this.width}`, this.x + this.width / 2, this.y + this.height / 2);
    }

    update(): void {
        
    }    
}