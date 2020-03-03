/**
 * Модуль содержит класс ModalErrorView
 * Который содержит представление для стартового экрана игры
 */

import AbstractView from './abstract-view.js';

// шаблон окна
const modalTemplate = `<div class="modal__overlay">
    <section class="modal">
      <h2 class="modal__title">Произошла ошибка!</h2>
      <p class="modal__text">Статус: 404. Пожалуйста, перезагрузите страницу.</p>
    </section>
  </div>`;

export default class ModalErrorView extends AbstractView {
  /**
   * Переопределение абстрактного метода родителя
   * Возвращает строку с шаблоном разметки модального окна ошибки
   */
  get _template() {
    return modalTemplate;
  }
}
