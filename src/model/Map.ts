import GameObject from "../module/character/GameObject";
import SceneEngine from "../module/engine/SceneEngine";
import CanvasController from "../module/page/CanvasController";
import Player from "./Player";
import Tile from "./tile";

export default class Map extends GameObject{
    tiles : Tile[];
    public player : Player;
    canvasWidth: number;
    canvasHeight: number;

    constructor(canvas: CanvasController){
        super({x: 0, y: 0, width: canvas.getWidthCanvas(), height: canvas.getHeightCanvas()});
        this.canvasWidth = canvas.getWidthCanvas();
        this.canvasHeight = canvas.getHeightCanvas();
        this.tiles = [];
        this.player = new Player("ajax",canvas.getWidthCanvas() / 2,canvas.getHeightCanvas() / 2);
    }

    draw(ctx: CanvasRenderingContext2D, time: Number): void {
        this.tiles.forEach(tile => {
            tile.draw(ctx, time);
        });
        this.player.draw(ctx, time);
    }

    update(): void {
        this.player.setSpeed(SceneEngine.getInstance().deltaTimeMilli());
        this.player.update();
    }

    getRandomTile() {
        const randomIndex = Math.floor(Math.random() * 9) + 1;
        var tile = `tile${randomIndex}`;
        return tile;
    }

    initMap() {
        for (let i = 0; i < this.canvasHeight / 32; i++) {
            for (let j = 0; j < this.canvasWidth / 32; j++) {
              this.tiles.push(new Tile(j * 32, i * 32, this.getRandomTile()));
            }
        }
    }

    getBottom() {
        return this.y + this.height;
    }

    getRight() {
        return this.x + this.width;
    }

    getLeft() {
        return this.x;
    }

    getTop() {
        return this.y;
    }
}