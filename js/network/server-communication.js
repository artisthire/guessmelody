/**
 * Модуль содержит для получения/отправки данных на сервер
 */
import staticData from '../data/game-static-data.js';
import {gameState} from '../data/data.js';
import showModalError from '../templates/modal-error.js';

/**
 * Функция получения данных по вопросам с сервера
 * @return {object} - объект с данными о вопросах
 */
export async function getGameData() {
  // временно возвращаем статические данные для игры
  // нужно заменить на реальное взаимодействие с сервером
  const gameData = await Promise.resolve(staticData);

  return gameData;
}

/**
 * Функция получения статистики с результатами игор пользователей
 * Статистика сохраняется структуру данных хранящую состояние игры
 */
export async function getGameStatistics() {

  try {
    // получить данные с сервера
    // должно быть заменено на получение статистики с сервера
    const gameStatistics = await Promise.resolve(JSON.stringify(gameState.userResults));
    // сохранить в базу данных состояния игры
    gameState.userResults = JSON.parse(gameStatistics);
  } catch (err) {
    throw new Error(err.message);
  }

}

/**
 * Функция отправки результатов игры на сервер
 * @param {array} statistics - массив статистики результатов игры других пользователей и текущего игрока
 */
export async function setGameStatistics(statistics) {
  // сохранить в базу данных состояния игры
  gameState.userResults = statistics;

  try {
    // отправить на сервер
    // должно быть заменено на реальную отправку на сервер
    await Promise.resolve(JSON.stringify(statistics));
  } catch (err) {
    showModalError();
  }
}
