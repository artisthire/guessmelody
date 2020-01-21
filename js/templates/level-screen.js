/**
 * Модуль содержит шаблоны и функции инициализации для разметки игровых уровней
 * по выбору Артиста или Жанра песни
 */
import {startGame, nextLevel} from '../controller.js';
import {initTrackController} from '../process/tracks-controller.js';
import {getElementFromTemplate, getTimeComponents} from '../utilities.js';

// шаблон разметки шапки игровых уровней
const headerTemplate = (state) => {
  const [totalMinuts, totalSeconds] = getTimeComponents(state.lastTime);

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

// шаблон разметки игрового уровня на выбор Артиста по аудиотреку
const selectArtistTemplate = (question) => `<section class="game__screen">
    <h2 class="game__title">${question.title}</h2>
    <div class="game__track">
      <button class="track__button track__button--pause" type="button"></button>
      <audio src=${question.srcs[0]} autoplay></audio>
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

// шаблон разметки игрового уровня на выбор Жанра аудиотреков
const selectGenreTemplate = (question) => `<section class="game__screen">
  <h2 class="game__title">${question.title}</h2>
  <form class="game__tracks">

  ${question.answers.map((answer, index) =>
    `<div class="track">
      <button class="track__button ${index === 0 ? 'track__button--pause' : 'track__button--play'}" type="button"></button>
      <div class="track__status">
        <audio src=${answer.src} ${index === 0 ? 'autoplay' : ''}></audio>
      </div>
      <div class="game__answer">
        <input class="game__input visually-hidden" type="checkbox" name="answer" value="${answer.artist}" id="answer-${index + 1}">
        <label class="game__check" for="answer-${index + 1}">Отметить</label>
      </div>
    </div>`).join('')}

    <button class="game__submit button" type="submit" disabled>Ответить</button>
  </form>
  </section>
</section>`;

/**
 * Функция инициализации DOM-элементов шапки игрового уровня
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
 * Функция инициализации DOM-элементов уровня игрового окна на выбор Артиста
 * @param {object} container - DOM-элемент контейнер, содержащий DOM разметку, сгенерированную на основе шаблона
 * @return {object} - DOM-элемент контейнер с разметкой игрового окна, над которым выполнена инциализация (добавлены обработчики событий)
 */
function initSelectArtistTemplate(container) {
  const form = container.querySelector('.game__artist');
  const selectBtns = [...container.querySelectorAll('.artist__input')];
  // будет содержать индексы выбранных ответов
  let selectedAnswerIndexes = [];

  // при клике на любую из кнопок ответов, выбор ответа подтверждается автоматически
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

    selectedAnswerIndexes = getSelectedAnswerIdexes(selectBtns);

    nextLevel(selectedAnswerIndexes);
  }
}

/**
 * Функция инициализации DOM-элементов уровня игрового окна на выбор Жанра
 * @param {object} container - DOM-элемент контейнер, содержащий DOM разметку, сгенерированную на основе шаблона
 * @return {object} - DOM-элемент контейнер с разметкой игрового окна, над которым выполнена инциализация (добавлены обработчики событий)
 */
function initSelectGenreTemplate(container) {
  const form = container.querySelector('.game__tracks');
  const btnSubmit = container.querySelector('.game__submit');
  const selectBtns = [...container.querySelectorAll('.game__input')];
  // будет содержать индексы выбранных ответов
  let selectedAnswerIndexes = [];

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

    selectedAnswerIndexes = getSelectedAnswerIdexes(selectBtns);

    // разрешаем нажать кнопку "Ответ" если выбран хотябы один из ответов
    btnSubmit.disabled = !selectedAnswerIndexes.length;
  }

  /**
   * Обработчик подтвержения выбора песен, соответствующих заданному жанру (ответа на форму с checkboxes)
   * @param {object} evt - объект события submit формы
   */
  function onFormSubmit(evt) {
    evt.preventDefault();

    // если не выбрана ни одна из песен, ничего не делаем
    if (!selectedAnswerIndexes.length) {
      return;
    }

    // иначе показываем следующий игровой экран
    nextLevel(selectedAnswerIndexes);
  }
}

/**
 * Возвращает массив порядковых номеров (индексов) из общего списка вариантов ответов, которые были выбранны пользователем
 * @param {array} selectBtns - массив DOM-элеметов чекбоксов или радиокнопок, представляющих варианты ответов
 * @return {array} - числовой массив с индексами элементов, которые были выбраны пользователем
 */
function getSelectedAnswerIdexes(selectBtns) {
  return selectBtns.reduce((indexes, btn, index) => {
    if (btn.checked) {
      indexes.push(index);
    }

    return indexes;
  }, []);
}

/**
 * На основе типа игрового уровня и шабонов создает и инициализирует разметку для игрового окна
 * @param {object} gameState - объект состояния игры, используемый при генерации шаблонов
 * @param {object} levelQuestion - объект с данными о вопросах для текущего уровня игры
 * @return {object} - DOM-элемент, содержащий всю разметку игрового окна инициализированную нужными обработчиками событий
 */
export default function getLevelScreen(gameState, levelQuestion) {

  // по типу полученных вопросов выбрать соответствующий шаблон разметки и функцию инициализации для тела разметки игрового уровня
  const generateLevelData = (levelQuestion.type === 'artist') ?
    {template: selectArtistTemplate, initFunct: initSelectArtistTemplate} :
    {template: selectGenreTemplate, initFunct: initSelectGenreTemplate};

  // получаем общую текстовоую разметку шапки и тела уровня игры
  const fullScreenTemplate = headerTemplate(gameState) + generateLevelData.template(levelQuestion);
  // на основе шаблона генерируем DOM-разметку
  let fullScreenElement = getElementFromTemplate(fullScreenTemplate);

  // последовательная инициализация шапки и тела игрового уровня обработчиками событий
  fullScreenElement = initHeaderTemplate(fullScreenElement);
  fullScreenElement = initTrackController(fullScreenElement);
  fullScreenElement = generateLevelData.initFunct(fullScreenElement);

  return fullScreenElement;
}

