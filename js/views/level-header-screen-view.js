/**
 * Модуль содержит класс LevelHeaderScreenView
 * Который содержит представление для шапки экрака игрового уровня
 */

import AbstractView from './abstract-view.js';
import {getTimeComponents} from '../utilities.js';

// шаблон разметки шапки игровых уровней
const headerTemplate = (state) => {
  const [totalMinuts, totalSeconds] = getTimeComponents(state.lastTime);

  return `<header class="game__header">
      <a class="game__back" href="#">
        <span class="visually-hidden">Сыграть ещё раз</span>
        <img class="game__logo" src="/img/melody-logo-ginger.png" alt="Угадай мелодию">
      </a>

      <svg xmlns="http://www.w3.org/2000/svg" class="timer" viewBox="0 0 780 780">
        <circle class="timer__line" cx="390" cy="390" r="370" style="filter: url(.#blur); transform: rotate(-90deg) scaleY(-1); transform-origin: center">
      </svg>

      <div class="timer__value" xmlns="http://www.w3.org/1999/xhtml">
        <span class="timer__mins">${totalMinuts}</span>
        <span class="timer__dots">:</span>
        <span class="timer__secs">${totalSeconds}</span>
      </div>

      <div class="game__mistakes">
        ${new Array(state.wrongAnswer + 1).join('<div class="wrong"></div>')}
      </div>
    </header>`;
};


export default class LevelHeaderScreenView extends AbstractView {

  constructor(gameState) {
    super();
    this.gameState = gameState;
  }

  /**
   * Обработчик клика на кнопку начала игры заново
   * Должен переопределен для правильной реакции на перезапуск игры
   */
  onBackBtnClick() {
  }

  /**
   * Переопределение абстрактного метода родителя
   * Возвращает строку с шаблоном разметки шапки окна игрового уровня
   * В зависимости от текущего состояния игры
   */
  get _template() {
    return headerTemplate(this.gameState);
  }

  /**
   * Переопределение метода родителя
   * Навешивает соответствующие обработчики на шаблон шапки игрового окна
   * @param {object} container - DOM-элемент, содержащий разметку игрового окна
   * @return {object} - тот же DOM-элемент, к которому навешены нужные обработчики событий
   */
  _bind(container) {
    const backBtn = container.querySelector('.game__back');

    // обработчик перезапуска игры
    backBtn.addEventListener('click', (evt) => {
      evt.preventDefault();
      this.onBackBtnClick();
    });

    return container;
  }
}
