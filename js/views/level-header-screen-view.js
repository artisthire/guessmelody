/**
 * Модуль содержит класс LevelHeaderScreenView
 * Который содержит представление для шапки экрака игрового уровня
 */

import AbstractView from './abstract-view.js';
import {GAME_PARAM} from '../data/config.js';
import {getTimeComponents, getTimeAnimationRadius} from '../utilities.js';

const LOW_TIME_CLASS = 'timer__value--finished';

// шаблон разметки шапки игровых уровней
const headerTemplate = (state) => {
  const {minuts, seconds} = getTimeComponents(state.currentTime);

  return `<header class="game__header">
      <a class="game__back" href="#">
        <span class="visually-hidden">Сыграть ещё раз</span>
        <img class="game__logo" src="/img/melody-logo-ginger.png" alt="Угадай мелодию">
      </a>

      <svg xmlns="http://www.w3.org/2000/svg" class="timer" viewBox="0 0 780 780">
        <circle class="timer__line" cx="390" cy="390" r="370" style="filter: url(.#blur); transform: rotate(-90deg) scaleY(-1); transform-origin: center">
      </svg>

      <div class="timer__value" xmlns="http://www.w3.org/1999/xhtml">
        <span class="timer__mins">${minuts}</span>
        <span class="timer__dots">:</span>
        <span class="timer__secs">${seconds}</span>
      </div>

      <div class="game__mistakes">
        ${new Array(state.wrong + 1).join('<div class="wrong"></div>')}
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
  // eslint-disable-next-line no-empty-function
  onBackBtnClick() {
  }

  /**
   * Отдельный метод для обновления значения оставшегося времени игры
   * @param {object} state - объект состояния игры
   */
  updateTime(state) {
    const timerRootElement = this.element.querySelector('.timer__value');
    const timeMinutsElement = this.element.querySelector('.timer__mins');
    const timeSecondsElement = this.element.querySelector('.timer__secs');

    if (state.currentTime <= GAME_PARAM.lowTime && !timerRootElement.classList.contains(LOW_TIME_CLASS)) {
      timerRootElement.classList.add(LOW_TIME_CLASS);
    }

    // получаем компоненты времени
    const {minuts, seconds} = getTimeComponents(state.currentTime);
    // меняем содержимое элементов
    timeMinutsElement.textContent = minuts;
    timeSecondsElement.textContent = seconds;

    // обновляем состояние анимационного круга оставшегося времени
    this._updateTimeCircle(state.totalTime, state.currentTime);
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

  /**
   * Метод обновления анимационного круга, иллюстирующего колличество оставшегося времени
   * @param {number} totalTime - общее колличество игрового времени (сколько всего доступно для игры)
   * @param {number} currentTime - текущее значение игрового времени
   */
  _updateTimeCircle(totalTime, currentTime) {
    const timeCircleElement = this.element.querySelector('.timer__line');
    // находим значение длинны анимационной окружности
    const circleLength = Math.ceil(2 * Math.PI * timeCircleElement.getAttribute('r'));
    // значения для установки стилей в SVG-элементе окружности
    const {stroke, offset} = getTimeAnimationRadius(currentTime / totalTime, circleLength);

    timeCircleElement.style.strokeDasharray = `${stroke}px`;
    timeCircleElement.style.strokeDashoffset = `${offset}px`;
  }
}
