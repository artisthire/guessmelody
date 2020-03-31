import StartScreen from './presenters/start-screen.js';
import LevelScreen from './presenters/level-screen.js';
import ResultScreen from './presenters/result-screen.js';
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

  static showStatistics(model) {
    const result = new ResultScreen(model);
    showScreen(result.element);
  }

}
