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
 * Показывает игровой экран получая DOM-элемент, который содержит всю разметку, сгерериованную на основе шаблона
 * @param {object} container - временный элемент-контейнер, содержащий разметку игрового окна
 */
export function showGameScreen(container) {
  screensContainer.textContent = '';

  screensContainer.append(...container.children);
}

/**
 * Возвращает случайное целое число в заданном диапазоне min-max включая обе границы
 * @param {number} min - нижний предел диапазона в котором генерируется случайное число
 * @param {number} max - верхний предел диапазона в котором генерируется случайное число
 * @return {number} - псевдослучайное число в заданном диапазоне
 */
export function getRandomIntInclusive(min = 0, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; // Максимум и минимум включаются
}