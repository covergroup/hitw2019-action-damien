import { Game } from '../game';
import { StoryData } from './storyData';
import { SceneCommon } from './sceneCommon';

export interface PlayerData {
  health: number;
  money: number;
  days: number;
  multidrugResistantTuberculosis: boolean;
}

export class PlayerModifier {
  game: Game;

  constructor(game: Game) {
    this.game = game;
  }

  updateHealth(currentScene: SceneCommon, playerData: PlayerData, deltaHealth: number): boolean {
    if (playerData.multidrugResistantTuberculosis && deltaHealth < 0) {
      deltaHealth *= 2;
    }

    playerData.health += deltaHealth;
    console.log(`updated playerData.health: ${playerData.health}`);

    if (playerData.health <= 0) {
      playerData.health = 0;

      currentScene.stopAnimations();

      this.game.scene.start("YouLooseScene");

      return false;
    }

    return true;
  }

  updateMoney(playerData: PlayerData, deltaMoney: number) {
    playerData.money += deltaMoney;
  }

  updateDays(playerData: PlayerData, deltaDays: number) {
    playerData.days += deltaDays;
  }

  resetState(playerData: PlayerData, deltaDays: number) {
    playerData.days = 0;
    playerData.health = 100;
    playerData.money = 100;
    playerData.multidrugResistantTuberculosis = false;
  }
}
