
import {startGame} from '../controller.js';
import {getElementFromTemplate} from '../utilities.js';

// Шаблон разметки окна проигрыша в результате завершения времени игры
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

// TODO: доделать передачу окна результата в контроллер
export default function getResultScreen(message) {

  // получаем и инициализируем DOM-элемент с результатом игры
  let resultScreenElement = getElementFromTemplate(resultScreenTemplate(message));
  resultScreenElement = initResultScreen(resultScreenElement);

  return resultScreenElement;
}
