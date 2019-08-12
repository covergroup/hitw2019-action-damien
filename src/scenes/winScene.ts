/**
 * @author       Cover group <info@cover3d.com>
 * @copyright    2019 Cover group
 * @license      MIT License
 */
import { PlayerData } from "../common/playerData";

export class YouWinScene extends Phaser.Scene {
  private gameHeight: number;
  private gameWidth: number;
  private playerData: PlayerData;

  private winText;
  private winSound;

  constructor() {
    super({
      key: "YouWinScene"
    });
  }

  preload(): void {
    this.load.image("scene-bg-loose", require("../assets/Fin_Heureuse.jpg"));
    this.load.bitmapFont(
      "azoFire",
      require("../assets/azo-fire.png"),
      require("../assets/azo-fire.xml")
    );
    this.load.audio("win", [
      require("../assets/Fin_Heureuse.mp3"),
      require("../assets/Fin_Heureuse.mp3")
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

    this.winText = this.add.bitmapText(
      this.posInPct(this.gameWidth, 0.5),
      this.posInPct(this.gameHeight, 90),
      "azoFire",
      "",
      50
    );
    this.winText.text = "Vous avez vaincu la maladie";

    setTimeout(() => {}, 1000);
    this.winSound = this.sound.add("win");
    this.winSound.play();
    setTimeout(() => {
      this.game.scene.start("IntroScene");
      this.game.scene.stop("YouWinScene");
      this.winSound.stop();
    }, 146000);
  }
  public update() {}
  private posInPct(position: number, percentage: number): number {
    return (position / 100) * percentage;
  }
}
