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

                for(let i = 1; i < 10; i++){
                        assetManager.addPath("tile"+i,"tiles/FieldsTile_0"+i+".png");
                }
        
                assetManager.addAssetDoneListener(() => {
                        console.log("asset done");
                        sceneEngine.updateScene(new Scene1());
                        sceneEngine.start();
                });
                
                assetManager.loadAsset();

        }
        init();

}