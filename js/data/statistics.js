/**
 * Модуль содержит функции подсчета статистики результатов игры
 */

import {initConfig, statisticConfig} from './config.js';
import {getTimeComponents, wordFrom} from '../utilities.js';
import {loadGameStatistics, sendGameStatistics} from '../network/server-communication.js';

// время, при привышении которого ответ не считается быстрым
const LIMIT_TIME = statisticConfig.limitTime;
// цена на быстрый, нормальный ответ и ошибку
const QUICK_RATIO = statisticConfig.quickRatio;
const CORRECT_RATIO = statisticConfig.correctRatio;
const FAIL_RATIO = statisticConfig.failRatio;

/**
 * Функция возвращает сообщение с результатом игры пользователем
 * При выиграше рассчитывает рейтинг пользователя в общем массиве результатов игр других пользователей
 * Сообщение используется для отображения результатов игры на финальном экране
 * @param {number} gameEndCode - код статуса окончания игры (закончились попытки, время, успешное окончание)
 * @param {object} state - объект с состоянием игры
 *  state.wrongAnswer - колличество допущенных ошибок,
 *  state.lastTime - колличество оставшегося времени,
 *  state.totalQuestions - общее колличество вопросов в игре,
 *  state.statistics - массив с ответами пользователя
 * @return {string} - сообщение с результатом игры пользователем
 */
export async function getGameEndMessage(gameEndCode, state) {

  if (gameEndCode === initConfig.gameEndCode['failTries']) {
    return `<h2 class="result__title">Какая жалость!</h2>
    <p class="result__total result__total--fail">У вас закончились все попытки. Ничего, повезёт в следующий раз!</p>`;
  }

  if (gameEndCode === initConfig.gameEndCode['failTime']) {
    return `<h2 class="result__title">Увы и ах!</h2>
    <p class="result__total result__total--fail">Время вышло! Вы не успели отгадать все мелодии</p>`;
  }

  // если игра успешно завершена подсчитываем и возвращаем статистику
  const userResult = calcUserResult(state.statistics, state.wrongAnswer, state.totalQuestions);
  // попытка получить и обновить рейтинг пользователей с сервера
  const ratings = await updateRatings(userResult.ball);

  // получаем оставшееся время и рейтинг пользователя
  const [lastMinutes, lastSeconds] = getTimeComponents(state.lastTime);
  const {positionInRating, totalUsers, percentRating} = getUserRating(ratings, userResult.ball);

  // получаем строковое представление для статистики пользователя в виде:
  // числовой результат + единицы измерения этого результата в виде текста соответствующего склонения
  // например, 1 минута 25 секунд, 8 баллов 3 быстрых
  const lastMinutesString = wordFrom(lastMinutes, ['минуту', 'минуты', 'минут']);
  const lastSecondsString = wordFrom(lastSeconds, ['секунда', 'секунды', 'секунд']);
  const ballString = wordFrom(userResult.ball, ['бал', 'балла', 'баллов']);
  const quickAnswerString = wordFrom(userResult.quickAnswer, ['быстрый', 'быстрых', 'быстрых']);
  const wrongAnswerString = wordFrom(state.wrongAnswer, ['ошибку', 'ошибки', 'ошибок']);

  return `<h2 class="result__title">Вы настоящий меломан!</h2>
    <p class="result__total">За ${lastMinutesString} и ${lastSecondsString} вы набрали ${ballString} (${quickAnswerString}), совершив ${wrongAnswerString}</p>
    <p class="result__text">Вы заняли ${positionInRating} место из ${totalUsers}. Это лучше чем у ${percentRating}% игроков</p>`;
}

/**
 * Функция подсчета набранных игроком баллов и колличества быстрых ответов
 * @param {array} answers - массив ответов и затраченного времени на каждый вопрос. Упорядочен последовательно по порядку уровней игры
 *  Каждый объект внутри массива содержит результат ответов пользователя на вопрос каждого уровня:
 *  [{[] - массив выбранных пользователем ответов, time: {number} - милисекунды затраченные на ответ)}]
 * @param {number} wrongAnswer - количество неправильных ответов
 * @param {number} questionsCount - общее колличество вопросов
 * @return {object} - объект вида {quickAnswer, ball} с колличеством быстрых ответов и набраных баллов
 */
export function calcUserResult(answers, wrongAnswer, questionsCount) {
  // колличество быстрых ответов
  const quickAnswer = answers.reduce((sum, answer) => sum + ((answer.time < LIMIT_TIME) ? 1 : 0), 0);

  const ball = quickAnswer * QUICK_RATIO + (questionsCount - quickAnswer) * CORRECT_RATIO + wrongAnswer * FAIL_RATIO;

  return {quickAnswer, ball};
}

/**
 * Функция добавляет результат игры текущего пользователя в общий массив результатов других пользователей
 * @param {number} userRating - колличество набранных очков текущим пользователем
 * @return {array} - обновленный массив с результатами игр всех пользователей
 */
export async function updateRatings(userRating) {
  // попытка получить данные с рейтингом с сервера
  const otherResults = await loadGameStatistics();

  // если результат пользователя уже есть в общем рейтинге
  // рейтинг не обновляем
  if (otherResults.includes(userRating)) {
    return otherResults;
  }

  // иначе добавляем результат пользователя в общий рейтинг
  const newRatings = [...otherResults];
  // находим позицию в которую нужно вставить новый результат
  const indexInRating = (newRatings[newRatings.length - 1] < userRating) ? newRatings.findIndex((element) => element < userRating) : newRatings.length;
  // вставляем результат текущего пользователя в общий массив результатов
  newRatings.splice(indexInRating, 0, userRating);

  // попытка отправить обновленные данные с результатами пользователей на сервер
  await sendGameStatistics(newRatings);

  // при успешной отправке возвращаем обновленный массив результатов рейтингов всех пользователей
  return newRatings;
}

/**
 * Функция возвращает позицию результата игры текущего пользователя отосительно результатов других пользователей
 * @param {array} ratings - массив {number} набранных очков другими пользователями
 * @param {number} userRating - колличество набранных очков текущим пользователем
 * @return {object} - объект с рейтинговыми показателями игры текущего пользователя:
 *  positionInRating - позиция результата игры текущего пользователя относительно результатов других пользователей
 *  totalUsers - общее колличество пользователей, попавших в рейтиги
 *  percentRating - то же что и positionInRating, но выраженное в процентах относительно результатов других пользователей
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
