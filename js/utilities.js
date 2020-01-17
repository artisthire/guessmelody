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
  container.innerHTML = template;

  return container;
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

export function getTimeComponents(time) {
  const date = new Date();
  date.setTime(time);
  const timeComponents = date.toLocaleTimeString('en-US', {hour12: false}).split(':');
  const minuts = timeComponents[1];
  const seconds = timeComponents[2];

  return [minuts, seconds];
}
