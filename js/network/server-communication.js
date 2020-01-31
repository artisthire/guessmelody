/**
 * Модуль содержит для получения/отправки данных на сервер
 */
import staticData from '../data/game-static-data.js';
import {gameState} from '../data/data.js';

/**
 * Функция получения данных по вопросам с сервера
 * @return {object} - объект с данными о вопросах
 */
export async function loadGameData() {
  // временно возвращаем статические данные для игры
  // нужно заменить на реальное взаимодействие с сервером
  const gameData = await Promise.resolve(staticData);

  return gameData;
}

/**
 * Функция получения статистики с результатами игор пользователей с сервера
 * @return {array} - массив статистики результатов игры всех пользователей
 */
export async function loadGameStatistics() {
  return await new Promise((resolve) => setTimeout(() => resolve(gameState.gameResults), 1));
}

/**
 * Функция отправки результатов игры на сервер
 * @param {array} statistics - массив статистики результатов игры других пользователей и текущего игрока
 */
export async function sendGameStatistics(statistics) {
  // временно, пока нет взаимодействия с сервером
  // дальше данные должны отправляться только на сервер
  // сохранить в базу данных состояния игры
  gameState.gameResults = statistics;

  // отправить на сервер
  // должно быть заменено на реальную отправку на сервер
  await new Promise((resolve) => setTimeout(() => resolve(statistics), 1));
}
