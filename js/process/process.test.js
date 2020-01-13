import {assert} from 'chai';
import sinon from '../../node_modules/sinon/pkg/sinon-esm.js';

import {initConfig, statisticConfig} from '../data/config.js';
import {gameState} from '../data/data.js';
import {removeGameLife, levelSpeed} from './process.js';

describe('Тестирование функции управления жизнями', function () {
  beforeEach(function () {
    gameState.wrongAnswer = 0;
  });

  it(`Должно быть 1 когда допущена 1 ошибка`, function () {
    removeGameLife();
    assert.equal(gameState.wrongAnswer, 1);
  });

  it(`Должно быть 3 когда использована последняя жизнь`, function () {
    for (let i = initConfig.totalTries; i > 0; i--) {
      removeGameLife();
    }
    assert.equal(gameState.wrongAnswer, 3);
  });

  it(`Должно быть -1 когда превышено колличество попыток`, function () {
    for (let i = (initConfig.totalTries + 1); i > 0; i--) {
      removeGameLife();
    }
    assert.equal(gameState.wrongAnswer, -1);
  });
});

describe('Тестирование функции скорости ответа вопросы уровня', function () {
  const clock = sinon.useFakeTimers();

  after(function () {
    clock.restore();
  });

  beforeEach(function () {
    levelSpeed.setStartTimer();
  });

  it('Должно быть FALSE, когда ответ Медленный', function () {
    clock.tick(statisticConfig.limitTime + 1);
    assert.isNotTrue(levelSpeed.getAnswerSpeed());
  });

  it('Должно быть TRUE, когда ответ Быстрый', function () {
    clock.tick(statisticConfig.limitTime - 1);
    assert.isTrue(levelSpeed.getAnswerSpeed());
    clock.tick(1);
    assert.isTrue(levelSpeed.getAnswerSpeed());
  });
});

