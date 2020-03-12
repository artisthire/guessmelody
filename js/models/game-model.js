/**
 * Модуль содержит модель для использования на игровых уровнях
 */
import {INITIAL_GAME, levelResultTemplate, questions} from '../data/data.js';

export default class GameModel {

  constructor() {
    this.restart();
  }

  get state() {
    return Object.freeze(this._state);
  }

  get currentLevel() {
    return questions[this._state.level];
  }

  set statistics(levelStatistics) {
    const result = Object.assign({}, levelResultTemplate);
    result.answers.push(levelStatistics.answers);
    result.time = levelStatistics.time;

    this._state = Object.assign({}, this._state, {statistics: this._state.statistics.push(result)});
  }

  restart() {
    this._state = INITIAL_GAME;
  }

  nextLevel() {
    this._state = Object.assign({}, this._state, {level: this._state.level + 1});
  }

  hasNexLevel() {
    return questions[this._state.level + 1] !== undefined;
  }

  die() {
    this._state = Object.assign({}, this._state, {totalTries: this._state.totalTries - 1});
  }

  isDie() {
    return this._state.totalTries <= 0;
  }

  tick() {
    this._state = Object.assign({}, this._state, {totalTime: this._state.totalTime - 1});
  }

  hasMoreTime() {
    return this._state.totalTime > 0;
  }
}
