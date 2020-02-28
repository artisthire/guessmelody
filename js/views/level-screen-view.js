/**
 * Модуль содержит класс LevelScreenView
 * Который содержит представление для экранов уровней игры
 */

import AbstractView from './abstract-view.js';
import {getTimeComponents} from '../utilities.js';

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

export default class LevelScreenView extends AbstractView {

  constructor(gameState, levelQuestion) {
    super();
    this.gameState = gameState;
    this.levelQuestion = levelQuestion;

    // содержит признак выбора одного из ответов
    // по нему разрешается переход на следующий уровень игры
    this._answerSelected = false;
  }

  /**
   * Обработчик клика на кнопку начала игры заново
   * Должен переопределен для правильной реакции на перезапуск игры
   */
  onBackBtnClick() {
  }

  /**
   * Обработчик выбора ответа и переходна на следующий уровень
   * Должен быть переопределен для правильной реакции на переход на следующий уровень
   */
  onAnswerSubmit() {
  }

  /**
   * Переопределение абстрактного метода родителя
   * Возвращает строку с шаблоном разметки окна игрового уровня
   * В зависимости от типа вопросов на уровне (на выбор Артиста или Жанра)
   * Текущего состояния игры и перечня вопросов
   */
  get _template() {
    // по типу полученных вопросов выбрать соответствующий шаблон разметки
    const bodyTemplate = (this.levelQuestion.type === 'artist') ? selectArtistTemplate : selectGenreTemplate;
    // получаем общую текстовоую разметку шапки и тела уровня игры
    const fullTemplate = headerTemplate(this.gameState) + bodyTemplate(this.levelQuestion);

    return fullTemplate;
  }

  /**
   * Переопределение метода родителя
   * Навешивает соответствующие обработчики на шаблон игрового окна
   * @param {object} container - DOM-элемент, содержащий разметку игрового окна
   * @return {object} - тот же DOM-элемент, к которому навешены нужные обработчики событий
   */
  _bind(container) {
    // сначала навешиваем обработчики для шапки игрового окна
    let bindenElements = this._bindScreenHeader(container);
    // далее в зависимости от типа вопросов, навешиваем обработчик для тела игрового окна
    bindenElements = (this.levelQuestion.type === 'artist') ?
      this._bindScreenSelectArtist(bindenElements) :
      this._bindScreenSelectGenre(bindenElements);

    return bindenElements;
  }


  /**
   * Метод инициализации DOM-элементов шапки игрового уровня
   * @param {object} container - DOM-элемент контейнер, содержащий DOM разметку, сгенерированную на основе шаблона
   * @return {object} - DOM-элемент контейнер с разметкой игрового окна, над которым выполнена инциализация
   */
  _bindScreenHeader(container) {
    const backBtn = container.querySelector('.game__back');

    // обработчик перезапуска игры
    backBtn.addEventListener('click', (evt) => {
      evt.preventDefault();
      this.onBackBtnClick();
    });

    return container;
  }

  /**
   * Метод инициализации DOM-элементов уровня игрового окна на выбор Артиста
   * @param {object} container - DOM-элемент контейнер, содержащий DOM разметку, сгенерированную на основе шаблона
   * @return {object} - DOM-элемент контейнер с разметкой игрового окна, над которым выполнена инциализация (добавлены обработчики событий)
   */
  _bindScreenSelectArtist(container) {
    const form = container.querySelector('.game__artist');
    this._answerBtns = [...container.querySelectorAll('.artist__input')];

    // обработчик клика на кнопку с одним из вариантов ответа
    form.addEventListener('click', (evt) => {
      // если клик не по одной из кнопок выбора песни ничего не делаем
      if (!this._answerBtns.includes(evt.target)) {
        return;
      }

      // устанавливаем признак, что был выбран ответ
      // для того, чтобы разрешить обработку подтверждения ответа
      this._answerSelected = true;

      // при клике на любую из кнопок вариантов ответов, выбор ответа подтверждается автоматически
      form.submit();
    });

    // обработчик подтверждения ответа
    form.addEventListener('submit', (evt) => {
      this._onFormSubmit(evt);
    });

    return container;
  }

  /**
   * Функция инициализации DOM-элементов уровня игрового окна на выбор Жанра
   * @param {object} container - DOM-элемент контейнер, содержащий DOM разметку, сгенерированную на основе шаблона
   * @return {object} - DOM-элемент контейнер с разметкой игрового окна, над которым выполнена инциализация (добавлены обработчики событий)
   */
  _bindScreenSelectGenre(container) {
    const form = container.querySelector('.game__tracks');
    const btnSubmit = container.querySelector('.game__submit');
    this._answerBtns = [...container.querySelectorAll('.game__input')];

    // обработчик по клику на одну из кнопок выбора песни
    form.addEventListener('click', (evt) => {
      // если клик не по одной из кнопок выбора песни ничего не делаем
      if (!this._answerBtns.includes(evt.target)) {
        return;
      }

      // устанавливаем признак, выбран ли хоть один ответ
      this._answerSelected = !!this._getSelectedAnswerIdexes().length;

      // разрешаем нажать кнопку "Ответ" если выбран хотя бы один из ответов
      btnSubmit.disabled = !this._answerSelected;
    });

    form.addEventListener('submit', (evt) => {
      this._onFormSubmit(evt);
    });

    return container;
  }

  _onFormSubmit(evt) {
    evt.preventDefault();

    // ответ подтверждается, если выбран хотябы один из вариантов ответа
    if (this._answerSelected) {
      this.onAnswerSubmit();
    }
  }

  /**
   * Возвращает массив порядковых номеров (индексов) из общего списка вариантов ответов, которые были выбранны пользователем
   * @return {array} - числовой массив с индексами элементов из вариантов ответов, которые были выбраны пользователем
   */
  _getSelectedAnswerIdexes() {
    return this._answerBtns.reduce((indexes, btn, index) => {
      if (btn.checked) {
        indexes.push(index);
      }

      return indexes;
    }, []);
  }
}
