/**
 * Модуль управления переключением игровых экранов
 */
import getScreenWelcome from './templates/welcome.js';
import getLevelScreen from './templates/level-screen.js';

import screenResultSuccess from './templates/result-success.js';
import screenFailTime from './templates/fail-time.js';
import screenFailTries from './templates/fail-tries.js';

import {getRandomIntInclusive} from './utilities.js';
import {gameState, questions} from './data/data.js';
import {initConfig} from './data/config.js';

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

export function nextLevel() {
  // получаем номер уровня игры
  const levelIndex = gameState.level;

  // если все уровни игры пройдены
  if (levelIndex >= questions.length) {
    // TODO: доделать получения окна с результатами на основе итогов игры
    showGameScreen(getRandomResultScreen());
    return;
  }

  // увеличиваем номер текущего уровня
  gameState.level++;
  // получаем данные по вопросу для текущего уровня
  const question = questions[levelIndex];

  renderScreen(getLevelScreen(gameState, question));
}

function clearGameScreen() {
  screensContainer.textContent = '';
}

/**
 * Запускает стартовый экран игры
 */
export function startGame() {
  gameState.level = initConfig.initLevel;
  gameState.currentTime = initConfig.totalTime;
  gameState.wrongAnswer = 0;
  gameState.statistics = [];

  clearGameScreen();
  renderScreen(getScreenWelcome());
}


/**
 * Временная функция, возвращающая одно случайное окно: выиграш, проиграш по времени или по попыткам
 * @return {object} - шаблон с разметкой для случайного окна результата игры
 */
function getRandomResultScreen() {
  const resultScreens = [screenResultSuccess, screenFailTime, screenFailTries];

  return resultScreens[getRandomIntInclusive(0, resultScreens.length - 1)];
}


