/**
 * Модуль содержит класс ResultScreenView
 * Который содержит представление для стартового экрана игры
 */

import AbstractView from './abstract-view.js';

// Общий шаблон разметки окна с результатом игры
const resultScreenTemplate = (message) => `<section class="result">
    <div class="result__logo"><img src="img/melody-logo.png" alt="Угадай мелодию" width="186" height="83"></div>
    ${message}
    <button class="result__replay" type="button">Попробовать ещё раз</button>
  </section>`;


export default class ResultScreenView extends AbstractView {

  constructor(gameEndMessage) {
    super();
    this.message = gameEndMessage;
  }

  /**
   * Обработчик клика на кнопку перезапуска игры
   * Пустой, должен быть определен для обработки события перезапуска игры
   */
  onRestartGame() {
  }

  /**
   * Переопределение абстрактного метода родителя
   * Возвращает строку с шаблоном разметки окна результата игры
   */
  get _template() {
    return resultScreenTemplate(this.message);
  }

  /**
   * Переопределение метода родителя
   * Навешивает соответствующие обработчики на шаблон окна результатов игры
   * @param {object} container - DOM-элемент, содержащий разметку игрового окна
   * @return {object} - тот же DOM-элемент, к которому навешены нужные обработчики событий
   */
  _bind(container) {
    // добавить обработчик рестарта игры
    const replayBtn = container.querySelector('.result__replay');
    replayBtn.addEventListener('click', (evt) => {
      evt.preventDefault();
      this.onRestartGame();
    });

    return container;
  }
}
