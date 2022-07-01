/**
 * Модуль содержит функции подсчета статистики результатов игры
 */
import {GAME_PARAM} from '../data/config.js';
import {getTimeComponents, wordFrom} from '../utilities.js';

/**
 * Функция возвращает сообщение с результатом игры пользователем
 * При выиграше рассчитывает рейтинг пользователя в общем массиве результатов игр других пользователей
 * Сообщение используется для отображения результатов игры на финальном экране
 * @param {object} endFlags - объект, содержащий код статуса окончания игры
    endFlags.isDie - true - превышено число допустимых ошибок при ответах
    endFlags.overTime - true - истекло общее время игры
 * @param {object} state - объект состояния игры
    state.totalTime - общее время длительности игры,
    state.currentTime - текущее оставшееся время игры,
    state.wrong - количество допущенных ошибок при ответах
 * @param {array} results - массив с результатами игор всех пользователей
 * @param {object} userResult - объект с результатом игры текущего пользователя
   userResult.ball - количество набраных очков
   userResult.quickAnswer - колличество быстрых ответов
 * @return {string} - сообщение с результатом игры
 */
export function getResultMessage(endFlags, state, results, userResult) {

  if (endFlags.isDie) {
    return `<h2 class="result__title">Какая жалость!</h2>
    <p class="result__total result__total--fail">У вас закончились все попытки. Ничего, повезёт в следующий раз!</p>`;
  }

  if (endFlags.overTime) {
    return `<h2 class="result__title">Увы и ах!</h2>
    <p class="result__total result__total--fail">Время вышло! Вы не успели отгадать все мелодии</p>`;
  }

  // получаем оставшееся время и рейтинг пользователя
  const {minuts, seconds} = getTimeComponents(state.totalTime - state.currentTime);
  const {positionInRating, totalUsers, percentRating} = getResultPosition(results, userResult.ball);

  // получаем строковое представление для статистики пользователя в виде:
  // числовой результат + единицы измерения этого результата в виде текста соответствующего склонения
  // например, 1 минута 25 секунд, 8 баллов 3 быстрых
  const lastMinutesString = wordFrom(minuts, ['минуту', 'минуты', 'минут']);
  const lastSecondsString = wordFrom(seconds, ['секунда', 'секунды', 'секунд']);
  const ballString = wordFrom(userResult.ball, ['бал', 'балла', 'баллов']);
  const quickAnswerString = wordFrom(userResult.quickAnswer, ['быстрый', 'быстрых', 'быстрых']);
  const wrongAnswerString = wordFrom(state.wrong, ['ошибку', 'ошибки', 'ошибок']);

  return `<h2 class="result__title">Вы настоящий меломан!</h2>
    <p class="result__total">За ${lastMinutesString} и ${lastSecondsString} вы набрали ${ballString} (${quickAnswerString}), совершив ${wrongAnswerString}</p>
    <p class="result__text">Вы заняли ${positionInRating} место из ${totalUsers}. Это лучше чем у ${percentRating}% игроков</p>`;
}

/**
 * Функция подсчета набранных игроком баллов и колличества быстрых ответов
 * @param {array} answers - массив ответов и затраченного времени на каждый вопрос.
 *  Упорядочен последовательно по порядку уровней игры
 *  Каждый объект внутри массива содержит результат ответов пользователя на вопрос каждого уровня:
 *  [{[] - массив выбранных пользователем ответов, time: {number} - милисекунды затраченные на ответ)}]
 * @param {number} wrongAnswer - количество неправильных ответов
 * @param {number} totalQuestion - общее колличество вопросов
 * @return {object} - объект вида {quickAnswer, ball} с колличеством быстрых ответов и набраных баллов
 */
export function calcUserResult(answers, wrongAnswer, totalQuestion) {
  // колличество быстрых ответов
  const quickAnswer = answers.reduce((sum, answer) => sum + +isFastAnswer(answer.time), 0);

  const ballQuickAnswer = quickAnswer * GAME_PARAM.quickRatio;
  const ballCorrectAnswer = (totalQuestion - quickAnswer) * GAME_PARAM.correctRatio;
  const ballWrongAnswer = wrongAnswer * GAME_PARAM.failRatio;
  const totalBall = ballQuickAnswer + ballCorrectAnswer + ballWrongAnswer;

  return {quickAnswer, ball: totalBall};
}

/**
 * Функция добавляет результат игры текущего пользователя в общий массив результатов других пользователей
 * @param {array} results - массив {number} набранных очков предыдущих игор
 * @param {number} userResult - колличество набранных очков текущим пользователем
 * @return {array} - обновленный массив с результатами игр всех пользователей
 */
export function updateRatings(results, userResult) {
  // если результат пользователя уже есть в общем рейтинге
  // рейтинг не обновляем
  if (results.includes(userResult)) {
    return results;
  }

  // иначе добавляем результат пользователя в общий рейтинг
  const newRatings = [...results];
  // находим позицию в которую нужно вставить новый результат
  const indexInRating = (newRatings[newRatings.length - 1] < userResult) ?
    newRatings.findIndex((element) => element < userResult) : newRatings.length;
  // вставляем результат текущего пользователя в общий массив результатов
  newRatings.splice(indexInRating, 0, userResult);

  // возвращаем обновленный массив результатов рейтингов всех пользователей
  return newRatings;
}

/**
 * Функция возвращает позицию результата игры текущего пользователя отосительно результатов других пользователей
 * @param {array} results - массив {number} набранных очков предыдущих игор
 * @param {number} userResult - колличество набранных очков текущим пользователем
 * @return {object} - объект с рейтинговыми показателями игры текущего пользователя:
 *  positionInRating - позиция результата игры текущего пользователя относительно результатов других пользователей
 *  totalUsers - общее колличество пользователей, попавших в рейтиги
 *  percentRating - то же что и positionInRating, но выраженное в процентах
 */
export function getResultPosition(results, userResult) {

  const positionInRating = results.indexOf(userResult) + 1;

  if (results.length === 0) {
    return {positionInRating: 1, totalUsers: 1, percentRating: 100};
  }

  const totalUsers = results.length;
  const percentRating = Math.round((totalUsers - positionInRating) / totalUsers * 100);

  return {positionInRating, totalUsers, percentRating};
}

/**
 * Проверяет был ли ответ на вопросы уровня быстрым или медленным
 * Скорость ответа сравнивается с заданным параметров в игре
 * @param {number} levelTime - скорость ответа на вопрос на текущем уровен игры
 * @return {boolean} - true - ответ дан быстро, false - медленно
 */
export function isFastAnswer(levelTime) {
  return levelTime < GAME_PARAM.limitTime;
}
