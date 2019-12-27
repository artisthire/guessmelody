/**
 * Модуль шаблона разметки для окна выбора артиста
 */
import {getElementFromTemplate, getRandomIntInclusive} from '../utilities.js';
import {showGameScreen, startGame} from '../controller.js';
import screenResultSuccess from './result-success.js';
import screenFailTime from './fail-time.js';
import screenFailTries from './fail-tries.js';
import {questions} from '../data/data.js';

const screenHeader = `<section class="game game--artist">
    <header class="game__header">
      <a class="game__back" href="#">
        <span class="visually-hidden">Сыграть ещё раз</span>
        <img class="game__logo" src="/img/melody-logo-ginger.png" alt="Угадай мелодию">
      </a>

      <svg xmlns="http://www.w3.org/2000/svg" class="timer" viewBox="0 0 780 780">
        <circle class="timer__line" cx="390" cy="390" r="370" style="filter: url(.#blur); transform: rotate(-90deg) scaleY(-1); transform-origin: center">
      </svg>

      <div class="timer__value" xmlns="http://www.w3.org/1999/xhtml">
        <span class="timer__mins">05</span>
        <span class="timer__dots">:</span>
        <span class="timer__secs">00</span>
      </div>

      <div class="game__mistakes">
        <div class="wrong"></div>
        <div class="wrong"></div>
        <div class="wrong"></div>
      </div>
    </header>`;

const screenBody = ((question) => `<section class="game__screen">
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
</section>`)(questions[9]);

const selectArtistScreen = getElementFromTemplate(screenHeader + screenBody);

/**
 * Функция инициализации DOM-элементов игрового окна
 * @param {object} container - DOM-элемент контейнер, содержащий DOM разметку, сгенерированную на основе шаблона
 * @return {object} - DOM-элемент контейнер с разметкой игрового окна, над которым выполнена инциализация (добавлены обработчики событий)
 */
function initScreenSelectArtist(container) {
  const form = container.querySelector('.game__artist');
  const selectBtns = [...container.querySelectorAll('.artist__input')];
  const backBtn = container.querySelector('.game__back');

  // при клике на любую из кнопок ответов, показать окно с результатом игры
  form.addEventListener('click', onSelectBtnClick);
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

  /**
   * Обработчик события клика на одину из кнопок ответа на выбор исполнителя песни
   * @param {object} evt - объект события клика на кнопку ответа
   */
  function onSelectBtnClick(evt) {
    const target = evt.target;

    if (!selectBtns.includes(target)) {
      return;
    }

    // временно отображается случайное окно с выиграшем или проиграшем
    showGameScreen(getRandomResultScreen());
  }

  /**
   * Временная функция, возвращающая одно случайное окно: выиграш, проиграш по времени или по попыткам
   * @return {object} - шаблон с разметкой для случайного окна результата игры
   */
  function getRandomResultScreen() {
    const resultScreens = [screenResultSuccess, screenFailTime, screenFailTries];

    return resultScreens[getRandomIntInclusive(0, resultScreens.length - 1)];
  }
}

export default {container: selectArtistScreen, initFunction: initScreenSelectArtist};
