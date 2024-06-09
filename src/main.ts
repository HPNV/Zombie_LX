import SceneEngine from "./module/engine/SceneEngine";
import Global from "./module/helper/Global";
import Scene1 from './view/scene1';

window.onload = () =>{
        function init() {
                let canvas: HTMLCanvasElement= document.getElementsByTagName("canvas")[0];
                let sceneEngine = SceneEngine.getInstance();
                sceneEngine.initCanvas(canvas);
                sceneEngine.makeWindowReactive();

                let assetManager = Global.getInstance().assetManager;
                
                assetManager.addImagePath("bullet","Player/Bullet.png");
                assetManager.addImagePath("Zombie","Enemy/Zombie.png");
                assetManager.addImagePath("Player","Player/Player.png");
                assetManager.addImagePath("gameover","Helper/Game Over.png");
                assetManager.addAudioPath("PlayMusic","PlayMusic.mp3");
                assetManager.addImagePath("Card","Helper/Card.png");
                assetManager.addImagePath("Start","Helper/Start.png");
                assetManager.addImagePath("Boss","Enemy/Boss.png");
                assetManager.addImagePath("YouWin","Helper/YouWin.png");
                assetManager.addImagePath("Bbullet","Enemy/BossBullet.png");

                for(let i = 1; i < 10; i++){
                        assetManager.addImagePath("tile"+i,"tiles/FieldsTile_0"+i+".png");
                }
        
                assetManager.addAssetDoneListener(() => {
                        console.log("asset done");
                        sceneEngine.updateScene(new Scene1());
                        sceneEngine.start();
                });
                
                assetManager.loadAssets();

        }
        init();

}