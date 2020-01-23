/**
 * Модуль содержит шаблон и функцию для показа модального ошибка сетевого взаимодействия
 */

import {getElementFromTemplate} from '../utilities.js';

// шаблон окна
const modalTemplate = `<div class="modal__overlay">
    <section class="modal">
      <h2 class="modal__title">Произошла ошибка!</h2>
      <p class="modal__text">Статус: 404. Пожалуйста, перезагрузите страницу.</p>
    </section>
  </div>`;

/**
 * На основе шаблона генерирует и добавляет разметку окна ошибки загрузки на страницу
 * Окно добавляется в <BODY>
 */
export default function showModalError() {
  const modalElement = getElementFromTemplate(modalTemplate);
  document.body.append(modalElement.firstElementChild);
}
