/**
 * Модуль шаблона разметки для стартового окна
 */
import {getElementFromTemplate, showGameScreen} from '../utilities.js';
import screenSelectGenre from './game-genre.js';

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

const container = getElementFromTemplate(welcomTemplate);
const playBtn = container.querySelector('.welcome__button');

// при клике на кнопку "Играть" показать первый экран игры
playBtn.addEventListener('click', onPlayBtnClick);

function onPlayBtnClick(evt) {
  evt.preventDefault();
  showGameScreen(screenSelectGenre);
}

export default container;
