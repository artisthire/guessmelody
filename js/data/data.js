/**
 * Содержит структуры данных для использования в игре
 */
import {GAME_PARAM} from './config.js';

export const INITIAL_STATE = {
  level: GAME_PARAM.initLevel,
  wrong: 0, // колличество неправильных ответов
  lives: GAME_PARAM.totalLives,
  totalTime: GAME_PARAM.totalTime,
  currentTime: GAME_PARAM.totalTime,
  statistics: []
};

export const GAME_DATA = {
  appId: '',
  questions: [],
  statistics: []
};
