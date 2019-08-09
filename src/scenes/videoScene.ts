/**
 * @author       Cover group <info@cover3d.com>
 * @copyright    2019 Cover group
 * @license      MIT License
 */
import { StoryDynamicScene } from "../common/storyData";

export class VideoScene extends Phaser.Scene {
  private storyDynamicScene: StoryDynamicScene;
  private gameHeight: number;
  private gameWidth: number;
  constructor() {
    super({
      key: "VideoScene"
    });
  }

  preload(): void {
    this.load.image("logo-damien", require("../assets/logo_Action_damien.jpg"));
  }

  init(storyDynamicScene: StoryDynamicScene): void {
    this.storyDynamicScene = storyDynamicScene;
  }

  create(): void {
    this.scene.setVisible(false, "GameStateScene");
    var video = document.createElement("video");

    video.src = require("../assets/01.mp4");
    video.width = 960;
    video.height = 600;
    video.autoplay = true;

    var element = this.add.dom(65, 300, video);
    video.addEventListener("click", event => {
      console.log("video skip");
      this.skip();
    });
    video.addEventListener("ended", event => {
      console.log("video ended");
      this.skip();
    });

    console.log("created");
  }

  private skip() {
    console.log("skip");
    this.scene.stop();
    this.scene.start("DynamicScene", this.storyDynamicScene);
    this.scene.setVisible(true, "GameStateScene");
  }
  private posInPct(position: number, percentage: number): number {
    return (position / 100) * percentage;
  }
}
