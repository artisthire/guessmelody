import {assert} from 'chai';
import sinon from '../../node_modules/sinon/pkg/sinon-esm.js';

import {initConfig, statisticConfig} from '../data/config.js';
import {gameLife, levelSpeed, levelSwitcher} from './process.js';

describe('Тестирование функции управления жизнями', function () {
  beforeEach(function () {
    gameLife.life = initConfig.life;
  });

  it(`Должно быть ${initConfig.life} в начальном состоянии`, function () {
    assert.equal(gameLife.life, initConfig.life);
  });

  it(`Должно быть ${initConfig.life - 1} когда использована 1 жизнь`, function () {
    gameLife.decrement();
    assert.equal(gameLife.life, initConfig.life - 1);
  });

  it(`Должно быть 0 когда использована последняя жизнь`, function () {
    for (let i = initConfig.life; i > 0; i--) {
      gameLife.decrement();
    }
    assert.equal(gameLife.life, 0);
  });

  it(`Должно быть -1 когда превышено колличество попыток`, function () {
    for (let i = initConfig.life; i >= 0; i--) {
      gameLife.decrement();
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

describe('Тестирование функции переключения уровней', function () {
  beforeEach(function () {
    levelSwitcher.level = initConfig.initLevel;
  });

  it(`Начальный уровень должен быть равен ${initConfig.initLevel}`, function () {
    assert.equal(initConfig.initLevel, levelSwitcher.level);
  });

  it(`При каждом переключении уровень должен увеличиваться на 1`, function () {
    assert.increasesBy(levelSwitcher.next.bind(levelSwitcher), levelSwitcher, 'level', 1);
  });

  it(`Должен быть -1 когда переход на уровень выше максимального`, function () {
    for (let i = initConfig.initLevel; i <= initConfig.questions; i++) {
      levelSwitcher.next();
    }
    assert.equal(-1, levelSwitcher.next());
  });
});

