import LevelHeaderScreenView from '../views/level-header-screen-view.js';
import LevelScreenView from '../views/level-screen-view.js';

import GameModel from '../models/game-model.js';
import Application from '../application.js';

import {GAME_PARAM} from '../data/config.js';
import {showScreen} from '../utilities.js';

export default class LevelScreen {

  constructor() {
    this.model = new GameModel();
    this.nextLevel = this.nextLevel.bind(this);
    this.createLevel(this.model);
  }

  createLevel(model) {
    this.viewBody = new LevelScreenView(model.currentLevel);
    this.viewBody.onAnswerSubmit = this.nextLevel;
    this.element = this.viewBody.element;
    this._updateHeader();

    // сохраняем значение времени в начале уровня
    this._levelStartTime = model.state.currentTime;
    // запустить отсчет времени
    this.tick();
  }

  tick() {
    this.timeID = setTimeout(() => {
      this.model.tick();

      if (!this.model.hasMoreTime()) {
        this.stopTimer();
        Application.showGameStatistics();
        return;
      }

      this.viewHeader.updateTime(this.model.state);

      this.tick();
    }, GAME_PARAM.timeTick);
  }

  stopTimer() {
    // сохраняем значение времени в конце уровня
    this._levelEndTime = this.model.state.currentTime;
    // останавливаем таймер
    clearTimeout(this.timeID);
  }

  nextLevel() {
    this.stopTimer();

    if (this._checkGameEnd()) {
      Application.showGameStatistics(this.model);
      return;
    }

    this.model.nextLevel();

    this.createLevel(this.model);

    showScreen(this.element);
  }


  _checkGameEnd() {
    return !this.model.hasNexLevel() || this.model.isDie();
  }

  _updateHeader() {
    if (this.headerElement) {
      this.headerElement.remove();
    }

    this.viewHeader = new LevelHeaderScreenView(this.model.state);
    this.viewHeader.updateTime(this.model.state);
    this.viewHeader.onBackBtnClick = Application.showStart;

    this.headerElement = this.viewHeader.element;
    this.element.prepend(this.headerElement);
  }
}
