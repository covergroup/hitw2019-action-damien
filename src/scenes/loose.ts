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
    this.load.audio("loose", [
      require("../assets/albinoni.wav"),
      require("../assets/albinoni.wav")
    ]);
  }

  init(): void {
    this.gameHeight = this.sys.canvas.height;
    this.gameWidth = this.sys.canvas.width;
    this.playerData = this.game.registry["Player"];
  }

  create(): void {
    this.add.sprite(
      this.posInPct(this.gameWidth, 50),
      this.posInPct(this.gameHeight, 50),
      "scene-bg-loose"
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
