/**
 * Модуль управления переключением игровых экранов
 */
import screenWelcom from './templates/welcome.js';

import levelHeader from './templates/level-header.js';
import selectArtistLevel from './templates/game-artist.js';
import selectGenreLevel from './templates/game-genre.js';

import screenResultSuccess from './templates/result-success.js';
import screenFailTime from './templates/fail-time.js';
import screenFailTries from './templates/fail-tries.js';

import {getElementFromTemplate, getRandomIntInclusive} from './utilities.js';
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
function renderScreen(container, data, screen) {
  const template = screen.template(data);
  const element = getElementFromTemplate(template);
  // клонируем для того, поскольку вставка на страницу выймет элементы из переданного объекта screen
  // клонируем перед инициализацией, чтобы обработчики событий применились именно к клону
  let clone = element.cloneNode(true);
  // выполнить инициализацию элементов внутри внеменного контейнера
  clone = screen.initFunction(clone);
  const children = [...clone.children];
  // обновить содержимое общего контейнера для игровых окон
  container.append(...children);

  return children;
}

// хранит ссылки на элементы с разметкой вопроса на предыдущем уровне игры
// обновляется при переключении уровней
let previousLevelElements = null;
let levelContainer = null;

export function nextLevel() {
  // получаем номер уровня игры
  const levelIndex = gameState.level;

  // если все уровни игры пройдены
  if (levelIndex >= questions.length) {
    // временно отображается случайное окно с выиграшем или проиграшем
    showGameScreen(getRandomResultScreen());
    return;
  }

  // увеличиваем номер текущего уровня
  gameState.level++;
  // получаем данные по вопросу для текущего уровня
  const question = questions[levelIndex];

  // если это первый уровень, добавляем разметку для общего заголовка всех уровней
  if (levelIndex === initConfig.initLevel) {
    clearGameScreen();
    // контейнер, куда будут записываться вопросы для текущего уровня
    levelContainer = renderScreen(screensContainer, gameState, levelHeader)[0];
  } else if (previousLevelElements) {
    // если уровень не первый удаляем все элементы связанные с разметкой вопроса (без элементов общего заголовка уровней)
    // т.к. общий заголовок останется, а будет меняться только разметка вопроса с вариантами ответов
    previousLevelElements.forEach((element) => element.remove());
  }

  // в зависимости от типа игрового уровня, отображаем вопрос
  if (question.type === 'artist') {
    previousLevelElements = renderScreen(levelContainer, question, selectArtistLevel);
  } else {
    previousLevelElements = renderScreen(levelContainer, question, selectGenreLevel);
  }
}

function clearGameScreen() {
  screensContainer.textContent = '';
}

/**
 * Запускает стартовый экран игры
 */
export function startGame() {
  gameState.level = initConfig.initLevel;
  gameState.lifes = initConfig.lifes;

  clearGameScreen();
  renderScreen(screensContainer, null, screenWelcom);
}


/**
 * Временная функция, возвращающая одно случайное окно: выиграш, проиграш по времени или по попыткам
 * @return {object} - шаблон с разметкой для случайного окна результата игры
 */
function getRandomResultScreen() {
  const resultScreens = [screenResultSuccess, screenFailTime, screenFailTries];

  return resultScreens[getRandomIntInclusive(0, resultScreens.length - 1)];
}


