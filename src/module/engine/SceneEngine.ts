import Global from '../helper/Global';
import Scene from '../page/Scene';
import CanvasController from '../page/CanvasController';
import GameObject from '../character/GameObject';
import TimeCounter from "../helper/TimeCounter";

export default class SceneEngine {
    canvas: HTMLCanvasElement;
    private renderCanvas: HTMLCanvasElement;
    canvasController: CanvasController;
    ctx: CanvasRenderingContext2D;
    private ctxR: CanvasRenderingContext2D;
    currentScene: Scene;
    private readyStatus: boolean;
    private static instance: SceneEngine = null;
    private fpsRealization: number = 0;

    private previousTime = -1;
    private fps = 60;
    private frameTime = 1000/this.fps;

    private last_time: number = this.getTime();
    private renderTimeCounter: TimeCounter;
    private clearTimeCounter: TimeCounter;
    private willRender: boolean;
    

    private constructor(){
        this.willRender = true;
    }

    public getFPSRealization(){
        return this.fpsRealization;
    }

    public deltaTime(): number{
        let time = this.getTime();
        return ((time - this.last_time) / 1000);
    }

    public deltaTimeMilli(): number{
        let time = this.getTime();
        return ((time - this.last_time));
    }

    getTime(): number{
        return new Date().getTime();
    }

    initCanvas(canvas: HTMLCanvasElement){
        this.readyStatus = false;
        this.canvas = canvas;
        this.canvasController = new CanvasController(this.canvas);
        this.ctx = this.canvasController.getContext2d();
        this.currentScene = null;
        this.canvasController.setMaximize();
        Global.getInstance().width = this.canvasController.getWidthCanvas();
        Global.getInstance().height = this.canvasController.getHeightCanvas();
        this.renderCanvas = document.createElement("canvas");
        this.renderCanvas.width = this.canvas.width;
        this.renderCanvas.height = this.canvas.height;
        this.ctxR = this.renderCanvas.getContext("2d");
        canvas.addEventListener("click", (e)=>this.mouseClick(e));
        canvas.addEventListener("mousemove", (e)=>this.mouseMove(e));
        canvas.addEventListener("mousedown", (e)=>this.mouseDown(e));
        canvas.addEventListener("mouseup", (e)=>this.mouseUp(e));
        document.addEventListener('contextmenu', (e)=>this.mouseContextMenu(e));
        window.addEventListener("keydown", (e)=>this.keyDown(e));
        this.renderTimeCounter = new TimeCounter(this.frameTime);
        this.clearTimeCounter = new TimeCounter(this.frameTime * 2);
    }

    mouseContextMenu(e: MouseEvent){
        e.preventDefault();
        if(this.currentScene != null){
            this.currentScene.mouseContextMenu(e);
        }
    }

    keyDown(e: KeyboardEvent){
        if(this.currentScene != null){
            this.currentScene.keyDown(e);
        }
    }

    keyUp(e: KeyboardEvent){
        if(this.currentScene != null){
            this.currentScene.keyUp(e);
        }
    }

    mouseDown(e: MouseEvent){
        if(this.currentScene != null){
            this.currentScene.mouseDown(e);
        }
    }
    mouseUp(e: MouseEvent){
        if(this.currentScene != null){
            this.currentScene.mouseUp(e);
        }
    }

    mouseMove(e: MouseEvent){
        if(this.currentScene != null){
            this.currentScene.mouseMove(e);
        }
    }

    mouseClick(e: MouseEvent){
        if(this.currentScene != null){
            this.currentScene.mouseClick(e);
        }
    }

    getCanvasController(){
        return this.canvasController;
    }

    public static getInstance(){
        if(this.instance == null){
            this.instance = new SceneEngine();
        }
        return this.instance;
    }

    start(){
        this.canvasController.setMaximize();
        this.recurrentUpdate();

        requestAnimationFrame((time: Number)=>this.render(time));
    }

    render(time: Number) {
        if(this.readyStatus == true){
            if(!Global.getInstance().fpsCap || this.willRender){
                if(!Global.getInstance().clearCap || this.clearTimeCounter.updateTimeByCurrentTimeMili(time.valueOf())){
                    this.ctx.clearRect(0,0,Global.getInstance().width, Global.getInstance().height);
                    this.ctxR.clearRect(0,0,Global.getInstance().width, Global.getInstance().height);
                }
                this.currentScene.processRender(this.ctxR, time);
                this.ctx.drawImage(this.renderCanvas, 0, 0, Global.getInstance().width, Global.getInstance().height);
                this.willRender = false;
            }
        }

        requestAnimationFrame((time: Number)=>this.render(time));
    }

    async recurrentUpdate(){
        this.previousTime = new Date().getTime();
        while(true){
            this.update();
            let currentTime = new Date().getTime();
            let delta = (currentTime- this.previousTime);

            let sleepTime = (this.frameTime) - delta;

            if(sleepTime > 0){
                await sleep(delta);
                this.fpsRealization = 1000/(delta+sleepTime);
            }else{
                this.fpsRealization = 1000/delta;
            }
            this.previousTime = currentTime;
            this.willRender = true;
        }
    }

    update(){
        this.currentScene.processUpdate();
        this.last_time = this.getTime();
    }

    makeWindowReactive(){
        this.canvasController.setReactiveListener(this.handleWindowListener);
        this.canvasController.makeWindowReactive();
    }

    handleWindowListener(width: number, height: number){
        Global.getInstance().width = width;
        Global.getInstance().height = height;
        window.location.reload();
    }

    updateScene(nextScene: Scene){
        this.readyStatus = false;
        this.currentScene = nextScene;
        this.currentScene.onCreated();
        this.readyStatus = true;
    }

    injectGameObject(gameObject: GameObject){
        if(this.currentScene != null){
            this.currentScene.addGameObject(gameObject);
        }
    }

    reorderZIndex(){
        if(this.currentScene != null){
            this.currentScene.reorderZIndex();
        }
    }

    hideCursor(){
        this.canvas.style.cursor = "none";
    }

    showCursor(){
        this.canvas.style.cursor = "default";
    }

    injectDestroyedGameObject(gameObject: GameObject){
        this.currentScene.destroyGameObject(gameObject);
    }

}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}