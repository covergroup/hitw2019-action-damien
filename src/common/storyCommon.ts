import { stringify } from "querystring";
import { StoryData, StoryDataArray } from "./storyData";
import { PlayerData } from "./playerData";

export module StoryCommon {
  export function storyTextWrapProperties(width: number): object {
    return {
      //backgroundColor: '#efefef',
      //font: 'Times New Roman',
      fontFamily: 'Verdana, "Times New Roman"',
      //font: 'Open Sans',
      fontSize: 30,
      weight: 400,
      //font: "Bold 30px Arial",
      //stroke: '#000000',
      //fontSize: 25,
      //strokeThickness: 3,
      //fontWeight: 'bold',
      fill: "#000", //'#1328ab', //'#FFF',
      //backgroundColor: "#fff",
      wordWrap: {
        width: width
      },
      backgroundImage: `accessImage1`
    };
  }

  export function storyNext(currentScene: Phaser.Scene, indexAccess: number) {
    let storyDataArray: StoryDataArray = currentScene.game.registry["storyDataArray"];
    let storyData = storyDataArray[indexAccess]
    
    if (storyData.sceneKey) {
      currentScene.scene.start(
        storyData.sceneKey,
        {
          index: storyData.children?storyData.children[0]:0
        }
      );
    } else {
      if (this.updatePlayerDataFromStoryData(currentScene, storyData)) {
        if (storyData.image || storyData.text) {

          currentScene.scene.start(
            'DynamicScene',
            {
              index: indexAccess
            }
          );  
        } else {
          let storyDataChild = storyDataArray[storyData.children[0]]

          if (this.updatePlayerDataFromStoryData(currentScene, storyDataChild)) {
            currentScene.scene.start(
              'DynamicScene',
              {
                index: storyData.children[0]
              }
            );
          }
        }
      }
    }
  }

  export function updatePlayerDataFromStoryData(currentScene: Phaser.Scene, storyDataUpdater: StoryData): Boolean {
    let alive = true;
    let playerData: PlayerData = currentScene.game.registry["Player"];
    
    let playerModifier = currentScene.game.registry["PlayerModifier"];

    if (storyDataUpdater.health) {
        alive = playerModifier.updateHealth(currentScene, playerData, storyDataUpdater.health)
    }

    if (storyDataUpdater.money) {
        playerModifier.updateMoney(playerData, storyDataUpdater.money)
    }

    if (storyDataUpdater.days) {
        playerModifier.updateDays(playerData, storyDataUpdater.days)
    }

    return alive;
}
}
