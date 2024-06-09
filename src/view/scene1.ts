import Scene from "../module/page/Scene";
import Map from '../model/Map';
import SceneEngine from "../module/engine/SceneEngine";
import Projectile from "../model/projectile";
import Enemy from '../model/Enemy';
import Exp from '../model/Experience';
import ProgressBar from '../component/prrogressBar';
import ImageRender from '../model/Image';
import AudioRender from '../model/Audio';
import Global from "../module/helper/Global";
import TextRender from "../model/Text";
import SkillCard from "../component/SkillCard";

export default class Scene1 extends Scene {
    canvas = SceneEngine.getInstance().getCanvasController();
    keys = new Set<string>();
    map = new Map(this.canvas);
    player = this.map.player;
    enemies: Enemy[] = [];
    playerBullet: Projectile[] = [];
    exp: Exp[] = [];
    live: number = 3;
    boss:Enemy = new Enemy(this.map.getLeft(),this.map.getBottom() / 2,30,400,"Boss");
    expBar: ProgressBar = new ProgressBar(32, this.map.getTop() + 64, 0, 'blue', 100, 25);
    liveBar: ProgressBar = new ProgressBar(32, this.map.getTop() + 32, 0, 'green', 100, 25);
    lvlText: TextRender = new TextRender(150, this.map.getTop() + 64, `${Math.floor(this.player.level)}`, 25, 25);
    startIamge: ImageRender = new ImageRender(this.map.getRight() / 5 - 50, this.map.getBottom() / 5 - 50, "Start");
    winIamge: ImageRender = new ImageRender(this.map.getRight() / 5 - 50, this.map.getBottom() / 5 - 50, "YouWin");

    lvlCounter: number = this.player.level + 1;
    pause: boolean = false;
    curretTime: number = 0;
    checkSpawn: number = 0;
    checkReload: number = 0;
    checkDifficulty: number = 0;
    gameOverImage: ImageBitmap | null = null;
    youWinImage: ImageBitmap | null = null;
    gameMusic: AudioRender = new AudioRender("PlayMusic");
    skillCardList: SkillCard[] = [];
    musicPlayed: boolean = false;
    hasStarted: boolean = false;
    bossTime: boolean = false;
    spawnRate: number = 3000;
    timerText: TextRender = new TextRender(this.map.getRight() / 2 - 50, this.map.getTop() + 32, `3:00`, 100, 25);
    timer: number = 3;
    second: number = 1;
    timerTime: number = 0;
    imuneTime: number = 1000;
    bossShoot: number = 0;
    win: boolean = false;
    bossBullet: Projectile[] = [];

    onCreated(): void {
        this.addGameObject(this.player);
        this.map.initMap();
        this.map.tiles.forEach(tile => {
            this.addGameObject(tile);
            
        });

        this.boss.width = this.boss.image.width - 200;
        this.boss.height = this.boss.image.height - 200;

        this.addGameObject(this.player);
        this.addGameObject(this.expBar);
        this.addGameObject(this.liveBar);
        this.addGameObject(this.lvlText);
        this.addGameObject(this.gameMusic);
        this.addGameObject(this.startIamge);
        this.addGameObject(this.timerText);

        this.liveBar.height = 25;
        this.expBar.height = 25;
        this.liveBar.width = this.player.health * 2;
        this.expBar.width = 100;

        this.gameOverImage = Global.getInstance().assetManager.loadedImage["gameover"];
        this.youWinImage = Global.getInstance().assetManager.loadedImage["YouWin"];
    }

    onRender(ctx: CanvasRenderingContext2D): void {
        if (this.pause && this.player.health <= 0) {
            if (this.gameOverImage) {
                ctx.drawImage(this.gameOverImage, this.canvas.getWidthCanvas() / 2 - this.gameOverImage.width / 2, this.canvas.getHeightCanvas() / 2 - this.gameOverImage.height / 2);
            }
        }

        if(this.pause && this.win){
            if (this.youWinImage) {
                ctx.drawImage(this.youWinImage, this.canvas.getWidthCanvas() / 2 - this.gameOverImage.width / 2, this.canvas.getHeightCanvas() / 2 - this.gameOverImage.height / 2);
            }        
        }
    }

