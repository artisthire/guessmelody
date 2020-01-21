/**
 * Модуль содержит функции управления игровы процессом
 */

import {initConfig, statisticConfig} from '../data/config.js';
import {gameState, levelResult} from '../data/data.js';

/**
 * Функция уменьшает колличество оставшихся жизней (увеличивает колличество ошибочных ответов)
 * @return {number} - колличество ошибок
 */
export function removeGameLife() {
  // если превышено колличество ошибочных ответов возвращаем сигнал об окончании игровых жизней
  // иначе увеличиваем колличество ошибок
  if (gameState.wrongAnswer === initConfig.totalTries) {
    gameState.wrongAnswer = -1;
  } else {
    gameState.wrongAnswer++;
  }

  return gameState.wrongAnswer;
}

// дает информацию о скорости ответа пользователя на вопрос ("быстрый" или "медленный" ответ с точки зрения игровой логики)
export const levelSpeed = {
  setStartTimer() {
    this.startTime = new Date().getTime();
  },
  getAnswerSpeed() {
    return (new Date().getTime() - this.startTime) <= statisticConfig.limitTime;
  }
};

/**
 * Сохраняет статистику в общую структура данных о выбранных пользователем ответов по текущему уровню игры
 * @param {array} selectedAnswerIndexes - порядковые индесы номеров выбранных пользователем ответов (передаются при переключении на следующий уровень)
 * @param {number} levelTime - колличество миллисекунд, потраченных на ответ пользователя на текущем уровне игры
 * @param {array} levelAnswers - все варианты ответов, которые были доспупны на текущем уровне
 */
export function saveAnswerStatistic(selectedAnswerIndexes, levelTime, levelAnswers) {
  const selectedAnswers = selectedAnswerIndexes.map((answerIndex) => levelAnswers[answerIndex]);

  const currentLevelResult = Object.assign({}, levelResult);
  currentLevelResult.answers = selectedAnswers;
  currentLevelResult.time = levelTime;

  gameState.statistics.push(currentLevelResult);
}

/**
 * Сравнивает выбранные пользователем ответы с доступными вариантами ответов на текущем уровне игры
 * Возвращает результат, была ли ошибка при ответах
 * @param {array} selectedAnswerIndexes - порядковые индесы номеров выбранных пользователем ответов
 * @param {array} levelAnswers - все варианты ответов, которые были доспупны на текущем уровне
 * @return {boolean} - true - ответы содержать неправильные варианты, false - все ответы правильные
 */
export function checkWrongAnswer(selectedAnswerIndexes, levelAnswers) {
  // получить порядковые идексы правильных вариантов ответов из общего массива вариантов ответов
  const trueAnswersIndexes = levelAnswers.reduce((indexes, answer, index) => {
    if (answer.isCorrect) {
      indexes.push(index);
    }
    return indexes;
  }, []);

  // допущена ошибка, если колличество выбранных варинатов не соответствует колличеству правильных ответов
  if (selectedAnswerIndexes.length !== trueAnswersIndexes.length) {
    return true;
  }

  // допущена ошибка, если в выбранных ответах есть неправильные
  const hasWrongAnswer = isFinite(trueAnswersIndexes.find((trueAnswerIndex) => !selectedAnswerIndexes.includes(trueAnswerIndex)));

  return hasWrongAnswer;
}
