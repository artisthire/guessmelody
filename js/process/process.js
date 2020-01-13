import {initConfig, statisticConfig} from '../data/config.js';
import {gameState, levelResult} from '../data/data.js';

// управление колличеством игровых жизней
export function removeGameLife() {
  // если превышено колличество ошибочных ответов
  if (gameState.wrongAnswer === initConfig.totalTries) {
    gameState.wrongAnswer = -1;
    return -1;
  }

  // иначе увеличиваем число ошибочных отоветов
  return ++gameState.wrongAnswer;
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

export function saveAnswerStatistic(selectedAnswerIndexes, levelTime, levelAnswers) {
  const selectedAnswers = selectedAnswerIndexes.map((answerIndex) => levelAnswers[answerIndex]);

  const currentLevelResult = Object.assign({}, levelResult);
  currentLevelResult.answers = selectedAnswers;
  currentLevelResult.time = levelTime;

  gameState.statistics.push(currentLevelResult);
}

export function checkWrongAnswer(selectedAnswerIndexes, levelAnswers) {

  const trueAnswersIndexes = levelAnswers.reduce((indexes, answer, index) => {
    if (answer.isCorrect) {
      indexes.push(index);
    }
    return indexes;
  }, []);

  // ответы неправильные, если колличество выбранных варинатов не соответствует колличеству правильных ответов
  if (selectedAnswerIndexes.length !== trueAnswersIndexes.length) {
    return true;
  }

  // ответы неправильные, если индекса правильных ответов нет в индексах выбранных ответов
  const hasWrongAnswer = isFinite(trueAnswersIndexes.find((trueAnswerIndex) => !selectedAnswerIndexes.includes(trueAnswerIndex)));

  return hasWrongAnswer;
}