    onUpdate(): void {
        let player = this.player;
        let newKeys = this.keys;
        let scene = this;
        let map = this.map;
        let deltaTime = SceneEngine.getInstance().deltaTimeMilli();
        this.curretTime = this.curretTime + deltaTime;
        let bossCounter = 0;

        this.liveBar.value = this.player.health * 2;
        this.expBar.value = this.player.exp;
        this.lvlText.text = `${Math.floor(this.player.level)}`;

        if(!this.hasStarted){
            this.pause = true;
            this.mouseClick = (e) => {
                console.log(e.pageX, e.pageY);
                console.log(this.startIamge.x, this.startIamge.y);
                if (this.startIamge.clicked(e.pageX, e.pageY)) {
                    
                    this.hasStarted = true;
                    this.destroyGameObject(this.startIamge);
                    this.gameMusic.play();
                    this.pause = false;
                }
            }
        }



        if (this.player.health <= 0 && !this.pause) {
            player.health = 0;
            this.pause = true;

        }

        if (this.player.level >= this.lvlCounter && !this.pause) {
            let tempSkillList = ["speed", "attack", "health", "exp", "ammo", "reload"];
            this.lvlCounter += 1;
            for (let i = 0; i < 3; i++) {
                const randomIndex = Math.floor(Math.random() * tempSkillList.length);
                let skill = new SkillCard((this.map.getRight() / 5) + ((i * 300)) , this.map.getBottom() / 5, tempSkillList[randomIndex]);
                tempSkillList.splice(randomIndex, 1);
                this.skillCardList.push(skill);
            }

            this.skillCardList.forEach(card => {
                this.addGameObject(card);
            });

            this.mouseClick = (e) => {
                console.log(e.pageX, e.pageY);
                this.skillCardList.forEach(card => {
                    if (card.clicked(e.pageX, e.pageY)) {
                        switch (card.text) {
                            case "speed":
                                this.player.baseSpeed += 0.1;
                                break;
                            case "attack":
                                this.player.damage += 3;
                                break;
                            case "health":
                                this.player.health += 10;
                                this.liveBar.width = this.liveBar.width + 20;
                                break;
                            case "exp":
                                this.player.exp += 10;
                                break;
                            case "ammo":
                                this.player.bulletCount += 1;
                                break;
                            case "reload":
                                this.player.reloadTime -= 500;
                                break;
                        }
                        this.skillCardList.forEach(card => {
                            this.destroyGameObject(card);
                        });
                        this.skillCardList = [];
                        this.pause = false;
                    }
                });
            }
            this.pause = true;
        }

        if (this.pause) {
            return;
        }

        if (this.player.bulletCount == 0) {
            this.disableShoot();
            if ((this.curretTime - this.checkReload) >= this.player.reloadTime) {
                this.player.bulletCount = 10;
                this.checkReload = this.curretTime;
            }
        } else {
            if(this.player.bulletCount > 0) {
                this.mouseClick = function (e) {
                    let bullet = player.attack(e.pageX, e.pageY);
                    scene.addGameObject(bullet);
                    scene.playerBullet.push(bullet);
                    player.bulletCount -= 1;
                }
            }
        }

        player.setSpeed(deltaTime);

        onkeydown = function (e) {
            newKeys.add(e.key);
        }
        onkeyup = function (e) {
            newKeys.delete(e.key);
        }
        player.move(newKeys);

        map.update();
        player.update();
        this.checkCollision();
        this.bossCollide();
        this.moveEnemies();

        if(this.bossTime == true) {
            if(bossCounter == 0){
                this.addGameObject(this.boss);
                bossCounter = 1;
            }

            if(this.curretTime - this.bossShoot >= 3000){
                let bullet = this.boss.attack(player.x, player.y);
                this.bossBullet.push(bullet);
                this.addGameObject(bullet);
                this.bossShoot = this.curretTime;
            }

            this.boss.move(player.x, player.y);
            this.boss.update();
            return;
        }

        this.timerTime += deltaTime;
        this.timerText.text = `${Math.floor(this.timer)}:${Math.floor(this.second - (this.timerTime / 1000))}`;

        if(this.timer <= 0 && (this.second - (this.timerTime / 1000) <= 0)){
            this.bossTime = true;
            return;
        }

        if(this.second - (this.timerTime / 1000) <= 0) {
            this.timer -= 1;
            this.timerTime = 0;
            this.second = 60;
        }

        if(this.curretTime - this.checkDifficulty >= 1000 && this.spawnRate > 1000){
            this.spawnRate -= 250;
            this.checkDifficulty = this.curretTime;
        }

        if ((this.curretTime - this.checkSpawn) >= this.spawnRate) {
            this.spawnEnemy();
            this.checkSpawn = this.curretTime;
        }
    }

