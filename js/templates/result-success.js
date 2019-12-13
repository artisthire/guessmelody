/**
 * Модуль шаблона разметки для окна выиграша
 */
import {startGame} from '../controller.js';
import {getElementFromTemplate} from '../utilities.js';

const resultSuccesTemplate = `<section class="result">
    <div class="result__logo"><img src="img/melody-logo.png" alt="Угадай мелодию" width="186" height="83"></div>
    <h2 class="result__title">Вы настоящий меломан!</h2>
    <p class="result__total">За 3 минуты и 25 секунд вы набрали 12 баллов (8 быстрых), совершив 3 ошибки</p>
    <p class="result__text">Вы заняли 2 место из 10. Это лучше чем у 80% игроков</p>
    <button class="result__replay" type="button">Сыграть ещё раз</button>
  </section>`;

const resultSuccesScreen = getElementFromTemplate(resultSuccesTemplate);

/**
 * Функция инициализации DOM-элементов игрового окна
 * @param {object} container - DOM-элемент контейнер, содержащий DOM разметку, сгенерированную на основе шаблона
 * @return {object} - DOM-элемент контейнер с разметкой игрового окна, над которым выполнена инциализация (добавлены обработчики событий)
 */
function initScreenResultSucces(container) {
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

export default {container: resultSuccesScreen, initFunction: initScreenResultSucces};
