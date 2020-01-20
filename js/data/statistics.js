/**
 * Модуль содержит функции подсчета результатов игры
 */

import {initConfig, statisticConfig} from './config.js';
import {getTimeComponents, wordFrom} from '../utilities.js';

// время, при привышении которого ответ не считается быстрым
const LIMIT_TIME = statisticConfig.limitTime;
// цена на быстрый, нормальный ответ и ошибку
const QUICK_RATIO = statisticConfig.quickRatio;
const CORRECT_RATIO = statisticConfig.correctRatio;
const FAIL_RATIO = statisticConfig.failRatio;

/**
 * Функция подсчета набранных игроком баллов
 * @param {array} answers - массив ответов и затраченного времени на каждый вопрос. Упорядочен последовательно по порядку вопросов
 *  каждый объект внутри массива содержит результат ответов пользователя по вопросам:
 *  [{[] - массив выбранных пользователем ответов, time: {number} - милисекунды затраченные на ответ)}]
 * @param {number} wrongAnswer - количество неправильных ответов
 * @param {number} questionsCount - общее колличество вопросов
 * @return {object} - количество быстрых ответов и набраных баллов
 */
export function calcUserResult(answers, wrongAnswer, questionsCount) {
  // колличество быстрых ответов
  const quickAnswer = answers.reduce((sum, answer) => sum + ((answer.time < LIMIT_TIME) ? 1 : 0), 0);

  const ball = quickAnswer * QUICK_RATIO + (questionsCount - quickAnswer) * CORRECT_RATIO + wrongAnswer * FAIL_RATIO;

  return {quickAnswer, ball};
}

/**
 * Функция возвращает сообщение с результатом игры пользователем
 * При выиграше рассчитывает рейтинг пользователя в общем массиве результатов игр других пользователей
 * @param {number} gameEndCode - код статуса окончания игры
 * @param {object} gameState - объект с состоянием игры
 *  gameState.wrongAnswer - колличество допущенных ошибок,
 *  gameState.lastTime - колличество оставшегося времени,
 *  gameState.totalQuestions - общее колличество вопросов в игре,
 *  gameState.statistics - массив с ответами пользователя
 * @return {string} - сообщение с результатом игры пользователем
 */
export function getGameEndMessage(gameEndCode, gameState) {

  if (gameEndCode === initConfig.gameEndCode['failTries']) {
    return `<h2 class="result__title">Какая жалость!</h2>
    <p class="result__total result__total--fail">У вас закончились все попытки. Ничего, повезёт в следующий раз!</p>`;
  }

  if (gameEndCode === initConfig.gameEndCode['failTime']) {
    return `<h2 class="result__title">Увы и ах!</h2>
    <p class="result__total result__total--fail">Время вышло! Вы не успели отгадать все мелодии</p>`;
  }

  // если игра успешно завершена подсчитываем и возвращаем статистику
  const userResult = calcUserResult(gameState.statistics, gameState.wrongAnswer, gameState.totalQuestions);
  const ratings = updateRatings(userResult.ball);

  const [lastMinutes, lastSeconds] = getTimeComponents(gameState.lastTime);
  const {positionInRating, totalUsers, percentRating} = getUserRating(ratings, userResult.ball);

  // для чисел получаем соответствующие строковые представления с числом и словом идущим за ним в соответствующем склонении
  const lastMinutesString = wordFrom(lastMinutes, ['минуту', 'минуты', 'минут']);
  const lastSecondsString = wordFrom(lastSeconds, ['секунда', 'секунды', 'секунд']);
  const ballString = wordFrom(userResult.ball, ['бал', 'балла', 'баллов']);
  const quickAnswerString = wordFrom(userResult.quickAnswer, ['быстрый', 'быстрых', 'быстрых']);
  const wrongAnswerString = wordFrom(userResult.quickAnswer, ['ошибку', 'ошибки', 'ошибок']);

  return `<h2 class="result__title">Вы настоящий меломан!</h2>
    <p class="result__total">За ${lastMinutesString} и ${lastSecondsString} вы набрали ${ballString} (${quickAnswerString}), совершив ${wrongAnswerString}</p>
    <p class="result__text">Вы заняли ${positionInRating} место из ${totalUsers}. Это лучше чем у ${percentRating}% игроков</p>`;
}

/**
 * Функция добавляет результат игры текущего пользователя в общий массив результатов других пользователей
 * @param {number} userRating - колличество набранных очков текущим пользователем
 * @return {array} - обновленный массив с результатами игр всех пользователей
 */
export function updateRatings(userRating) {
  // временно храним результаты игор других пользователей в localStorage
  let otherResults = localStorage.getItem('allRatings');

  // если еще нет результатов игр пользователей, сохраняем первый результат в LocalStorage
  if (!otherResults) {
    localStorage.setItem('allRatings', JSON.stringify([userRating]));
    return [userRating];
  }

  otherResults = JSON.parse(otherResults);

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

  const positionInRating = ratings.indexOf(userRating) + 1;

  if (ratings.length === 0) {
    return {positionInRating: 1, totalUsers: 1, percentRating: 100};
  }

  const totalUsers = ratings.length;
  const percentRating = Math.round((totalUsers - positionInRating) / totalUsers * 100);

  return {positionInRating, totalUsers, percentRating};
}