    checkCollision() {
        this.bulletCollide();
        this.enemyCollide();
        this.playerCollide();
    }

    bossCollide() {
        this.playerBullet.forEach(bullet => {
            if (this.boss.isCollide(bullet) && this.bossTime) {
                this.boss.health -= bullet.damage;
                this.destroyGameObject(bullet);
                this.playerBullet.splice(this.playerBullet.indexOf(bullet), 1);
                if (this.boss.health <= 0) {
                    this.destroyGameObject(this.boss);
                    this.enemies.splice(this.enemies.indexOf(this.boss), 1);
                    this.spawnExp(this.boss.x, this.boss.y, 10, 15);
                    this.bossTime = false;
                    this.win = true;
                    this.pause = true;
                }
            }
        });

        this.bossBullet.forEach(bullet => {
            if (bullet.x > this.canvas.getWidthCanvas() || bullet.x < 0 || bullet.y > this.canvas.getHeightCanvas() || bullet.y < 0) {
                this.destroyGameObject(bullet);
                this.bossBullet.splice(this.bossBullet.indexOf(bullet), 1);
            }

            if (bullet.isCollide(this.player) && this.bossTime) {
                this.player.health -= bullet.damage;
                this.destroyGameObject(bullet);
                this.bossBullet.splice(this.bossBullet.indexOf(bullet), 1);
            }
        });

        this.imuneTime += SceneEngine.getInstance().deltaTimeMilli();

        if(this.boss.isCollide(this.player) && this.imuneTime >= 1000 && this.boss.health > 0 && this.bossTime){
            this.player.health -= this.boss.damage;
            this.imuneTime = 0;
        }
    }

    bulletCollide() {
        this.playerBullet.forEach(bullet => {
            if (bullet.x > this.canvas.getWidthCanvas() || bullet.x < 0 || bullet.y > this.canvas.getHeightCanvas() || bullet.y < 0) {
                this.destroyGameObject(bullet);
                this.playerBullet.splice(this.playerBullet.indexOf(bullet), 1);
            }
        });
    }

    enemyCollide() {
        this.enemies.forEach(enemy => {
            this.playerBullet.forEach(bullet => {
                if (enemy.isCollide(bullet)) {
                    enemy.health -= bullet.damage;
                    this.destroyGameObject(bullet);
                    this.playerBullet.splice(this.playerBullet.indexOf(bullet), 1);
                    if (enemy.health <= 0) {
                        this.destroyGameObject(enemy);
                        this.enemies.splice(this.enemies.indexOf(enemy), 1);
                        this.spawnExp(enemy.x, enemy.y, 10, 15);
                    }
                }
            });
        });
    }

    playerCollide() {
        this.enemies.forEach(enemy => {
            if (enemy.isCollide(this.player)) {
                this.player.health -= enemy.damage;
                this.destroyGameObject(enemy);
                this.enemies.splice(this.enemies.indexOf(enemy), 1);
            }
        });

        this.exp.forEach(exp => {
            if (exp.isCollide(this.player)) {
                this.player.exp = this.player.exp + exp.value;
                this.destroyGameObject(exp);
                this.exp.splice(this.exp.indexOf(exp), 1);
            }
        });
    }

    spawnEnemy() {
        let player = this.player;
        let minDistance = 600;
        let x, y;
        
        do {
            x = player.x + Math.random() * 1000 - 500;
            y = player.y + Math.random() * 1000 - 500;
        } while (this.calculateDistance(player.x, player.y, x, y) < minDistance);
    
        let enemy = new Enemy(x, y, 10, 20, "Zombie");
        this.enemies.push(enemy);
        this.addGameObject(enemy);
    }
    
    calculateDistance(x1:number, y1:number, x2:number, y2:number) {
        let dx = x2 - x1;
        let dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }

    spawnExp(x: number, y: number, minVal: number, maxVal: number) {
        let exp = new Exp(x, y, minVal, maxVal);
        this.addGameObject(exp);
        this.exp.push(exp);
    }

    moveEnemies() {
        this.enemies.forEach(enemy => {
            enemy.move(this.player.x, this.player.y);
            enemy.update();
        });
    }

    disableShoot() {
        this.mouseClick = () => {
        }
    }
}











