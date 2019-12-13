/**
 * Модуль содержит функции подсчета и вывода результатов игры пользователем
 */

// время, при привышении которого ответ не считается быстрым
const LIMIT_TIME = 30;
// цена на быстрый, нормальный ответ и ошибку
const QUICK_RATIO = 2;
const CORRECT_RATIO = 1;
const FAIL_RATIO = -2;
// количество возможных ошибок (нот)
const TOTAL_NOTES = 2;

/**
 * Функция подсчета набранных игроком баллов
 * @param {array} answers - массив ответов и затраченного времени на каждый вопрос. Упорядочен последовательно по порядку вопросов
 *  каждый объект внутри массива содержит результат во вопросу в виде:
 *  [{result: true|false (правильный/неправильный ответ), time: {number} (секунд затраченных на ответ)}]
 * @param {number} notes - количество оставшихся жизней (в игре отображаются как "ноты")
 * @return {number} - количество набраных баллов
 */
export function calcUserResult(answers, notes) {

  // количество правильных ответов
  let successAnswer = 0;
  // количество быстрых ответов
  let quickAnswer = 0;

  answers.forEach((answer) => {
    // количество правильных ответов
    if (answer.result) {
      successAnswer++;
    }
    // количество "быстрых" ответов, выполненых ранее заданного предела
    if (answer.time < LIMIT_TIME) {
      quickAnswer++;
    }
  });

  // если ответом меньше 10
  if (successAnswer < 10) {
    return -1;
  }

  let rezult = quickAnswer * QUICK_RATIO + (successAnswer - quickAnswer) * CORRECT_RATIO + (TOTAL_NOTES - notes) * FAIL_RATIO;

  return rezult;
}
