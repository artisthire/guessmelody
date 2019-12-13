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
const TOTAL_QUESTION = 10;

/**
 * Функция подсчета набранных игроком баллов
 * @param {array} answers - массив ответов и затраченного времени на каждый вопрос. Упорядочен последовательно по порядку вопросов
 *  каждый объект внутри массива содержит результат во вопросу в виде:
 *  [{result: true|false (правильный/неправильный ответ), time: {number} (секунд затраченных на ответ)}]
 * @param {number} notes - количество оставшихся жизней (в игре отображаются как "ноты")
 * @return {number} - количество набраных баллов
 */
export function calcUserResult(answers, notes) {

  // если ответом меньше чем вопросов, то это поражение
  if (answers.length < TOTAL_QUESTION) {
    return -1;
  }

  // количество быстрых ответов
  const quickAnswer = answers.reduce((sum, answer) => sum + ((answer.time < LIMIT_TIME) ? 1 : 0), 0);

  const rezult = quickAnswer * QUICK_RATIO + (TOTAL_QUESTION - quickAnswer) * CORRECT_RATIO + (TOTAL_NOTES - notes) * FAIL_RATIO;

  return rezult;
}


//TODO: Массив результатов должен обновляться и при проигрыше!
/**
 * Функция возвращает сообщение с результатом игры пользователем
 * При выиграше рассчитывает рейтинг пользователя в общем массиве результатов игр других пользователей
 * @param {array} results - массив результатов других пользователей
 * @param {object} userResult - объект с результатом игры пользователя
 * @return {string} - строка сообщения с результатом игры
 */
export function getUserResult(results, userResult) {

  if (userResult.lastLive <= 0 && userResult.rating < TOTAL_QUESTION) {
    return 'У вас закончились все попытки. Ничего, повезёт в следующий раз!';
  }

  if (userResult.lastTime <= 0) {
    return 'Время вышло! Вы не успели отгадать все мелодии';
  }

  const ratings = updateRatings(results, userResult.rating);
  const {userPosition, totalUsers, percentRating} = getUserRating(ratings, userResult.rating);

  return `Вы заняли ${userPosition} место из ${totalUsers} игроков. Это лучше, чем у ${percentRating}% игроков`;
}

export function updateRatings(ratings, userRating) {

  const rezultRating = [...ratings];

  if (!rezultRating.includes(userRating)) {
    rezultRating.push(userRating);
  }

  return rezultRating.sort((a, b) => b - a);
}

export function getUserRating(ratings, userRating) {
  const userPosition = ratings.indexOf(userRating) + 1;
  const totalUsers = ratings.length;
  const percentRating = Math.round((totalUsers - userPosition) / totalUsers * 100);

  return {userPosition, totalUsers, percentRating};
}
