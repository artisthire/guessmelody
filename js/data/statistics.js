/**
 * Модуль содержит функции подсчета результатов игры
 */

import {statisticConfig} from './config.js';

// время, при привышении которого ответ не считается быстрым
const LIMIT_TIME = statisticConfig.limitTime;
// цена на быстрый, нормальный ответ и ошибку
const QUICK_RATIO = statisticConfig.quickRatio;
const CORRECT_RATIO = statisticConfig.correctRatio;
const FAIL_RATIO = statisticConfig.failRatio;
// количество вопросов
const TOTAL_QUESTION = 10;

/**
 * Функция подсчета набранных игроком баллов
 * @param {array} answers - массив ответов и затраченного времени на каждый вопрос. Упорядочен последовательно по порядку вопросов
 *  каждый объект внутри массива содержит результат ответов пользователя по вопросам:
 *  [{[] - массив выбранных пользователем ответов, time: {number} - милисекунды затраченные на ответ)}]
 * @param {number} wrongAnswer - количество неправильных ответов
 * @param {number} questionsCount - общее колличество вопросов
 * @return {number} - количество набраных баллов
 */
export function calcUserResult(answers, wrongAnswer, questionsCount) {
  // колличество быстрых ответов
  const quickAnswer = answers.reduce((sum, answer) => sum + ((answer.time < LIMIT_TIME) ? 1 : 0), 0);

  const rezult = quickAnswer * QUICK_RATIO + (questionsCount - quickAnswer) * CORRECT_RATIO + wrongAnswer * FAIL_RATIO;

  return rezult;
}

/**
 * Функция возвращает сообщение с результатом игры пользователем
 * При выиграше рассчитывает рейтинг пользователя в общем массиве результатов игр других пользователей
 * @param {object} userResult - объект с результатом игры пользователя
 *  {number} userResult.result - колличество набранных очков в результате игры
 *  {number} userResult.lastLive - колличество оставшихся жизней (нот)
 *  {number} userResult.lastTime - колличество оставшегося времени
 * @return {string} - сообщение с результатом игры пользователем
 */
export function getGameResult(userResult) {

  if (userResult.lastLive <= 0 && userResult.result < TOTAL_QUESTION) {
    return 'У вас закончились все попытки. Ничего, повезёт в следующий раз!';
  }

  if (userResult.lastTime <= 0) {
    return 'Время вышло! Вы не успели отгадать все мелодии';
  }

  const ratings = updateRatings(userResult.result);
  const {userPosition, totalUsers, percentRating} = getUserRating(ratings, userResult.result);

  return `Вы заняли ${userPosition} место из ${totalUsers} игроков. Это лучше, чем у ${percentRating}% игроков`;
}

/**
 * Функция добавляет результат игры текущего пользователя в общий массив результатов других пользователей
 * @param {number} userRating - колличество набранных очков текущим пользователем
 * @return {array} - обновленный массив с результатами игр всех пользователей
 */
export function updateRatings(userRating) {
  // временно храним результаты игор других пользователей в localStorage
  const otherResults = JSON.parse(localStorage.getItem('allRatings'));

  // если еще нет результатов игр пользователей, сохраняем первый результат в LocalStorage
  if (!otherResults) {
    localStorage.setItem('allRatings', JSON.stringify([userRating]));
    return [userRating];
  }

  // если результат пользователя уже есть в общем рейтинге
  // рейтинг не обновляем
  if (otherResults.includes(userRating)) {
    return otherResults;
  }

  // иначе добавляем результат пользователя в общий рейтинг
  const newRatings = [...otherResults];
  newRatings.push(userRating);
  // общий рейтинг отсортирован по убыванию
  newRatings.sort((a, b) => b - a);

  localStorage.setItem('allRatings', JSON.stringify(newRatings));

  return newRatings;
}

/**
 * Функция возвращает рейтинг результата игры текущего пользователя отосительно результатов других пользователей
 * @param {array} ratings - массив {number} набранных очков других пользователями
 * @param {number} userRating - колличество набранных очков текущим пользователем
 * @return {object} - объект с рейтинговыми показателями игры текущего пользователя:
 *  userPosition - позиция результата игры текущего пользователя относительно результатов других пользователей
 *  totalUsers - общее колличество пользователей, попавших в рейтиги
 *  percentRating - то же что и userPosition, но выраженное в процентах относительно результатов других пользователей
 */
export function getUserRating(ratings, userRating) {
  const userPosition = ratings.indexOf(userRating) + 1;
  const totalUsers = ratings.length;
  const percentRating = Math.round((totalUsers - userPosition) / totalUsers * 100);

  return {userPosition, totalUsers, percentRating};
}
