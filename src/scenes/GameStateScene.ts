/**
 * @author       Cover group <info@cover3d.com>
 * @copyright    2019 Cover group
 * @license      MIT License
 */
import { PlayerData } from "../common/playerData";

export class GameStateScene extends Phaser.Scene {
  private gameHeight: number;
  private gameWidth: number;
  private playerData: PlayerData;

  private moneyBoardText;
  private healthBoardText;
  private timeBoardText;

  constructor() {
    super({
      key: "GameStateScene"
    });
  }

  preload(): void {
    this.load.image(
      "scene-bg-state",
      require("../assets/game-state-background.svg")
    );
    this.load.bitmapFont(
      "azoFire",
      require("../assets/azo-fire.png"),
      require("../assets/azo-fire.xml")
    );
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
      "scene-bg-state"
    );

    this.moneyBoardText = this.add.bitmapText(
      this.posInPct(this.gameWidth, 44),
      this.posInPct(this.gameHeight, -1),
      "azoFire",
      "",
      50
    );
    this.timeBoardText = this.add.bitmapText(
      this.posInPct(this.gameWidth, 75),
      this.posInPct(this.gameHeight, -1),
      "azoFire",
      "",
      50
    );

    var timer = this.time.addEvent({
      delay: 500, // ms
      callback: this.updateOneSec,
      callbackScope: this,
      loop: true
    });
  }

  public update() {
    //this.updateOneSec();
  }

  private updateOneSec() {
    let lifebar = this.add.graphics();
    let lifebarDecrease = this.add.graphics();

    lifebarDecrease.fillStyle(0xe91e63, 1);
    lifebar.fillStyle(0xffffff, 1);
    lifebar.fillRoundedRect(
      this.posInPct(this.gameWidth, 12),
      this.posInPct(this.gameHeight, 1),
      200,
      40,
      2
    );

    lifebarDecrease.fillRoundedRect(
      this.posInPct(this.gameWidth, 12),
      this.posInPct(this.gameHeight, 1),
      this.playerData.health * 2,
      40,
      2
    );
    this.timeBoardText.text = this.playerData.days;
    this.moneyBoardText.text = this.playerData.money;
  }

  private posInPct(position: number, percentage: number): number {
    return (position / 100) * percentage;
  }
}
