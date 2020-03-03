/**
 * Модуль содержит класс ModalLoadAnimationView
 * Который содержит представление для стартового экрана игры
 */

import AbstractView from './abstract-view.js';

// шаблон окна
const modalTemplate = (message) => `<div id="preload-spinner" class="spinner">${message}</div>`;

export default class ModalLoadAnimationView extends AbstractView {

  constructor(message = 'Синхронизация<br>данных!') {
    super();
    this.message = message;
  }
  /**
   * Переопределение абстрактного метода родителя
   * Возвращает строку с шаблоном разметки модального окна ошибки
   */
  get _template() {
    return modalTemplate(this.message);
  }
}
