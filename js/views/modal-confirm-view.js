/**
 * Модуль содержит класс ModalConfirmView
 * Который содержит представление для стартового экрана игры
 */

import AbstractView from './abstract-view.js';

// шаблон окна
const modalTemplate = `<div class="modal__overlay">
    <section class="modal">
      <button class="modal__close js-close-btn" type="button"><span class="visually-hidden">Закрыть</span></button>
      <h2 class="modal__title">Подтверждение</h2>
      <p class="modal__text">Вы уверены что хотите начать игру заново?</p>
      <div class="modal__buttons">
        <button class="modal__button button js-confirm-btn">Ок</button>
        <button class="modal__button button js-cancel-btn">Отмена</button>
      </div>
    </section>
  </div>`;

export default class ModalConfirmView extends AbstractView {
  /**
   * Обработчик клика на кнопку подтверждения выбора
   * Пустой, должен быть определен для обработки события подтверждения выбора
   */
  // eslint-disable-next-line no-empty-function
  onConfirm() {
  }

  /**
   * Обработчик клика на кнопку отмены выбора
   * Пустой, должен быть определен для обработки события отмены выбора
   */
  // eslint-disable-next-line no-empty-function
  onCancel() {
  }

  /**
   * Переопределение абстрактного метода родителя
   * Возвращает строку с шаблоном разметки модального окна подтверждения выбора
   */
  get _template() {
    return modalTemplate;
  }

  /**
   * Переопределение метода родителя
   * Навешивает соответствующие обработчики на шаблон модального окна подтверждения выбора
   * @param {object} container - DOM-элемент, содержащий разметку модального окна подтверждения выбора
   * @return {object} - тот же DOM-элемент, к которому навешены нужные обработчики событий
   */
  _bind(container) {
    const confirmBtn = container.querySelector('.js-confirm-btn');
    const cancelBtn = container.querySelector('.js-cancel-btn');
    const closeBtn = container.querySelector('.js-close-btn');

    const onCancelBtnClick = (evt) => {
      evt.stopPropagation();
      evt.preventDefault();
      this.onCancel();
    };

    cancelBtn.addEventListener('click', onCancelBtnClick);
    closeBtn.addEventListener('click', onCancelBtnClick);

    confirmBtn.addEventListener('click', (evt) => {
      evt.stopPropagation();
      evt.preventDefault();
      this.onConfirm();
    });

    return container;
  }
}
