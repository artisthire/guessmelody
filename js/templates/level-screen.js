import {startGame, nextLevel} from '../controller.js';
import {initConfig} from '../data/config.js';
import {getElementFromTemplate} from '../utilities.js';

const headerTemplate = (state) => {
  const date = new Date();
  date.setTime(state.lastTime);
  const timeComponents = date.toLocaleTimeString('en-US', {hour12: false}).split(':');
  const totalMinuts = timeComponents[1];
  const totalSeconds = timeComponents[2];

  return `<section class="game game--artist">
    <header class="game__header">
      <a class="game__back" href="#">
        <span class="visually-hidden">Сыграть ещё раз</span>
        <img class="game__logo" src="/img/melody-logo-ginger.png" alt="Угадай мелодию">
      </a>

      <svg xmlns="http://www.w3.org/2000/svg" class="timer" viewBox="0 0 780 780">
        <circle class="timer__line" cx="390" cy="390" r="370" style="filter: url(.#blur); transform: rotate(-90deg) scaleY(-1); transform-origin: center">
      </svg>

      <div class="timer__value" xmlns="http://www.w3.org/1999/xhtml">
        <span class="timer__mins">${totalMinuts}</span>
        <span class="timer__dots">:</span>
        <span class="timer__secs">${totalSeconds}</span>
      </div>

      <div class="game__mistakes">
        ${new Array(state.wrongAnswer + 1).join('<div class="wrong"></div>')}
      </div>
    </header>`;
};

const selectArtistTemplate = (question) => `<section class="game__screen">
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

const selectGenreTemplate = (question) => `<section class="game__screen">
  <h2 class="game__title">${question.title}</h2>
  <form class="game__tracks">


  ${question.answers.map((answer, index) =>
    `<div class="track">
      <button class="track__button ${index === 0 ? 'track__button--pause' : 'track__button--play'}" type="button"></button>
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
function initHeaderTemplate(container) {
  const backBtn = container.querySelector('.game__back');

  // обработчик перезапуска игры
  backBtn.addEventListener('click', onBackBtnClick);

  return container;

  /**
   * Обработчик клика на кнопку начала игры заново
   * @param {object} evt - объект события клика на кнопку
   */
  function onBackBtnClick(evt) {
    evt.preventDefault();
    startGame();
  }
}

/**
 * Функция инициализации DOM-элементов игрового окна
 * @param {object} container - DOM-элемент контейнер, содержащий DOM разметку, сгенерированную на основе шаблона
 * @return {object} - DOM-элемент контейнер с разметкой игрового окна, над которым выполнена инциализация (добавлены обработчики событий)
 */
function initSelectArtistTemplate(container) {
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

/**
 * Функция инициализации DOM-элементов игрового окна
 * @param {object} container - DOM-элемент контейнер, содержащий DOM разметку, сгенерированную на основе шаблона
 * @return {object} - DOM-элемент контейнер с разметкой игрового окна, над которым выполнена инциализация (добавлены обработчики событий)
 */
function initSelectGenreTemplate(container) {
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

export default function getLevelScreen(gameState, levelQuestion) {

  const generateLevelData = (levelQuestion.type === 'artist') ?
    {template: selectArtistTemplate, initFunct: initSelectArtistTemplate} :
    {template: selectGenreTemplate, initFunct: initSelectGenreTemplate};

  const fullScreenTemplate = headerTemplate(gameState) + generateLevelData.template(levelQuestion);
  let fullScreenElement = getElementFromTemplate(fullScreenTemplate);

  fullScreenElement = initHeaderTemplate(fullScreenElement);
  fullScreenElement = generateLevelData.initFunct(fullScreenElement);

  return fullScreenElement;
}

