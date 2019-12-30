/**
 * Модуль шаблона разметки для окна выбора песни по жанру
 */
import {nextLevel} from '../controller.js';

const screen = (question) => `<section class="game__screen">
  <h2 class="game__title">${question.title}</h2>
  <form class="game__tracks">


  ${question.answers.map((answer, index) =>
    `<div class="track">
      <button class="track__button track__button--play" type="button"></button>
      <div class="track__status">
        <audio></audio>
      </div>
      <div class="game__answer">
        <input class="game__input visually-hidden" type="checkbox" name="answer" value="${answer.artist}" id="answer-${index + 1}">
        <label class="game__check" for="answer-${index + 1}">Отметить</label>
      </div>
    </div>`).join('')}

    <button class="game__submit button" type="submit">Ответить</button>
  </form>
  </section>
</section>`;

/**
 * Функция инициализации DOM-элементов игрового окна
 * @param {object} container - DOM-элемент контейнер, содержащий DOM разметку, сгенерированную на основе шаблона
 * @return {object} - DOM-элемент контейнер с разметкой игрового окна, над которым выполнена инциализация (добавлены обработчики событий)
 */
function initScreen(container) {
  const form = container.querySelector('.game__tracks');
  const btnSubmit = container.querySelector('.game__submit');
  const selectBtns = [...container.querySelectorAll('.game__input')];

  // до выбора хотябы одной песни кнопка ответа отключена
  btnSubmit.disabled = true;

  // обработчик по клику на одну из кнопок выбора песни
  form.addEventListener('click', onSelectBtnClick);
  // обработчки "Ответа"
  form.addEventListener('submit', onFormSubmit);

  return container;

  /**
   * Обработчик клика кнопки выбора песен, соответствующих жанру
   * Навешен на общую форму с кнопками (делегирование события клика)
   * @param {object} evt - объект события при клике на одну из кнопок внутри формы
   */
  function onSelectBtnClick(evt) {
    const target = evt.target;

    // если клик не по одной из кнопок выбора песни ничего не делаем
    if (!selectBtns.includes(target)) {
      return;
    }

    // если не выбран ни одина из песен, на следующий экран не переходим
    if (!getSelectedGenres().length) {
      btnSubmit.disabled = true;
      return;
    }

    // иначе разрешаем нажать кнопку "Ответ" и перейти на следующий игровой экран
    btnSubmit.disabled = false;
  }

  /**
   * Обработчик подтвержения выбора песен, соответствующих заданному жанру (ответа на форму с checkboxes)
   * @param {object} evt - объект события submit формы
   */
  function onFormSubmit(evt) {
    evt.preventDefault();

    // если не выбрана ни одна из песен, ничего не делаем
    if (!getSelectedGenres().length) {
      return;
    }

    // иначе показываем следующий игровой экран
    nextLevel();
  }

  /**
   * Функция, которая возвращает все выбранные игроком песни
   * @return {array} evt - массив DOM-элементов checkbox-сов выбранных песен
   */
  function getSelectedGenres() {
    // найти все выбранные жанры
    const checkedSelectBtns = selectBtns.filter((checkbox) => checkbox.checked);

    return checkedSelectBtns;
  }
}

export default {template: screen, initFunction: initScreen};
