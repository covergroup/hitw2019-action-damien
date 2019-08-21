/**
 * @author       Cover group <info@cover3d.com>
 * @copyright    2019 Cover group
 * @license      MIT License
 */
import { PlayerData } from "../common/playerData";

export class YouLooseScene extends Phaser.Scene {
  private gameHeight: number;
  private gameWidth: number;
  private playerData: PlayerData;

  private looseText;
  private looseSound;

  constructor() {
    super({
      key: "YouLooseScene"
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
      "scene-bg-loose",
      require("../assets/game-youloose-background.jpg")
    );
    this.load.bitmapFont(
      "azoFire",
      require("../assets/azo-fire.png"),
      require("../assets/azo-fire.xml")
    );
    this.load.audio("loose", [require("../assets/albinoni.mp3")]);
  }

  init(): void {
    this.gameHeight = this.sys.canvas.height;
    this.gameWidth = this.sys.canvas.width;
    this.playerData = this.game.registry["Player"];
  }

  create(): void {
    let sprite = null;

    sprite = this.add.sprite(0, 0, `scene-bg-loose`);

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

    this.looseText = this.add.bitmapText(
      this.posInPct(this.gameWidth, 5),
      this.posInPct(this.gameHeight, 50),
      "azoFire",
      "",
      50
    );
    this.looseText.text = "Game Over... try again";
    this.looseSound = this.sound.add("loose");
    this.looseSound.play();
    setTimeout(() => {
      this.game.scene.start("IntroScene");
      this.game.scene.stop("YouLooseScene");
      let playerModifier = this.game.registry["PlayerModifier"];
      let playerData: PlayerData = this.game.registry["Player"];
      playerModifier.resetState(playerData);
      this.looseSound.stop();
    }, 15000);
  }
  public update() {}
  private posInPct(position: number, percentage: number): number {
    return (position / 100) * percentage;
  }
}
