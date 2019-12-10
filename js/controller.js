/**
 * Модуль управления переключением игровых экранов
 */
import screenWelcom from './templates/welcome.js';
import {getElementFromTemplate} from './utilities.js';

// контейнер, в котором отображаются все игровые окна
const screensContainer = document.querySelector('.main');

/**
 * Отображает игровой экран
 * @param {object} screen - объект, содержищий:
 *  screen.template - строка-шаблон HTML-разметки игрового окна
 *  screen.initFunction - функция инициализации DOM-элементов, сгенерированных на основе шаблона
 */
export function showGameScreen(screen) {
  const container = initGameScreen(screen);

  // обновить содержимое общего контейнера для игровых окон
  screensContainer.textContent = '';
  screensContainer.append(...container.children);
}

/**
 * На основе шаблона игрового окна и функции инициализации генерирует DOM-элемент контейнер
 * и проводит инициализацию обработчиков внутри элементов игрового окна, созданных по шаблону
 * @param {string} template - строка-шаблон разметки игрового окна
 * @param {function} initFunction - функция инициализации DOM-элементов игрового окна, созданных на основе шаблона
 * @return {object} - DOM-элемент контейнер с разметкой игрового окна и инициализированными функционалом
 */
function initGameScreen({template, initFunction}) {
  // получить временный контейнер с DOM-элементами на основе переданного шаблона разметки
  let container = getElementFromTemplate(template);
  // выполнить инициализацию элементов внутри внеменного контейнера
  container = initFunction(container);

  return container;
}

/**
 * Запускает стартовый экран игры
 */
export function startGame() {
  showGameScreen(screenWelcom);
}


