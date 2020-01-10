/**
 * Модуль управления переключением игровых экранов
 */
import getScreenWelcome from './templates/welcome.js';
import getLevelScreen from './templates/level-screen.js';
import getResultScreen from './templates/result.js';

import {gameState, questions} from './data/data.js';
import {initConfig} from './data/config.js';

import {updateGameState} from './process/process.js';

// контейнер, в котором отображаются все игровые окна
const screensContainer = document.querySelector('.main');

/**
 * Отображает игровой экран
 * @param {object} screen - объект, содержищий:
 *  screen.container - DOM-элемент, сгенерированный на основе шаблона игрового окна
 *  screen.initFunction - функция инициализации DOM-элементов, сгенерированных на основе шаблона
 */
export function showGameScreen(screen) {
  // клонируем для того, поскольку вставка на страницу выймет элементы из переданного объекта screen
  // клонируем перед инициализацией, чтобы обработчики событий применились именно к клону
  let container = screen.container.cloneNode(true);
  // выполнить инициализацию элементов внутри внеменного контейнера
  container = screen.initFunction(container);
  // обновить содержимое общего контейнера для игровых окон
  screensContainer.textContent = '';
  screensContainer.append(...container.children);
}

// Должна заменить showGameScreen
function renderScreen(element, container = screensContainer) {
  // обновить содержимое общего контейнера для игровых окон
  container.textContent = '';
  container.append(...element.children);
}

export function nextLevel(selectedAnswerIndexes) {
  // получаем номер уровня игры
  const levelIndex = gameState.level;

  // если получены результаты ответов пользователя
  if (selectedAnswerIndexes) {
    console.log(updateGameState(selectedAnswerIndexes, 40 * 1000, questions[levelIndex - 1].answers));
    console.log(gameState);
  }

  // если достигнут последний уровень игры
  if (levelIndex === questions.length) {
    // TODO: доделать получения окна с результатами на основе итогов игры
    renderScreen(getResultScreen('success', gameState.statistics));
    return;
  }

  // получаем данные по вопросу для текущего уровня
  const question = questions[levelIndex];
  // отображаем текущий уровень игры
  renderScreen(getLevelScreen(gameState, question));
  // устанавливаем номер следующего уровня
  gameState.level++;
}

function clearGameScreen() {
  screensContainer.textContent = '';
}

/**
 * Запускает стартовый экран игры
 */
export function startGame() {
  gameState.level = initConfig.initLevel;
  gameState.lastTime = initConfig.totalTime;
  gameState.wrongAnswer = 0;
  gameState.statistics = [];

  clearGameScreen();
  renderScreen(getScreenWelcome());
}
