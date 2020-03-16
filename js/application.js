import StartScreen from './presenters/start-screen.js';
import LevelScreen from './presenters/level-screen.js';
import {showScreen} from './utilities.js';

export default class Application {

  static showStart() {
    const start = new StartScreen();
    showScreen(start.element);
  }

  static showGameLevel() {
    const level = new LevelScreen();
    showScreen(level.element);
  }

  static showGameStatistics() {
    console.log('Game End');
  }

}
