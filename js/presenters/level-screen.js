/**
 * Модуль содержит презентек игрового уровня
 * Связывает игровую модель и отображение игрового уровня
 */
import LevelHeaderScreenView from '../views/level-header-screen-view.js';
import LevelScreenView from '../views/level-screen-view.js';

import GameModel from '../models/game-model.js';
import Application from '../application.js';

import {GAME_PARAM} from '../data/config.js';
import {showScreen} from '../utilities.js';
import {hasWrongAnswer, getSelectedAnswers} from '../process/process.js';

export default class LevelScreen {

  constructor() {
    this.model = new GameModel();
    // создать презентер связывающий модель и представление
    this.createController(this.model);
  }

  createController(model) {
    this.viewBody = new LevelScreenView(model.currentLevel);
    // при ответе на текущие вопросы, переключаемся на следующий уровень
    this.viewBody.onAnswerSubmit = () => this.nextLevel();
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
        Application.showStatistics(this.model);
        return;
      }

      this.viewHeader.updateTime(this.model.state);

      this.tick();
    }, GAME_PARAM.timeTick);
  }

  stopTimer() {
    // останавливаем таймер
    clearTimeout(this.timeID);
    // сохраняем значение времени в конце уровня
    this._levelEndTime = this.model.state.currentTime;
  }

  nextLevel() {
    this.stopTimer();
    // сохранить статистику ответов по уровню
    const selectedAnswers = getSelectedAnswers(this.viewBody.answersSelected, this.model.currentLevel.answers);
    this.model.statistics = {answers: selectedAnswers, time: (this._levelStartTime - this._levelEndTime)};

    // если допущены ошибки в ответах, забрать игровую жизнь
    if (hasWrongAnswer(this.viewBody.answersSelected, this.model.currentLevel.answers)) {
      this.model.die();
    }
    // если игра закончилась успешно либо не успешно
    // показать экран статистики
    if (this._checkGameEnd()) {
      Application.showStatistics(this.model);
      return;
    }
    // иначе увеличить номер уровня игры
    this.model.nextLevel();
    // создать и отобразить экран нового уровня
    this.createController(this.model);
    showScreen(this.element);
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

  _checkGameEnd() {
    return !this.model.hasNexLevel() || this.model.isDie() || !this.model.hasMoreTime();
  }
}
