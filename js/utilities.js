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

/**
 * Возвращает колличество минут и секунд из времени, представленном в миллисекундах
 * Значения из одного символа дополняются до двузначного представления нулем в начале
 * @param {number} time - колличество миллисекунд
 * @return {array} - массив с колличеством минут и секунд
 */
export function getTimeComponents(time) {
  const date = new Date();
  date.setTime(time);
  const timeComponents = date.toLocaleTimeString('en-US', {hour12: false}).split(':');
  const minuts = timeComponents[1];
  const seconds = timeComponents[2];

  return [minuts, seconds];
}

/**
 * Функция склонения слов идущим за заданным числом
 * Например, 1 комментарИЙ, 2 комментарИЯ, 10 комментарИЕВ
 * @param {number} num - число, в соотвествии с которым нужно изменить окончание следующего за ним слова
 * @param {array} word - массив слов, которые идут за этим числом с соответствующими окончаниями
 *  массив должен быть со следующими словами [склонение слова для числа 1, склонение слова для числа 2, склонение слова для числа 0]
 * @return {string} - строка вида 'число слово_в_склоненни_соответствующего_числу'
 */
export function wordFrom(num, word) {
  num = +num;
  if (isNaN(num)) {
    return word[2];
  }

  const cases = [2, 0, 1, 1, 1, 2];
  return `${num} ${word[(num % 100 > 4 && num % 100 < 20) ? 2 : cases[(num % 10 < 5) ? num % 10 : 5]]}`;
}
