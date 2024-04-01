import GameObject from '../character/GameObject';
import Activity from "./Activity";
import SceneEngine from "../engine/SceneEngine";
export default abstract class Scene{
    private gameObjects : GameObject[] = [];
    private toDeletes: GameObject[] = [];
    private _activities: Activity[];
    lapseTime = 0;
    previousTime = -1;
    fps = 60;
    frameTime = 1000/this.fps;

    constructor() {
        this._activities = [];
    }

    get activities(): Activity[] {
        return this._activities;
    }

    /**
     * Called before render and update start
     */
    abstract onCreated(): void;

    /**
     * Drawing logic
     */
    abstract onRender(ctx: CanvasRenderingContext2D): void;

    /**
     * Calculation and data change logic
     */
    abstract onUpdate(): void;

    addGameObject(gameObject: GameObject){
        this.gameObjects.push(gameObject);
        this.reorderZIndex();
    }

    reorderZIndex(){
        this.gameObjects.sort((a:GameObject,b:GameObject)=>{
            return a.zIndex -  b.zIndex;
        });
    }

    mouseContextMenu(e: MouseEvent){}

    mouseClick(e: MouseEvent){}

    mouseMove(e: MouseEvent){}

    mouseDown(e: MouseEvent){}

    mouseUp(e: MouseEvent){}

    keyDown(e: KeyboardEvent){}

    keyUp(e: KeyboardEvent){}

    processRender(ctx: CanvasRenderingContext2D, time: Number): void{
        let gameObjects = [...this.gameObjects];

        gameObjects.forEach(go => {
            if(go.isVisible){
                go.draw(ctx, time);
            }
        });
        this.onRender(ctx);
    }

    processUpdate(): void{
        let gameObjects = [...this.gameObjects];
        gameObjects.forEach(go => {
            go.update();
        });
        this.updateActivity(SceneEngine.getInstance().deltaTimeMilli())
        this.onUpdate();
        this.deleteTrash();
    }

    deleteTrash(): void{
        let destroyeds = [...this.toDeletes];

        for (const gameObject of destroyeds) {
            this.noticeDelete(gameObject);
        }

        while(destroyeds.length > 0){
            let curr = destroyeds.pop();
            let idx = this.gameObjects.indexOf(curr);
            if(idx >= 0){
                this.noticeDelete(curr);
                this.gameObjects.splice(this.gameObjects.indexOf(curr) , 1);
            }else{
                console.log("Object Not Found!")
            }

            this.toDeletes.splice(this.toDeletes.indexOf(curr), 1);
        }

    }

    noticeDelete(gameObject: GameObject){}

    destroyGameObject(gameObject: GameObject){
        gameObject.setDestroyed(true);
        this.toDeletes.push(gameObject);
    }

    updateActivity(timeInMilliSeconds: number): boolean {
        let finish_activities: Activity[] = [];

        for (let activity of this._activities) {
            if(activity.updateActivity(timeInMilliSeconds)){
                finish_activities.push(activity);
            }
        }

        for (let finishActivity of finish_activities) {
            this._activities.splice(this._activities.indexOf(finishActivity), 1);
        }

        return this._activities.length === 0;
    }

    addActivity(activity: Activity){
        this._activities.push(activity);
    }
}
