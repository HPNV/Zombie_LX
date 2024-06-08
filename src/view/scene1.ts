import Scene from "../module/page/Scene";
import Map from '../model/Map';
import SceneEngine from "../module/engine/SceneEngine";
import Projectile from "../model/projectile";
import Enemy from '../model/Enemy';
import Exp from '../model/Experience';
import Live from '../component/Live';
import Bar from '../component/exp_bar';
import ProgressBar from '../component/prrogressBar';
import SkillCard from '../component/skil_card';
import Player from '../model/Player';

export default class Scene1 extends Scene {
    canvas = SceneEngine.getInstance().getCanvasController()
    keys = new Set<string>();
    map = new Map(this.canvas);
    player =  this.map.player;
    enemies: Enemy[] = []
    playerBullet: Projectile[] = []
    exp: Exp[] = []
    live: number = 3
    expBar:  ProgressBar = new ProgressBar(32, this.map.getTop() + 64, 0, 'blue', 100, 25);
    liveBar: ProgressBar = new ProgressBar(32, this.map.getTop() + 32, 0, 'green', 100, 25);
    skillCard: SkillCard = new SkillCard(150, this.map.getTop() + 64, `${Math.floor(this.player.level)}`, 25, 25);
    helper: Live[]
    lvlCounter: number = this.player.level + 1;
    pause: boolean = false;
    curretTime: number = 0;
    checkSpawn: number = 0;
    checkReload: number = 0;
 
    onCreated(): void {
        this.addGameObject(this.player);
        this.map.initMap();
        this.map.tiles.forEach(tile => {
            this.addGameObject(tile);
        });

        this.addGameObject(this.player);
        this.addGameObject(this.expBar);
        this.addGameObject(this.liveBar);
        this.addGameObject(this.skillCard);

        this.liveBar.height = 25;
        this.expBar.height = 25;
        this.liveBar.width = this.player.health * 2;
        this.expBar.width = 100;
    }

    onRender(ctx: CanvasRenderingContext2D): void {
        
    }

    onUpdate(): void {
        let player = this.player;
        let newKeys = this.keys;
        let scene = this;
        let map = this.map;
        let deltaTime = SceneEngine.getInstance().deltaTimeMilli();
        this.curretTime = this.curretTime + deltaTime;

        if(this.pause){
            this.disableShoot();
            return
        }

        if(this.player.bulletCount == 0){
            this.disableShoot();
            if((this.curretTime - this.checkReload) >= this.player.reloadTime){
                this.player.bulletCount = 5;
                this.checkReload = this.curretTime;
            }
        }  else {
            this.mouseClick = function(e) {
                let bullet  = player.attack(e.pageX, e.pageY);
                scene.addGameObject(bullet);
                scene.playerBullet.push(bullet);
                player.bulletCount -= 1;
            }
        }

        if(this.player.level >= this.lvlCounter){
            this.pause = true;
        }

        this.liveBar.value = this.player.health * 2;
        this.expBar.value = this.player.exp;
        this.skillCard.text = `${Math.floor(this.player.level)}`;

        if((this.curretTime - this.checkSpawn) >= 3000){
            this.spawnEnemy();
            this.checkSpawn = this.curretTime;
        }
    
        player.setSpeed(deltaTime);        

        onkeydown = function(e) {
            newKeys.add(e.key);
        }
        onkeyup = function(e) {
            newKeys.delete(e.key);
        }
        player.move(newKeys);
        
        map.update();
        player.update();
        this.checkCollision();
        this.moveEnemies();
    }

    checkCollision(){
        this.bulletCollide();
        this.enemyCollide();
        this.playerCollide();
    }

    bulletCollide(){
        this.playerBullet.forEach(bullet => {
            if(bullet.x > this.canvas.getWidthCanvas() || bullet.x < 0 || bullet.y > this.canvas.getHeightCanvas() || bullet.y < 0){
                this.destroyGameObject(bullet);
                this.playerBullet.splice(this.playerBullet.indexOf(bullet), 1);
            }
        });
    }

    enemyCollide(){
        this.enemies.forEach(enemy => {
            this.playerBullet.forEach(bullet => {
                if(enemy.isCollide(bullet)){
                    enemy.health -= bullet.damage;
                    this.destroyGameObject(bullet);
                    this.playerBullet.splice(this.playerBullet.indexOf(bullet), 1);
                    if(enemy.health <= 0){
                        this.destroyGameObject(enemy);
                        this.enemies.splice(this.enemies.indexOf(enemy), 1);
                        this.spawnExp(enemy.x, enemy.y, 10, 15);
                    }
                }
            });
        });
    }

    playerCollide(){
        this.enemies.forEach(enemy => {
            if(enemy.isCollide(this.player)){
                this.player.health -= enemy.damage;
                this.destroyGameObject(enemy);
                this.enemies.splice(this.enemies.indexOf(enemy), 1);
            } 
        });

        this.exp.forEach(exp => {
            if(exp.isCollide(this.player)){
                this.player.exp = this.player.exp + exp.value;
                this.destroyGameObject(exp);
                this.exp.splice(this.exp.indexOf(exp), 1);
            }
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

    spawnExp(x: number, y: number, minVal: number, maxVal: number){
        let exp = new Exp(x, y, minVal, maxVal);
        this.addGameObject(exp);
        this.exp.push(exp);
    }

    moveEnemies(){
        this.enemies.forEach(enemy => {
            enemy.move(this.player.x, this.player.y);
            enemy.update();
        });
    }

    disableShoot(){
        this.mouseClick = () => {
        }
    }
}












