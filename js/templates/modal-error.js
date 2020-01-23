import {getElementFromTemplate} from '../utilities.js';

const modalTemplate = `<section class="modal">
    <h2 class="modal__title">Произошла ошибка!</h2>
    <p class="modal__text">Статус: 404. Пожалуйста, перезагрузите страницу.</p>
  </section>`;

export default function showModalError() {
  const modalElement = getElementFromTemplate(modalTemplate);
  document.body.append(...modalElement.children);
}
