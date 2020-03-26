/**
 * Модуль содержит функции управления игровы процессом
 */
import {GAME_PARAM} from '../data/config.js';
import {GAME_DATA} from '../data/data.js';
import {loadQuestions, loadStatistics} from '../network/server-communication.js';
import preloadResource from '../network/resouce-preloader.js';

import Application from '../application.js';
import ModalLoadAnimationView from '../views/modal-load-animatin-view.js';
import ModalErrorView from '../views/modal-error-view.js';
import {showScreen} from '../utilities.js';

/**
 * Проверяет был ли ответ на вопросы уровня быстрым или медленным
 * Скорость ответа сравнивается с заданным параметров в игре
 * @param {number} levelTime - скорость ответа на вопрос на текущем уровен игры
 * @return {boolean} - true - ответ дан быстро, false - медленно
 */
export function isFastAnswer(levelTime) {
  return levelTime < GAME_PARAM.limitTime;
}

/**
 * Сравнивает выбранные пользователем ответы с доступными вариантами ответов на текущем уровне игры
 * Возвращает результат, была ли ошибка при ответах
 * @param {array} selectedAnswers - массив boolean значений, где true - DOM-элемент варианта ответа был выбран пользователем
 * @param {array} levelAnswers - варианты ответов, которые были доспупны на текущем уровне
 * @return {boolean} - true - ответы содержат неправильные варианты, false - все ответы правильные
 */
export function hasWrongAnswer(selectedAnswers, levelAnswers) {
  // ищет первый правильный варинат ответа, который не был выбран пользователем
  const wrongAnswer = levelAnswers.find((levelAnswer, index) => levelAnswer.isCorrect !== selectedAnswers[index]);

  return wrongAnswer !== undefined;
}

/**
 * Функция сопоставляет ответы выбранные пользователем со всеми вариантами доступных ответов
 * И из всех доступных варинатов возвращает только те, что выбрал пользователь
 * @param {array} selectedAnswers - массив boolean значений, где true - DOM-элемент варианта ответа был выбран пользователем
 * @param {array} levelAnswers - варианты ответов, которые были доспупны на текущем уровне
 * @return {array} - массив ответов, которые были выбраны пользователем
 */
export function getSelectedAnswers(selectedAnswers, levelAnswers) {
  return levelAnswers.filter((_, index) => selectedAnswers[index]);
}

export function restartGame() {
  const loadAnimationElement = new ModalLoadAnimationView().element;

  showScreen(loadAnimationElement, false);

  // предзагрузка ресуров для игры:
  Promise.all([loadQuestions(), loadStatistics()])
  .then((gameData) => {
    GAME_DATA.questions = gameData[0];
    GAME_DATA.statistics = gameData[1];
    return gameData[0];
  })
  .then((questions) => preloadResource(questions))
  // в любом случае убираем анимацию процесса загрузки
  .finally(() => loadAnimationElement.remove())
  // при успешной загрузке стартуем игру
  .then(() => Application.showStart())
  // в случае ошибок, игру не стартуем, а показываем экран ошибки
  .catch(() => showScreen(new ModalErrorView().element, false));
}
