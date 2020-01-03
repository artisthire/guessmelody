
import {startGame} from '../controller.js';
import {getElementFromTemplate} from '../utilities.js';

// Шаблон разметки окна проигрыша в результате завершения времени игры
const failTimeTemplate = () => `<section class="result">
    <div class="result__logo"><img src="img/melody-logo.png" alt="Угадай мелодию" width="186" height="83"></div>
    <h2 class="result__title">Увы и ах!</h2>
    <p class="result__total result__total--fail">Время вышло! Вы не успели отгадать все мелодии</p>
    <button class="result__replay" type="button">Попробовать ещё раз</button>
  </section>`;

// Шаблон разметки окна проигрыша в результате превышения допустимого колличества ошибок
const failTriesTemplate = () => `<section class="result">
    <div class="result__logo"><img src="img/melody-logo.png" alt="Угадай мелодию" width="186" height="83"></div>
    <h2 class="result__title">Какая жалость!</h2>
    <p class="result__total result__total--fail">У вас закончились все попытки. Ничего, повезёт в следующий раз!</p>
    <button class="result__replay" type="button">Попробовать ещё раз</button>
  </section>`;

// Шаблон разметки окна выиграша
const resultSuccesTemplate = () => `<section class="result">
    <div class="result__logo"><img src="img/melody-logo.png" alt="Угадай мелодию" width="186" height="83"></div>
    <h2 class="result__title">Вы настоящий меломан!</h2>
    <p class="result__total">За 3 минуты и 25 секунд вы набрали 12 баллов (8 быстрых), совершив 3 ошибки</p>
    <p class="result__text">Вы заняли 2 место из 10. Это лучше чем у 80% игроков</p>
    <button class="result__replay" type="button">Сыграть ещё раз</button>
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
export default function getResultScreen(gameState, statistics, totalQuestions) {
  let resultScreenTemplate = null;

  // в зависимости от коллечества ответов добавленных в статистику и величины оставшегося времени
  // определеяем какой из окон результатов показывать
  if (statistics.length === totalQuestions && gameState.lastTime > 0) {
    resultScreenTemplate = resultSuccesTemplate();
  } else if (statistics.length !== totalQuestions && gameState.lastTime > 0) {
    resultScreenTemplate = failTriesTemplate();
  } else {
    resultScreenTemplate = failTimeTemplate();
  }

  // получаем и инициализируем DOM-элемент с результатом игры
  let resultScreenElement = getElementFromTemplate(resultScreenTemplate);
  resultScreenElement = initResultScreen(resultScreenElement);

  return resultScreenElement;
}
