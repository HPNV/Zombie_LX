import GameObject from '../module/character/GameObject';

export default class SkillCard extends GameObject{
    text: string;
    constructor(x: number, y: number, text: string, width: number, height: number) {
        super({x: x, y: y, width: width, height: height});
        this.text = text;
    }

    draw(ctx: CanvasRenderingContext2D, time: Number): void {
        ctx.fillStyle = "grey";
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "white";
        ctx.font = "24px Arial";
        ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2);
    }

    update(): void {
        
    }    
}