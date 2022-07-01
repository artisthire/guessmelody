/**
 * Модуль содержит статические исходные данные конфигурации игры
 */

const GAME_PARAM = {
  initLevel: 0, // начальный уровень
  totalLives: 3, // колличество жизней
  totalTime: 300, // общее время игры (секунд)
  limitTime: 30, // время (секунд), до достижения которого ответ считается быстрым
  timeTick: 1000, // значение единицы игрового времени (1 секудна)
  lowTime: 30, // время (секунд), после которого считается, что до конца игры осталось мало времени
  quickRatio: 2, // колличество очков за каждый быстрый ответ
  correctRatio: 1, // колличество очков за каждый правильный ответ
  failRatio: -2 // колличество очков за каждую ошибку
};

const DEBUG_MODE = true || window.location.hash.toLowerCase().includes('debug');

export {GAME_PARAM, DEBUG_MODE};
