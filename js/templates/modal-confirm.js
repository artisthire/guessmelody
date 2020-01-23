/**
 * Модуль содержит шаблон и функцию для показа окна подтверждения рестарта игры
 * Функция показа окна подтверждения принимает callback-функции, которые вызываются
 * если пользователь подвердил выбор или отменил его
 */

import {getElementFromTemplate} from '../utilities.js';

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

/**
 * Функция инициализации обработчиков кнопок подтверждения или отмены выбора модального окна
 * @param {object} container - ссылка на DOM-элемент разметки окна, сгенерированный на основе шаблона
 * @param {function} onConfirm - callback-функция, которая вызывается, если пользователь нажал кнопку подтверждения выбора
 * @param {function} onCancel - callback-функция, которая вызывается, если пользователь нажал отмену либо закрыл окно
 * @return {object} - DOM-элемент разметки окна с навешенными обработчиками
 */
function initModalConfirm(container, onConfirm, onCancel) {
  const confirmBtn = container.querySelector('.js-confirm-btn');
  const cancelBtn = container.querySelector('.js-cancel-btn');
  const closeBtn = container.querySelector('.js-close-btn');

  confirmBtn.addEventListener('click', onConfirmBtnClick);
  cancelBtn.addEventListener('click', onCancelBtnClick);
  closeBtn.addEventListener('click', onCloseBtnClick);

  return container;

  /**
   * Функция-обработчик события при клике на кнопке подтверждения выбора
   * @param {object} evt - ссылка на объект события
   */
  function onConfirmBtnClick(evt) {
    evt.preventDefault();

    closeModalConfirm(container, onConfirm);
  }

  /**
   * Функция-обработчик события при клике на кнопке отмены выбора
   * @param {object} evt - ссылка на объект события
   */
  function onCancelBtnClick(evt) {
    evt.preventDefault();

    closeModalConfirm(container, onCancel);
  }

  /**
   * Функция-обработчик события при клике на кнопке закрытия окна
   * @param {object} evt - ссылка на объект события
   */
  function onCloseBtnClick(evt) {
    evt.preventDefault();

    closeModalConfirm(container, onCancel);
  }
}

/**
 * Функция закрытия модального окна подтверждения выбора
 * @param {object} container - DOM-элемент содержащий всю разметку модального окна
 * @param {function} callback - функция, которая вызывается при закрытии окна
 *  Функция передается разная, в зависимости от того был ли выбор пользователем подтвержден или отменен
 */
function closeModalConfirm(container, callback) {

  if (callback) {
    callback();
  }

  container.remove();
}

/**
 * Функция открытия модального окна подтверждения выбора
 * @param {function} onConfirm - callback-функция, которая вызывается, если пользователь нажал кнопку подтверждения выбора
 * @param {function} onCancel - callback-функция, которая вызывается, если пользователь нажал отмену либо закрыл окно
 */
export default function showModalConfirm(onConfirm, onCancel) {
  let modalElement = getElementFromTemplate(modalTemplate);
  modalElement = initModalConfirm(modalElement.firstElementChild, onConfirm, onCancel);

  document.body.append(modalElement);
}
