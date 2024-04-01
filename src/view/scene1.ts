import Scene from "../module/page/Scene";
import Map from '../model/Map';
import SceneEngine from "../module/engine/SceneEngine";
import Projectile from "../model/projectile";
import Enemy from '../model/Enemy';

export default class Scene1 extends Scene {
    canvas = SceneEngine.getInstance().getCanvasController()
    keys = new Set<string>();
    map = new Map(this.canvas);
    player =  this.map.player;
    enemies: Enemy[] = []
    playerBullet: Projectile[] = []
 
    onCreated(): void {
        this.addGameObject(this.player);
        this.map.initMap();
        this.map.tiles.forEach(tile => {
            this.addGameObject(tile);
        });
        this.addGameObject(this.player);
        setInterval(() => {
            this.spawnEnemy();
        }, 3000);
    }

    onRender(ctx: CanvasRenderingContext2D): void {
        
    }

    onUpdate(): void {
        let player = this.player;
        let newKeys = this.keys;
        let scene = this;
        let map = this.map;
        let deltaTime = SceneEngine.getInstance().deltaTimeMilli();

        player.setSpeed(deltaTime);        

        onkeydown = function(e) {
            newKeys.add(e.key);
        }
        onkeyup = function(e) {
            newKeys.delete(e.key);
        }
        player.move(newKeys);
        
        
        this.mouseClick = function(e) {
            let bullet  = player.attack(e.pageX, e.pageY);
            scene.addGameObject(bullet);
            scene.playerBullet.push(bullet);
        }
        map.update();
        this.checkCollision();
        this.moveEnemies();
    }

    checkCollision(){
        this.playerBullet.forEach(bullet => {
            if(bullet.x > this.canvas.getWidthCanvas() || bullet.x < 0 || bullet.y > this.canvas.getHeightCanvas() || bullet.y < 0){
                this.destroyGameObject(bullet);
                this.playerBullet.splice(this.playerBullet.indexOf(bullet), 1);
            }

            this.enemies.forEach(enemy => {
                if(bullet.isCollide(enemy)){
                    enemy.health -= bullet.damage;
                    this.destroyGameObject(bullet);
                    this.playerBullet.splice(this.playerBullet.indexOf(bullet), 1);
                    if(enemy.health <= 0){
                        this.destroyGameObject(enemy);
                        this.enemies.splice(this.enemies.indexOf(enemy), 1);
                    }
                }

                if(enemy.isCollide(this.player)){
                    this.player.health -= enemy.damage;
                }
            });
        });
    }

    spawnEnemy(){
        let player = this.player;
        let enemy = new Enemy(
            player.x + Math.random() * 1000 - 500,
            player.y + Math.random() * 1000 - 500,
            10
        );
        this.enemies.push(enemy);
        this.addGameObject(enemy);
    }

    moveEnemies(){
        this.enemies.forEach(enemy => {
            enemy.move(this.player.x, this.player.y);
            enemy.update();
        });
    }

}