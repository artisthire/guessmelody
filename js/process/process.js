/**
 * Модуль содержит функции управления игровы процессом
 */
import {GAME_DATA} from '../data/data.js';
import {loadQuestions, loadStatistics} from '../network/server-communication.js';
import preloadResource from '../network/resouce-preloader.js';

import Application from '../application.js';
import ModalLoadAnimationView from '../views/modal-load-animatin-view.js';
import ModalErrorView from '../views/modal-error-view.js';
import {showScreen} from '../utilities.js';

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

/**
 * Функция старта новой игры
 * Скачивает и предзагружает ресурсы для игры
 * В случае успешной загрузки с сервера - показывает стартовое окно
 * В случае ошибок взаимодействия по сети - окно ошибки
 */
export function startNewGame() {
  // представление модального окна анимации загрузки ресурсов
  const loadAnimationElement = new ModalLoadAnimationView().element;
  showScreen(loadAnimationElement, false);

  // предзагрузка ресуров для игры:
  // 1. Загрузка вопросов и статистики предыдущих игор
  Promise.all([loadQuestions(), loadStatistics()])
  .then((gameData) => {
    GAME_DATA.questions = gameData[0];
    GAME_DATA.statistics = gameData[1];
    return gameData[0];
  })
  // 2. Презагрузка аудиофайлов и картинок
  .then((questions) => preloadResource(questions))
  // в любом случае убираем анимацию процесса загрузки
  .finally(() => loadAnimationElement.remove())
  // при успешной загрузке стартуем игру
  .then(() => Application.showStart())
  // в случае ошибок, игру не стартуем, а показываем экран ошибки
  .catch(() => showScreen(new ModalErrorView().element, false));
}
