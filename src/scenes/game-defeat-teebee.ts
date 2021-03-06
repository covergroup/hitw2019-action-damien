import { PlayerModifier, PlayerData } from "../common/playerData";
import { StoryDynamicScene } from "../common/storyData";
import { StoryCommon } from "../common/storyCommon";
import { SceneCommon } from "../common/sceneCommon";

/**
 * @author       Cover group <info@cover3d.com>
 * @copyright    2019 Cover group
 * @license      MIT License
 */

export class DefeatTeebeeScene extends Phaser.Scene implements SceneCommon {
  private storyDynamicScene: StoryDynamicScene;
  private gameHeight: number;
  private gameWidth: number;
  private sceneBackground: Phaser.GameObjects.Sprite;
  private lifeBackground: Phaser.GameObjects.Sprite;
  private enemiesLocations = [
    //Right
    [65, 70],
    [45, 88],
    [78, 85],
    [40, 110],
    [75, 105],
    [65, 125],
    //Left
    [155, 70],
    [140, 88],
    [175, 85],
    [145, 110],
    [175, 105],
    [165, 125]
  ];
  private enemies = [];
  private enemyKilled = true;
  private currentEnemy = -1;

  private enemyDelayStart = 2000;
  private enemyDelayFactor = 0.95;
  private enemyDelay = 0;
  private enemyDelayMin = 500;
  private playerData: PlayerData;
  private playerModifier: PlayerModifier;
  private dificulty = 2;
  private objective = 100;
  private shootSound;
  private ambianceSound;

  constructor() {
    super({
      key: "DefeatTeeBeeScene"
    });
  }

  computeScaleX(width, itemWidth): number {
    return width / itemWidth;
  }

  computeScaleY(scaleX, height, itemHeight): number {
    return scaleX; //height/(itemHeight*scaleX);
  }

  preload(): void {
    this.load.image(
      "scene-bg-defeat",
      require("../assets/game-defeat-teebee-background.jpg")
    );
    this.load.image("bacteria", require("../assets/bacteria.png"));
    this.load.audio("shoot", [require("../assets/shoot.mp3")]);
    this.load.audio("ambiance-sound-ktb", [
      require("../assets/KTB_Backsound.mp3")
    ]);
  }

  init(storyDynamicScene: StoryDynamicScene): void {
    this.storyDynamicScene = storyDynamicScene;
    this.gameHeight = this.sys.canvas.height;
    this.gameWidth = this.sys.canvas.width;
    this.playerData = this.game.registry["Player"];
    this.playerModifier = this.game.registry["PlayerModifier"];
  }

  create(): void {
    let sprite = null;

    sprite = this.add.sprite(0, 0, `scene-bg-defeat`);

    let scaleX = this.computeScaleX(this.cameras.main.width, sprite.width);
    let scaleY = this.computeScaleY(
      (scaleX / 3) * 2.2,
      this.cameras.main.height / 2,
      sprite.height
    );

    sprite.setScale(scaleX, scaleY);
    console.log(`ScaleX : ${scaleX} ScaleY : ${scaleY}`);
    sprite.setPosition(
      this.cameras.main.width / 2,
      (sprite.height * scaleY) / 2
    );

    this.shootSound = this.sound.add("shoot");
    this.ambianceSound = this.sound.add("ambiance-sound-ktb");
    this.ambianceSound.play();
    this.createEnemies();
    this.newGame();
  }

  private newGame() {
    this.updateState();
    this.enemyDelay = this.enemyDelayStart;
    this.time.addEvent({
      delay: this.enemyDelay,
      callback: this.showEnemy,
      callbackScope: this,
      loop: true
    });
  }

  private updateState() {}

  private createEnemies() {
    for (let i = 0; i < this.enemiesLocations.length; i++) {
      let enemy = this.add.sprite(
        (this.gameWidth / 100) * 50,
        this.gameHeight / 2,
        "bacteria"
      );
      enemy
        .setInteractive()
        .on("pointerdown", (pointer, localX, localY, event) => {
          this.clickTarget(enemy);
        });

      enemy.x = enemy.originX = this.enemiesLocations[i][0] * 4;
      enemy.y = enemy.originY = this.enemiesLocations[i][1] * 4;
      enemy.alpha = 0;
      enemy.name = "" + i;
      this.enemies.push(enemy);
    }
  }
  private showEnemy() {
    console.log("Show enemy!");

    this.enemyKilled = false;

    // Randomize new enemy.
    this.currentEnemy = Math.floor(Math.random() * this.enemies.length);

    // Show it.
    this.add.tween({
      targets: [this.enemies[this.currentEnemy]],
      ease: "Sine.easeInOut",
      duration:
        Math.floor((Math.random() * 1500) / this.dificulty) +
        1000 / this.dificulty,
      delay: 0,
      alpha: {
        getStart: () => 0,
        getEnd: () => 1
      },
      onComplete: () => {
        // Player didn't hit the enemy. Reduce one life.
        if (!this.enemyKilled) {
          if (
            this.playerModifier.updateHealth(
              this,
              this.playerData,
              -1 * 3 * this.dificulty
            )
          ) {
            console.log("MISS! Lifes left: " + this.playerData.health);
            // Refresh life & score.
            this.updateState();
            if (this.playerData.health > 0) {
              // Show new enemy after delay.
            }
          }
        }
      }
    });

    // Hide after a while.
    this.time.addEvent({
      delay: this.enemyDelay,
      callback: this.hideEnemy,
      callbackScope: this,
      repeat: 1
      //loop: true
    });

    // Shorten time.
    if (this.enemyDelay > this.enemyDelayMin) {
      this.enemyDelay *= this.enemyDelayFactor;
    }
  }
  private hideEnemy() {
    for (var i in this.enemies) {
      this.enemies[i].alpha = 0;
    }
  }
  private clickTarget(enemy) {
    console.log("click on target");
    // Don't allow double kills.
    if (!this.enemyKilled) {
      console.log("You hit enemy: " + enemy.name);
      this.shootSound.play();
      // Mark enemy as killed.
      this.enemyKilled = true;

      // Increase health.
      enemy.visible = false;
      if (
        this.playerModifier.updateHealth(
          this,
          this.playerData,
          +5 * this.dificulty
        )
      ) {
        if (this.playerData.health >= this.objective) {
          this.success();
        } else {
          console.log("Your lifes: " + this.playerData.health);
          //enemy.visible = false;
          // Hide enemy.
          this.add.tween({
            targets: [enemy],
            duration: 100,
            delay: 0,
            alpha: 0,
            onComplete: () => {
              enemy.visible = true;
            }
          });
          // Refresh life & score.
          this.updateState();
        }
      }
    }
  }

  private success() {
    console.log("success");
    this.scene.stop();
    StoryCommon.storyNext(this, this.storyDynamicScene.index);
  }

  private posInPct(position: number, percentage: number): number {
    return (position / 100) * percentage;
  }

  stopAnimations() {
    this.ambianceSound.stop();
    this.scene.stop();
  }
}
