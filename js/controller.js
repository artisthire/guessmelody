/**
 * Модуль управления переключением игровых экранов
 */

// контейнер, в котором отображаются все игровые окна
const screensContainer = document.querySelector('.main');

/**
 * Показывает игровой экран получая DOM-элемент, который содержит всю разметку, сгерериованную на основе шаблона
 * @param {object} container - временный элемент-контейнер, содержащий разметку игрового окна
 */
export function showGameScreen(container) {
  screensContainer.textContent = '';

  screensContainer.append(...container.children);
}

/**
 * Перезапускает игру
 */
export function replayGame() {
  // перезапуск путем перезагрузки страницы
  document.location.reload();
}


