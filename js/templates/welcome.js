/**
 * Модуль шаблона разметки для стартового окна
 */
import {showGameScreen} from '../controller.js';
import screenSelectGenre from './game-genre.js';

// шаблон игрового окна
const welcomTemplate = `<section class="welcome">
    <div class="welcome__logo"><img src="img/melody-logo.png" alt="Угадай мелодию" width="186" height="83"></div>
    <button class="welcome__button"><span class="visually-hidden">Начать игру</span></button>
    <h2 class="welcome__rules-title">Правила игры</h2>
    <p class="welcome__text">Правила просты:</p>
    <ul class="welcome__rules-list">
      <li>За 5 минут нужно ответить на все вопросы.</li>
      <li>Можно допустить 3 ошибки.</li>
    </ul>
    <p class="welcome__text">Удачи!</p>
  </section>`;

/**
 * Функция инициализации DOM-элементов игрового окна
 * @param {object} container - DOM-элемент контейнер, содержащий DOM разметку, сгенерированную на основе шаблона
 * @return {object} - DOM-элемент контейнер с разметкой игрового окна, над которым выполнена инциализация (добавлены обработчики событий)
 */
function initScreenWelcom(container) {
  const playBtn = container.querySelector('.welcome__button');

  // при клике на кнопку "Играть" показать первый экран игры
  playBtn.addEventListener('click', onPlayBtnClick);

  /**
   * Обработчик события клика на кнопку начала игры
   * @param {object} evt - объект события клика на кнопку
   */
  function onPlayBtnClick(evt) {
    evt.preventDefault();
    showGameScreen(screenSelectGenre);
  }

  return container;
}

export default {template: welcomTemplate, initFunction: initScreenWelcom};
