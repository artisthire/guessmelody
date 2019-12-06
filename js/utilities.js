/**
 * Модуль с общими функциями, используемыми другими модулями
 */

/**
 * На основе текстового HTML-шаблона возвращает массив с элементами DOM
 * @param {string} template - шаблон разметки HTML в виде строки
 * @return {object} - контейнер с элементами из шаблона
 */
export function getElementFromTemplate(template) {
  const container = document.createElement('div');
  container.insertAdjacentHTML('afterbegin', template);

  return container;
}

// контейнер, в котором отображаются все игровые окна
const screensContainer = document.querySelector('.main');

/**
 * Показывает игровой экран
 * @param {array} nodes - массив DOM-элементов с HTML-разметкой для соотвествующего игрового окна
 */
export function showGameScreen(container) {
  screensContainer.textContent = '';

  screensContainer.append(...container.children);
}

