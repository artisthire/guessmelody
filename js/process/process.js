import {initConfig, statisticConfig} from '../data/config.js';
import {gameState, levelResult} from '../data/data.js';

// управление колличеством игровых жизней
export const gameLife = {
  currentLife: initConfig.tries,
  get life() {
    return this.currentLife;
  },
  set life(count) {
    this.currentLife = count;
  },
  remove() {
    if (this.currentLife < 0) {
      return -1;
    }

    return this.currentLife--;
  }
};

// дает информацию о скорости ответа пользователя на вопрос ("быстрый" или "медленный" ответ с точки зрения игровой логики)
export const levelSpeed = {
  setStartTimer() {
    this.startTime = new Date().getTime();
  },
  getAnswerSpeed() {
    return (new Date().getTime() - this.startTime) <= statisticConfig.limitTime;
  }
};

function saveAnswerStatistic(selectedAnswerIndexes, levelTime, levelAnswers) {
  const selectedAnswers = selectedAnswerIndexes.map((answerIndex) => levelAnswers[answerIndex]);

  const currentLevelResult = Object.assign({}, levelResult);
  currentLevelResult.answers = selectedAnswers;
  currentLevelResult.time = levelTime;

  gameState.statistics.push(currentLevelResult);

  return currentLevelResult.answers;
}

function checkUserAnswers(selectedAnswers) {
  const hasWrongAnswer = !!selectedAnswers.find((answer) => !answer.isCorrect);

  return hasWrongAnswer;
}

export function updateGameState(selectedAnswerIndexes, levelTime, levelAnswers) {
  const selectedAnswers = saveAnswerStatistic(selectedAnswerIndexes, levelTime, levelAnswers);
  return checkUserAnswers(selectedAnswers);
}
