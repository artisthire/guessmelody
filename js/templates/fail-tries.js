/**
 * Модуль шаблона разметки для окна выиграша
 */
import {getElementFromTemplate} from '../utilities.js';
import {replayGame} from '../controller.js';

const failTriesTemplate = `<section class="result">
    <div class="result__logo"><img src="img/melody-logo.png" alt="Угадай мелодию" width="186" height="83"></div>
    <h2 class="result__title">Какая жалость!</h2>
    <p class="result__total result__total--fail">У вас закончились все попытки. Ничего, повезёт в следующий раз!</p>
    <button class="result__replay" type="button">Попробовать ещё раз</button>
  </section>`;

const container = getElementFromTemplate(failTriesTemplate);
const replayBtn = container.querySelector('.result__replay');

replayBtn.addEventListener('click', onReplayBtnClick);

/**
 * Обработчик события клика на кнопку перезапуска игрны
 * @param {object} evt - объект события клика на кнопку
 */
function onReplayBtnClick(evt) {
  evt.preventDefault();
  replayGame();
}

export default container;
