/**
 * Модуль шаблона разметки для окна выиграша
 */
import {getElementFromTemplate} from '../utilities.js';

const failTimeTemplate = `<section class="result">
    <div class="result__logo"><img src="img/melody-logo.png" alt="Угадай мелодию" width="186" height="83"></div>
    <h2 class="result__title">Увы и ах!</h2>
    <p class="result__total result__total--fail">Время вышло! Вы не успели отгадать все мелодии</p>
    <button class="result__replay" type="button">Попробовать ещё раз</button>
  </section>`;

const container = getElementFromTemplate(failTimeTemplate);
const replayBtn = container.querySelector('.result__replay');

replayBtn.addEventListener('click', onReplayBtnClick);

/**
 * Обработчик события клика на кнопку перезапуска игрны
 * @param {object} evt - объект события клика на кнопку
 */
function onReplayBtnClick(evt) {
  evt.preventDefault();
  // используется для перезапуска
  document.location.reload();
}

export default container;
