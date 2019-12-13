/**
 * Модуль управления переключением игровых экранов
 */
import screenWelcom from './templates/welcome.js';

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

/**
 * Запускает стартовый экран игры
 */
export function startGame() {
  showGameScreen(screenWelcom);
}


