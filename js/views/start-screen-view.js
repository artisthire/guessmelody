/**
 * Модуль содержит класс StartScreenView
 * Который содержит представление для стартового экрана игры
 */

import AbstractView from './abstract-view.js';

// шаблон стартового окна игры
const startScreenTemplate = `<section class="welcome">
    <div class="welcome__logo"><img src="img/melody-logo.png" alt="Угадай мелодию" width="186" height="83"></div>
    <button class="welcome__button"><span class="visually-hidden">Начать игру</span></button>
    <h2 class="welcome__rules-title">Правила игры</h2>
    <p class="welcome__text">Правила просты:</p>
    <ul class="welcome__rules-list">
      <li>За 5 минут нужно ответить на все вопросы.</li>
      <li>Можно допустить 3 ошибки.</li>
    </ul>
    <p class="welcome__text">Удачи!</p>
  </section>`;

export default class StartScreenView extends AbstractView {

  /**
   * Обработчик клика на кнопку старта игры
   * Пустой, должен быть определен для обработки события старта игры
   */
  onStartBtnClick() {
  }

  /**
   * Переопределение абстрактного метода родителя
   * Возвращает строку с шаблоном разметки стартового окна
   */
  get _template() {
    return startScreenTemplate;
  }

  /**
   * Переопределение метода родителя
   * Навешивает соответствующие обработчики на шаблон стартового окна
   * @param {object} container - DOM-элемент, содержащий разметку игрового окна
   * @return {object} - тот же DOM-элемент, к которому навешены нужные обработчики событий
   */
  _bind(container) {
    const playBtn = container.querySelector('.welcome__button');

    // при клике на кнопку "Играть" показать первый экран игры
    playBtn.addEventListener('click', (evt) => {
      evt.preventDefault();
      this.onStartBtnClick();
    });

    return container;
  }
}
