import StartScreen from './presenters/start-screen.js';
import {showScreen} from './utilities.js';

export default class Application {

  static showStart() {
    const start = new StartScreen();
    showScreen(start.element);
  }

}
