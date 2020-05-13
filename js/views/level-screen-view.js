/**
 * Модуль содержит класс LevelScreenView
 * Который содержит представление для экранов уровней игры
 */

import AbstractView from './abstract-view.js';
import TrackContoller from '../process/tracks-controller.js';

import {DEBUG_MODE} from '../data/config.js';

const DEBUG_STYLE = 'outline: 2px solid red';

// шаблон разметки игрового уровня на выбор Артиста по аудиотреку
const selectArtistTemplate = (question) => `<section class="game game--artist">
  <section class="game__screen">
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
        <img class="artist__picture" src="${answer.img}" alt="${answer.artist}" style="${(answer.isCorrect && DEBUG_MODE) ? DEBUG_STYLE : ''}">
        ${answer.artist}
      </label>
    </div>`
  ).join('')}

    </form>
  </section>
</section>`;

// шаблон разметки игрового уровня на выбор Жанра аудиотреков
const selectGenreTemplate = (question) => `<section class="game game--artist">
  <section class="game__screen">
    <h2 class="game__title">${question.title}</h2>
    <form class="game__tracks">

      ${question.answers.map((answer, index) =>
    `<div class="track">
      <button class="track__button ${index === 0 ? 'track__button--pause' : 'track__button--play'}" type="button"></button>
      <div class="track__status">
        <audio src=${answer.src} ${index === 0 ? 'autoplay' : ''}></audio>
      </div>
      <div class="game__answer" style="${(answer.isCorrect && DEBUG_MODE) ? DEBUG_STYLE : ''}">
        <input class="game__input visually-hidden" type="checkbox" name="answer" value="${answer.artist}" id="answer-${index + 1}">
        <label class="game__check" for="answer-${index + 1}">Отметить</label>
      </div>
    </div>`).join('')}

      <button class="game__submit button" type="submit" disabled>Ответить</button>
    </form>
  </section>
</section>`;

export default class LevelScreenView extends AbstractView {

  constructor(levelQuestion) {
    super();
    this.levelQuestion = levelQuestion;

    this.trackController = new TrackContoller(this.element);

    // содержит признак выбора одного из ответов
    // по нему разрешается переход на следующий уровень игры
    this._isAnswerSelected = false;
  }

  /**
   * Возвращает массив булевых значений, которые указывают был ли выбран соответствующий по порядку ответ из предоставленных вариантов
   * @return {array} - массив булевых значений, где каждому из вариантов ответов по порядку устанавливается признак был ли он выбран пользователем
   */
  get answersSelected() {
    return this._answerBtns.map((btn) => btn.checked);
  }

  /**
   * Переопределение абстрактного метода родителя
   * Возвращает строку с шаблоном разметки окна игрового уровня
   * В зависимости от типа вопросов на уровне (на выбор Артиста или Жанра)
   */
  get _template() {
    // по типу полученных вопросов выбрать соответствующий шаблон разметки
    return (this.levelQuestion.type === 'artist') ? selectArtistTemplate(this.levelQuestion) : selectGenreTemplate(this.levelQuestion);
  }

  /**
   * Обработчик выбора ответа и переходна на следующий уровень
   * Должен быть переопределен для правильной реакции на переход на следующий уровень
   */
  onAnswerSubmit() {
  }

  /**
   * Переопределение метода родителя
   * Навешивает соответствующие обработчики на шаблон игрового окна
   * @param {object} container - DOM-элемент, содержащий разметку игрового окна
   * @return {object} - тот же DOM-элемент, к которому навешены нужные обработчики событий
   */
  _bind(container) {
    // в зависимости от типа вопросов, навешиваем обработчик для тела игрового окна
    return (this.levelQuestion.type === 'artist') ? this._bindScreenSelectArtist(container) : this._bindScreenSelectGenre(container);
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
      this._isAnswerSelected = true;

      // при клике на любую из кнопок вариантов ответов, выбор ответа подтверждается автоматически
      this.onAnswerSubmit();
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
      this._isAnswerSelected = !!this.answersSelected.find((select) => select === true);

      // разрешаем нажать кнопку "Ответ" если выбран хотя бы один из ответов
      btnSubmit.disabled = !this._isAnswerSelected;
    });

    form.addEventListener('submit', (evt) => {
      this._onFormSubmit(evt);
    });

    return container;
  }

  _onFormSubmit(evt) {
    evt.preventDefault();

    // ответ подтверждается, если выбран хотябы один из вариантов ответа
    if (this._isAnswerSelected) {
      this.onAnswerSubmit();
    }
  }
}
