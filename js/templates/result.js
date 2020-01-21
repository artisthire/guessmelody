/**
 * Модуль содержит шаблон разметки и функцию инициализации финального окна с результатом игры
 */
import {startGame} from '../controller.js';
import {getGameEndMessage} from '../data/statistics.js';
import {getElementFromTemplate} from '../utilities.js';

// Общий шаблон разметки окна с результатом игры
const resultScreenTemplate = (message) => `<section class="result">
    <div class="result__logo"><img src="img/melody-logo.png" alt="Угадай мелодию" width="186" height="83"></div>
    ${message}
    <button class="result__replay" type="button">Попробовать ещё раз</button>
  </section>`;

/**
 * Функция инициализации обработчиков окна результатов игры
 * @param {object} container - DOM-элемент контейнер, содержащий DOM разметку, сгенерированную на основе шаблона
 * @return {object} - DOM-элемент контейнер с разметкой игрового окна, над которым выполнена инциализация (добавлены обработчики событий)
 */
function initResultScreen(container) {
  // добавить обработчик рестарта игры
  const replayBtn = container.querySelector('.result__replay');
  replayBtn.addEventListener('click', onReplayBtnClick);

  return container;

  /**
   * Обработчик события клика на кнопку перезапуска игрны
   * @param {object} evt - объект события клика на кнопку
   */
  function onReplayBtnClick(evt) {
    evt.preventDefault();
    startGame();
  }
}

/**
 * Функция генерации разметки окна результатов игры и добавления к нему соответствующих обработчиков
 * @param {number} endCode - числовой код, соответствующий статусу завершения игры, см. объект initConfig.gameEndCode
 * @param {object} gameState - объект, хранящий состояние игрового процесса (время, колличество ошибок и т.д.)
 * @return {object} - DOM-элемент контейнер с разметкой окна результатов игры, над которым выполнена инциализация (добавлены обработчики событий)
 */
export default function getResultScreen(endCode, gameState) {
  // по коду завершения игры получить шаблон разметки сообщения об окончании игры
  const endMessage = getGameEndMessage(endCode, gameState);

  // получаем и инициализируем DOM-элемент с результатом игры
  let resultScreenElement = getElementFromTemplate(resultScreenTemplate(endMessage));
  resultScreenElement = initResultScreen(resultScreenElement);

  return resultScreenElement;
}
