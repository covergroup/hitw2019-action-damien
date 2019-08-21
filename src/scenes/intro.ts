/**
 * @author       Cover group <info@cover3d.com>
 * @copyright    2019 Cover group
 * @license      MIT License
 */

export class IntroScene extends Phaser.Scene {
  private gameHeight: number;
  private gameWidth: number;
  private sceneBackground: Phaser.GameObjects.Sprite;
  private actionDamienSprite: Phaser.GameObjects.Sprite;
  private hackInTheWoodSprite: Phaser.GameObjects.Sprite;
  private coverSprite: Phaser.GameObjects.Sprite;

  constructor() {
    super({
      key: "IntroScene"
    });
  }

  computeScaleX(width, itemWidth): number {
    return width / itemWidth;
  }

  computeScaleY(scaleX, height, itemHeight): number {
    return scaleX; //height/(itemHeight*scaleX);
  }

  preload(): void {
    this.load.image("scene-bg", require("/assets/intro-background.jpg"));
    this.load.image("logo-damien", require("/assets/logo_Action_damien.jpg"));
    this.load.image("logo-hack", require("/assets/logohack.jpg"));
    this.load.image("logo-cover", require("/assets/LogoCover.png"));
  }

  init(): void {
    this.gameHeight = this.sys.canvas.height;
    this.gameWidth = this.sys.canvas.width;
  }

  create(): void {
    let sprite = null;

    sprite = this.add.sprite(0, 0, `scene-bg`);

    let scaleX = this.computeScaleX(this.cameras.main.width, sprite.width);
    let scaleY = this.computeScaleY(
      scaleX,
      this.cameras.main.height / 2,
      sprite.height
    );
    console.log(`ScaleX : ${scaleX} ScaleY : ${scaleY}`);
    sprite.setScale(scaleX, scaleY);

    sprite.setPosition(
      this.cameras.main.width / 2,
      (sprite.height * scaleY) / 2
    );

    this.actionDamienSprite = this.add.sprite(
      this.gameWidth / 2,
      this.gameHeight / 2,
      "logo-damien"
    );
    this.hackInTheWoodSprite = this.add.sprite(
      this.gameWidth - this.gameWidth / 4,
      this.gameHeight * 2,
      "logo-hack"
    );
    this.coverSprite = this.add.sprite(
      this.gameWidth - this.gameWidth / 8,
      this.gameHeight * 2,
      "logo-cover"
    );

    let timeline = this.tweens.createTimeline({});

    timeline.add({
      targets: this.coverSprite,
      y: this.gameHeight - this.gameHeight / 6,
      ease: "Power1",
      duration: 1500
    });

    timeline.add({
      targets: this.hackInTheWoodSprite,
      y: this.gameHeight - this.gameHeight / 6,
      ease: "Power1",
      duration: 1500
    });

    timeline.play();

    this.actionDamienSprite.alpha = 0;
    this.add.tween({
      targets: [this.actionDamienSprite],
      ease: "Sine.easeInOut",
      duration: 2500,
      delay: 0,
      alpha: {
        getStart: () => 0,
        getEnd: () => 1
      },
      onComplete: () => {}
    });

    setTimeout(() => {
      this.game.scene.start("GameStateScene");
      this.scene.start("DynamicScene", {
        index: 0
      });
    }, 5000);
  }
}
5;
