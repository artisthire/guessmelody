/**
 * Модуль управления переключением игровыми экранами
 */
import getScreenWelcome from './templates/welcome.js';
import getLevelScreen from './templates/level-screen.js';
import showResultScreen from './templates/result.js';

import {gameState, questions} from './data/data.js';
import {initConfig} from './data/config.js';

import {saveAnswerStatistic, checkWrongAnswer, removeGameLife} from './process/process.js';

// контейнер, в котором отображаются все игровые окна
const screensContainer = document.querySelector('.main');

/**
 * Отображает игровой экран
 * @param {object} element - контейнер, содержащий разметку, сгенерированную на основе шаблонов игровых окон
 */
export function renderScreen(element) {
  // удаялем предыдущую разметку игрового окна
  screensContainer.textContent = '';
  // вставляются "дети", поскольку функция генерации разметки на основе тестовых шаблонов
  // возвращает элементы вставленные во временный контейнер <DIV>
  // поэтому элементы игровых окон из него нужно вынуть, чтобы не поламать стили CSS
  screensContainer.append(...element.children);
}

/**
 * Функция отображения следующего уровня игры
 * Вызывается после выбора пользователем ответов на текущем уровне игры
 * @param {array} selectedAnswerIndexes - порядковые индексы номеров ответов, которые были выбраны пользователем при ответе на предыдущий вопрос
 */
export function nextLevel(selectedAnswerIndexes) {
  // получаем номер уровня игры, который нужно отобразить
  const levelIndex = gameState.level;

  // если получены результаты ответов пользователя на предыдущий вопрос
  if (selectedAnswerIndexes) {
    // сохранить статистику ответов
    const answersVariants = questions[levelIndex - 1].answers;
    saveAnswerStatistic(selectedAnswerIndexes, 40 * 1000, answersVariants);

    // проверяем, были ли допушены ошибки в ответах на предыдущем уровне игры
    if (checkWrongAnswer(selectedAnswerIndexes, answersVariants)) {
      removeGameLife();
    }

    // проверяем, не закончилась ли игра
    const endCode = checkGameEndStatus();
    // если игра окончена, не переключаемся на следующий уровень
    // а отображаем окно с результатами игры
    if (endCode !== initConfig.gameEndCode['run']) {
      showResultScreen(endCode, gameState);
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
  // инициализация начальных параметров игры
  initGameState();
  // показ стартового окна игры
  renderScreen(getScreenWelcome());
}

/**
 * Инициализирует объект состояния игры в соответствии со стартовой конфигурацией
 */
function initGameState() {
  gameState.level = initConfig.initLevel;
  gameState.lastTime = initConfig.totalTime;
  gameState.wrongAnswer = 0;
  gameState.statistics = [];
  gameState.endCode = initConfig.gameEndCode['run'];
  gameState.totalQuestions = questions.length;
}

/**
 * Проверяет и возвращает код состояния завершения игры
 * Если игра продолжается, обновляет и возвращает соответствующий код
 * Если игра окончена, обновляет и возвращает соответствующий причине окончания код завершения игры
 * @return {number} - числов соответствующие коду завершения или продолжения игры, см. объект initConfig.gameEndCode
 */
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

  // обновляем состояние игры
  gameState.endCode = endCode;

  return endCode;
}
