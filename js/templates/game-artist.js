/**
 * Модуль шаблона разметки для окна выбора артиста
 */
import {nextLevel} from '../controller.js';

const screen = (question) => `<section class="game__screen">
    <h2 class="game__title">${question.title}</h2>
    <div class="game__track">
      <button class="track__button track__button--pause" type="button"></button>
      <audio></audio>
    </div>

    <form class="game__artist">

    ${question.answers.map((answer, index) =>
    `<div class="artist">
      <input class="artist__input visually-hidden" type="radio" name="answer" value="${answer.artist}" id="answer-${index + 1}">
      <label class="artist__name" for="answer-${index + 1}">
        <img class="artist__picture" src="${answer.img}" alt="${answer.artist}">
        ${answer.artist}
      </label>
    </div>`
  ).join('')}

    </form>
  </section>
</section>`;

/**
 * Функция инициализации DOM-элементов игрового окна
 * @param {object} container - DOM-элемент контейнер, содержащий DOM разметку, сгенерированную на основе шаблона
 * @return {object} - DOM-элемент контейнер с разметкой игрового окна, над которым выполнена инциализация (добавлены обработчики событий)
 */
function initScreen(container) {
  const form = container.querySelector('.game__artist');
  const selectBtns = [...container.querySelectorAll('.artist__input')];

  // при клике на любую из кнопок ответов, показать окно с результатом игры
  form.addEventListener('click', onSelectBtnClick);

  return container;

  /**
   * Обработчик события клика на одину из кнопок ответа на выбор исполнителя песни
   * @param {object} evt - объект события клика на кнопку ответа
   */
  function onSelectBtnClick(evt) {
    const target = evt.target;

    if (!selectBtns.includes(target)) {
      return;
    }

    nextLevel();
  }
}

export default {template: screen, initFunction: initScreen};
