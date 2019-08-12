/**
 * @author       Cover group <info@cover3d.com>
 * @copyright    2019 Cover group
 * @license      MIT License
 */

import {
  StoryData,
  StoryDynamicScene,
  StoryDataArray
} from "../common/storyData";

import { PlayerData, PlayerModifier } from "../common/playerData";

import { StoryCommon } from "../common/storyCommon";
import { SceneCommon } from "../common/sceneCommon";

export class DynamicScene extends Phaser.Scene implements SceneCommon {
  private storyDynamicScene: StoryDynamicScene;
  private storyData: StoryData;
  private useBitmapFont = false;
  private letterWidth;
  private maxLetters;
  private fontSize = 40;

  constructor() {
    super({
      key: "DynamicScene"
    });
  }

  computeScaleXToText(width, itemWidth): number {
    return width / itemWidth;
  }

  computeScaleYToText(scaleX, height, itemHeight): number {
    return height / itemHeight;
  }

  updateParchmentScaleAndPosition(text, parchmentSprite) {
    let scaleX = this.computeScaleXToText(
      text.width * 1.15,
      parchmentSprite.width
    );
    let scaleY = this.computeScaleYToText(
      scaleX,
      text.height,
      parchmentSprite.height
    );

    parchmentSprite.setScale(scaleX, scaleY);

    parchmentSprite.setPosition(
      text.x + (parchmentSprite.width * scaleX) / 2 - 30,
      text.y + (parchmentSprite.height * scaleY) / 2
    );
  }

  computeScaleX(width, itemWidth): number {
    return width / itemWidth;
  }

  computeScaleY(scaleX, height, itemHeight): number {
    return scaleX; //height/(itemHeight*scaleX);
  }

  addLineBreaks(text, maxLetters) {
    const split = text.split(/( )/g);
    let lines = [];

    function nextLine() {
      let newLine = "";
      while (`${newLine} ${split[0]}`.length <= maxLetters && split.length) {
        console.log(`${split[0]}`);
        console.log(`${newLine} ${split[0]}`.length);
        newLine += split.shift();
      }
      lines.push(newLine.trim());
      if (split.length) {
        nextLine();
      }
    }

    nextLine();

    return lines.join("\n");
  }

  init(storyDynamicScene: StoryDynamicScene): void {
    let storyDataArray: StoryDataArray = this.game.registry["storyDataArray"];

    console.log("storyDynamicScene.index ", storyDynamicScene.index);

    this.storyDynamicScene = storyDynamicScene;
    this.storyData = storyDataArray[this.storyDynamicScene.index];

    console.log("this.storyData ", this.storyData);
  }

  preload(): void {
    let storyDataArray: StoryDataArray = this.game.registry["storyDataArray"];

    if (this.useBitmapFont) {
      this.load.bitmapFont(
        "textFont",
        "https://labs.phaser.io/assets/fonts/bitmap/clarendon.png",
        "https://labs.phaser.io/assets/fonts/bitmap/clarendon.xml"
      );
    }

    // this.load.image(`bus`, require("../assets/bus.svg"));
    //this.load.image(`medicalCenter`,crequire("../assets/CentreMedical_Cartoon.jpg"));
    // this.load.image(`fermier`, require("../assets/Fermier.svg"));
    // this.load.image(`guerrisseur`, require("../assets/Guerrisseur.png"));
    // this.load.image(`herbs`, require("../assets/herbs.svg"));
    // this.load.image(`hospital`, require("../assets/hospital.svg"));
    // this.load.image(`mask`, require("../assets/Mask.svg"));
    // this.load.image(`pill`, require("../assets/pill.svg"));
    // this.load.image(`stethoscope`, require("../assets/stethoscope.svg"));
    // this.load.image(`medecin`, require("../assets/Medecin.png"));
    // this.load.image(`village`, require("../assets/Village_Africain2.jpg"));
    // this.load.image(`walk`, require("../assets/walk.svg"));
    this.load.image(`parchment`, require("../assets/parchment.png"));

    if (this.storyData.image) {
      this.load.image(`mainImage`, `${this.storyData.image}`);
    }

    if (this.storyData.children) {
      let indexAccess = 0;

      this.storyData.children.forEach(indexChildStoryData => {
        let childStoryData = storyDataArray[indexChildStoryData];

        if (childStoryData.accessImage) {
          console.log(`Debug load image : ${childStoryData.accessImage}`);
          console.log(`Debug load image name : accessImage${indexAccess}`);
          this.load.image(
            `accessImage${indexAccess}`,
            `${childStoryData.accessImage}`
          );
        }
        indexAccess++;
      });
    }
  }

