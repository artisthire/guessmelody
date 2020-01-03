import {initConfig, statisticConfig} from '../data/config.js';

// управление колличеством игровых жизней
export const gameLife = {
  currentLife: initConfig.tries,
  get life() {
    return this.currentLife;
  },
  set life(count) {
    this.currentLife = count;
  },
  remove() {
    if (this.currentLife < 0) {
      return -1;
    }

    return this.currentLife--;
  }
};

// дает информацию о скорости ответа пользователя на вопрос ("быстрый" или "медленный" ответ с точки зрения игровой логики)
export const levelSpeed = {
  setStartTimer() {
    this.startTime = new Date().getTime();
  },
  getAnswerSpeed() {
    return (new Date().getTime() - this.startTime) <= statisticConfig.limitTime;
  }
};
