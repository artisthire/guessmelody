/**
 * Модуль управления переключением игровых экранов
 */
import getScreenWelcome from './templates/welcome.js';
import getLevelScreen from './templates/level-screen.js';
import getResultScreen from './templates/result.js';

import {gameState, questions} from './data/data.js';
import {initConfig} from './data/config.js';

import {saveAnswerStatistic, checkWrongAnswer, removeGameLife} from './process/process.js';
import {getGameEndMessage} from './data/statistics.js';

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
    const answersVariants = questions[levelIndex - 1].answers;
    saveAnswerStatistic(selectedAnswerIndexes, 40 * 1000, answersVariants);

    // проверяем, были ли допушены ошибки в ответах на предыдущем уровне игры
    if (checkWrongAnswer(selectedAnswerIndexes, answersVariants)) {
      removeGameLife();
    }

    // если игра окончена, не переключаемся на следующий уровень
    if (checkGameEndStatus() !== initConfig.gameEndCode['run']) {
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
  initGameState();

  screensContainer.textContent = '';
  renderScreen(getScreenWelcome());
}

// инициализация начального состояния игры
function initGameState() {
  gameState.level = initConfig.initLevel;
  gameState.lastTime = initConfig.totalTime;
  gameState.wrongAnswer = 0;
  gameState.statistics = [];
  gameState.endCode = initConfig.gameEndCode['run'];
  gameState.totalQuestions = questions.length;
}

function checkGameEndStatus() {
  let endCode = initConfig.gameEndCode['run'];

  // проверяем статус завершения игры в зависимости от правил
  // устанавливаем соответствующий код завершения игры
  if (gameState.wrongAnswer === -1) {
    endCode = initConfig.gameEndCode['failTries'];
  }

  if (gameState.lastTime <= 0) {
    endCode = initConfig.gameEndCode['failTime'];
  }

  if (gameState.level === gameState.totalQuestions) {
    endCode = initConfig.gameEndCode['complete'];
  }

  // если выполнено одно из условий завершения игры, отображаем экран с результатом игры
  if (endCode !== initConfig.gameEndCode['run']) {
    const endMessage = getGameEndMessage(endCode, gameState);

    renderScreen(getResultScreen(endMessage));
  }

  // обновляем состояние игры
  gameState.endCode = endCode;

  return endCode;
}
