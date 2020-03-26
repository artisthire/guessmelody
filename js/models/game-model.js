/**
 * Модуль содержит модель для использования на игровых уровнях
 */
import {INITIAL_STATE, GAME_DATA} from '../data/data.js';

export default class GameModel {

  constructor() {
    this.restart();
  }

  /**
   * Возвращает объект состояния игры
   * @return {object} - объект состояния игры
   */
  get state() {
    return Object.freeze(Object.assign({}, this._state));
  }

  /**
   * Возвращает объект с данными для текущего уровня игры
   * @return {object} - объект с данными для текущего уровня игры
   */
  get currentLevel() {
    return GAME_DATA.questions[this._state.level];
  }

  /**
   * Сохраняет статистику ответов пользователя по пройденному уровню игры
   * @param {object} levelStatistics - объект, содержащий выбранные ответы и время прохождения уровня игры
     levelStatistics.answers - массив ответов
     levelStatistics.time - время прохождения уровня
   */
  set statistics(levelStatistics) {
    // на основе типовой структуры создаем объект с массивом ответов и временем прохождения игры
    const result = {answers: [], time: 0};
    result.answers.push(levelStatistics.answers);
    result.time = levelStatistics.time;

    // сохраняем статистику
    this._state.statistics.push(result);
  }

  /**
   * Инициализует начальное состояние игры
   */
  restart() {
    this._state = Object.assign({}, INITIAL_STATE);
  }

  /**
   * Переключает номер игрового уровня
   */
  nextLevel() {
    this._state.level++;
  }

  /**
   * Проверяет, есть ли еще новые уровня игры
   * @return {boolean} - true - еще есть следующий уровень, false - достигнут конец игры
   */
  hasNexLevel() {
    return GAME_DATA.questions[this._state.level + 1] !== undefined;
  }

  /**
   * Изменяет колличество ошибок, допущенных при ответах
   */
  die() {
    this._state.wrong++;
  }

  /**
   * Проверяет остались ли еще игровые жизни
   * @return {boolean} - true - игровые жизни закончились, false - есть еще игровые жизни
   */
  isDie() {
    return this._state.wrong > this._state.lives;
  }

  /**
   * Изменяет колличество оставшегося игрового времени
   */
  tick() {
    this._state.currentTime--;
  }

  /**
   * Проверяет, не закончилось ли еще игровое время
   * @return {boolean} - true - время еще не закончилось, false - время игры истекло
   */
  hasMoreTime() {
    return this._state.currentTime > 0;
  }
}