  create(): void {
    let storyDataArray: StoryDataArray = this.game.registry["storyDataArray"];

    if (this.useBitmapFont) {
      const testText = this.add.bitmapText(
        20,
        20,
        "textFont",
        "A",
        this.fontSize
      );
      //testText.setLetterSpacing(20);

      this.letterWidth = testText.getTextBounds().global.width; // divide by two because two letters were added to the test text
      console.log(`this.cameras.main.width ${this.cameras.main.width}`);
      console.log(`this.letterWidth ${this.letterWidth}`);
      this.maxLetters = Math.floor(this.cameras.main.width / this.letterWidth);
      console.log(`this.maxLetters ${this.maxLetters}`);
    }

    if (this.storyData.image) {
      let sprite = null;

      sprite = this.add.sprite(0, 0, `mainImage`);

      let scaleX = this.computeScaleX(this.cameras.main.width, sprite.width);
      let scaleY = this.computeScaleY(
        scaleX,
        this.cameras.main.height / 2,
        sprite.height
      );

      sprite.setScale(scaleX, scaleY);

      sprite.setPosition(
        this.cameras.main.width / 2,
        (sprite.height * scaleY) / 2
      );
    }

    if (this.storyData.text) {
      if (this.useBitmapFont) {
        this.add.bitmapText(
          40,
          this.cameras.main.height / 10,
          "textFont",
          this.addLineBreaks(this.storyData.text, this.maxLetters),
          this.fontSize
        );
      } else {
        let areaDivider = 5;
        let dxText = this.cameras.main.width / areaDivider;

        let parchmentSprite = this.add.sprite(
          dxText,
          this.cameras.main.height / 4,
          `parchment`
        );

        let textMain = this.add
          .text(
            dxText,
            this.cameras.main.height / 4,
            this.storyData.text,
            StoryCommon.storyTextWrapProperties(dxText * (areaDivider - 2))
          )
          .setInteractive();

        this.updateParchmentScaleAndPosition(textMain, parchmentSprite);
      }
    }

    if (this.storyData.children) {
      let indexAccess = 0;
      let position = 0;
      let widthAccess =
        this.cameras.main.width / this.storyData.children.length;
      let dyFromBottom = this.cameras.main.height;

      this.storyData.children.forEach(indexChildStoryData => {
        let childStoryData = storyDataArray[indexChildStoryData];

        let parchmentSprite = this.add.sprite(0, 0, `parchment`);

        let nextButton;
        if (this.useBitmapFont) {
          nextButton = this.add
            .bitmapText(
              0,
              0,
              "textFont",
              this.addLineBreaks(
                childStoryData.accessQuestion,
                this.maxLetters
              ),
              this.fontSize
            )
            .setInteractive();
        } else {
          nextButton = this.add
            .text(
              0,
              0,
              childStoryData.accessQuestion,
              StoryCommon.storyTextWrapProperties(widthAccess)
            )
            .setInteractive();
        }

        let dyFromBottomText = dyFromBottom - nextButton.height;
        nextButton.setPosition(
          position + widthAccess / 2 - nextButton.width / 2,
          dyFromBottomText
        );
        this.implementNextStory(this, nextButton, indexChildStoryData);

        this.updateParchmentScaleAndPosition(nextButton, parchmentSprite);

        if (childStoryData.accessImage) {
          let sprite = this.add
            .sprite(0, 0, `accessImage${indexAccess}`)
            .setInteractive();
          let scaleX = this.computeScaleX(
            this.cameras.main.width / 7,
            sprite.width
          );
          let scaleY = this.computeScaleY(
            scaleX,
            this.cameras.main.height / 5,
            sprite.height
          );

          sprite.setScale(scaleX, scaleY);

          sprite.setPosition(
            position + widthAccess / 2,
            dyFromBottomText - (sprite.height * scaleY) / 2
          );

          this.implementNextStory(this, sprite, indexChildStoryData);
        }

        indexAccess++;
        position += widthAccess;
      });
    }
  }

  implementNextStory(
    currentScene: DynamicScene,
    object,
    indexAccess: number
  ): void {
    object.on("pointerdown", function(event) {
      let storyDataArray: StoryDataArray =
        currentScene.game.registry["storyDataArray"];
      currentScene.textures.remove(`mainImage`);

      let indexAccessToRemove = 0;

      currentScene.storyData.children.forEach(indexChildStoryData => {
        let childStoryData = storyDataArray[indexChildStoryData];

        if (childStoryData.accessImage) {
          currentScene.textures.remove(`accessImage${indexAccessToRemove}`);
        }
        indexAccessToRemove++;
      });

      currentScene.scene.stop();

      StoryCommon.storyNext(currentScene, indexAccess);
    });
  }

  stopAnimations() {
    this.scene.stop();
  }
}
