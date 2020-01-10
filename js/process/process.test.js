import {assert} from 'chai';
import sinon from '../../node_modules/sinon/pkg/sinon-esm.js';

import {initConfig, statisticConfig} from '../data/config.js';
import {gameLife, levelSpeed} from './process.js';

describe('Тестирование функции управления жизнями', function () {
  beforeEach(function () {
    gameLife.life = initConfig.tries;
  });

  it(`Должно быть ${initConfig.tries} в начальном состоянии`, function () {
    assert.equal(gameLife.life, initConfig.tries);
  });

  it(`Должно быть ${initConfig.tries - 1} когда использована 1 жизнь`, function () {
    gameLife.remove();
    assert.equal(gameLife.life, initConfig.tries - 1);
  });

  it(`Должно быть 0 когда использована последняя жизнь`, function () {
    for (let i = initConfig.tries; i > 0; i--) {
      gameLife.remove();
    }
    assert.equal(gameLife.life, 0);
  });

  it(`Должно быть -1 когда превышено колличество попыток`, function () {
    for (let i = (initConfig.tries + 1); i > 0; i--) {
      gameLife.remove();
    }
    assert.equal(gameLife.life, -1);
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

