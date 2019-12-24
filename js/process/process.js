import {initConfig, statisticConfig} from '../data/config.js';

// управление колличеством игровых жизней
export const gameLife = {
  currentLife: initConfig.life,
  get life() {
    return this.currentLife;
  },
  set life(count) {
    this.currentLife = count;
  },
  decrement() {
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

export const levelSwitcher = {
  currentLevel: initConfig.initLevel,
  get level() {
    return this.currentLevel;
  },
  set level(level) {
    this.currentLevel = level;
  },
  next() {
    if (this.currentLevel > initConfig.questions) {
      return -1;
    }

    return this.currentLevel++;
  }
};
