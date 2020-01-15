/**
 * Модуль управления переключением игровых экранов
 */
import getScreenWelcome from './templates/welcome.js';
import getLevelScreen from './templates/level-screen.js';
import getResultScreen from './templates/result.js';

import {gameState, questions} from './data/data.js';
import {initConfig} from './data/config.js';

import {saveAnswerStatistic, checkWrongAnswer, removeGameLife} from './process/process.js';

// контейнер, в котором отображаются все игровые окна
const screensContainer = document.querySelector('.main');

/**
 * Отображает игровой экран
 * @param {object} element - контейнер с DOM-элементами для добавления в HTML-разметку
 * @param {object} container - ссылка на элементв в общей разметки игры, внутри которого отображаются игровые окна
 */
function renderScreen(element, container = screensContainer) {
  // обновить содержимое общего контейнера для игровых окон
  container.textContent = '';
  container.append(...element.children);
}

export function nextLevel(selectedAnswerIndexes) {

  // получаем номер уровня игры
  const levelIndex = gameState.level;

  // если получены результаты ответов пользователя на предыдущий вопрос
  if (selectedAnswerIndexes) {
    const prevLevelAnswers = questions[levelIndex - 1].answers;
    saveAnswerStatistic(selectedAnswerIndexes, 40 * 1000, prevLevelAnswers);

    // проверяем, были ли допушены ошибки в ответах на предыдущем уровне игры
    if (checkWrongAnswer(selectedAnswerIndexes, prevLevelAnswers)) {
      removeGameLife();
    }

    // если игра успешно или неуспешно окончена, не переключаемся на следующий уровень
    if (checkGameEndStatus() !== 0) {
      return;
    }
  }

  // получаем данные по вопросу для текущего уровня
  const question = questions[levelIndex];
  // отображаем текущий уровень игры
  renderScreen(getLevelScreen(gameState, question));
  // устанавливаем номер следующего уровня
  gameState.level++;
}

/**
 * Запускает стартовый экран игры
 */
export function startGame() {
  gameState.level = initConfig.initLevel;
  gameState.lastTime = initConfig.totalTime;
  gameState.wrongAnswer = 0;
  gameState.statistics = [];
  gameState.gameEndCode = initConfig.gameEndCode['run'];

  screensContainer.textContent = '';
  renderScreen(getScreenWelcome());
}


function checkGameEndStatus() {

  if (gameState.wrongAnswer === -1) {
    gameState.gameEndCode = initConfig.gameEndCode['failTries'];
    renderScreen(getResultScreen('failTries'));
  }

  if (gameState.lastTime <= 0) {
    gameState.gameEndCode = initConfig.gameEndCode['failTime'];
    renderScreen(getResultScreen('failTime'));
  }

  if (gameState.level === questions.length) {
    gameState.gameEndCode = initConfig.gameEndCode['complete'];
    renderScreen(getResultScreen('gameComplete', gameState.statistics));
  }

  return gameState.gameEndCode;
}
