import {assert} from 'chai';

import {calcUserResult, getGameEndMessage, updateRatings, getUserRating} from './statistics.js';
import {initConfig, statisticConfig} from './config.js';

describe('Проверка функции подсчета статистики', function () {
  // для подсчета результата игры массива ответов пользователя в целях тестирования
  function getFakeUserResult(quickAnswer, wrongAnswer, totalQuestions) {
    const quickRation = statisticConfig.quickRatio;
    const normalRatio = statisticConfig.correctRatio;
    const failRatio = statisticConfig.failRatio;

    return quickAnswer * quickRation + (totalQuestions - quickAnswer) * normalRatio + wrongAnswer * failRatio;
  }

  it(`Должно быть ${getFakeUserResult(0, 0, 10)} баллов и 0 быстрых ответов, когда ответы правильные но медленные`, function () {
    const quickAnswer = 0;
    const wrongAnswer = 0;
    const totalQuestions = 10;

    const fakeResults = [
      {'time': 30000}, {'time': 30000}, {'time': 30000}, {'time': 30000}, {'time': 30000},
      {'time': 30000}, {'time': 30000}, {'time': 30000}, {'time': 30000}, {'time': 30000}
    ];

    assert.deepEqual({quickAnswer, 'ball': getFakeUserResult(quickAnswer, wrongAnswer, totalQuestions)}, calcUserResult(fakeResults, wrongAnswer, totalQuestions));
  });

  it(`Должно быть ${getFakeUserResult(5, 2, 10)} баллов и 5 быстрых ответов, когда 5 быстрых ответов и 2 ошибки`, function () {
    const quickAnswer = 5;
    const wrongAnswer = 2;
    const totalQuestions = 10;

    const fakeResults = [
      {'time': 20000}, {'time': 20000}, {'time': 20000}, {'time': 30000}, {'time': 30000},
      {'time': 20000}, {'time': 20000}, {'time': 30000}, {'time': 30000}, {'time': 30000}
    ];

    assert.deepEqual({quickAnswer, 'ball': getFakeUserResult(quickAnswer, wrongAnswer, totalQuestions)}, calcUserResult(fakeResults, wrongAnswer, totalQuestions));
  });

  it(`Должно быть ${getFakeUserResult(2, 1, 10)} баллов и 2 быстрых ответа, когда 2 быстрых ответа и 1 ошибка`, function () {
    const quickAnswer = 2;
    const wrongAnswer = 1;
    const totalQuestions = 10;

    const fakeResults = [
      {'time': 20000}, {'time': 30000}, {'time': 30000}, {'time': 30000}, {'time': 30000},
      {'time': 20000}, {'time': 30000}, {'time': 30000}, {'time': 30000}, {'time': 30000}
    ];

    assert.deepEqual({quickAnswer, 'ball': getFakeUserResult(quickAnswer, wrongAnswer, totalQuestions)}, calcUserResult(fakeResults, wrongAnswer, totalQuestions));
  });
});

describe('Проверка функции выбода результата игры', function () {

  before(function () {
    // сбрасываем состояние рейтингов в моке LocalStorage для того, чтобы предыдущие тесты не повлияли на текущий
    // связано с тем, что мы объявляем глобальный объект localStorage
    localStorage['allRatings'] = '[]';
  });

  it('Должен быть проигрыш, когда закончились попытки', function () {
    assert.match(getGameEndMessage(initConfig.gameEndCode['failTries']), /попытки/);
  });

  it('Должен быть проигрыш, когда законилось время', function () {
    assert.match(getGameEndMessage(initConfig.gameEndCode['failTime']), /Время/);
  });

  it('Должен быть выигрыш, когда получены все ответы, не закончились попытки и время', function () {
    const quickAnswer = 2;
    const wrongAnswer = 1;
    const totalQuestions = 10;
    const lastTime = (3 * 60 + 25) * 1000;
    const fakeResults = [
      {'time': 20000}, {'time': 30000}, {'time': 30000}, {'time': 30000}, {'time': 30000},
      {'time': 20000}, {'time': 30000}, {'time': 30000}, {'time': 30000}, {'time': 30000}
    ];

    assert.match(getGameEndMessage(initConfig.gameEndCode['complete'], {statistics: fakeResults, wrongAnswer, totalQuestions, lastTime}), /меломан/);
  });

  /*

  it('Должна правильно рассчитываться позиция игрока в общем рейтинге', function () {
    assert.match(getGameEndMessage([15, 14, 13, 12, 10], {result: 16, lastLive: 1, lastTime: 20}), /1 место/);
    assert.match(getGameEndMessage([15, 14, 13, 12, 10], {result: 10, lastLive: 1, lastTime: 20}), /5 место/);
    assert.match(getGameEndMessage([16, 17, 18, 15, 14, 13, 12, 10], {result: 15, lastLive: 1, lastTime: 20}), /4 место/);
  });

  it('Должна правильно рассчитываться процент игроков с меньшим рейтингом', function () {
    assert.match(getGameEndMessage([15, 14, 13, 12, 10], {result: 16, lastLive: 1, lastTime: 20}), /83%/);
    assert.match(getGameEndMessage([20, 19, 15, 14, 13, 12, 11, 10], {result: 18, lastLive: 1, lastTime: 20}), /67%/);
    assert.match(getGameEndMessage([15, 14, 13, 12], {result: 10, lastLive: 1, lastTime: 20}), /0%/);
    assert.match(getGameEndMessage([16, 17, 18, 14, 13, 12, 10], {result: 15, lastLive: 1, lastTime: 20}), /50%/);
  });*/
});

describe.skip('Проверка функции добавления рейтинга пользователя в общий рейтинг всех пользователей', function () {

  (function () {
    // мок для localStorage, поскольку при тестировании вне браузера такого объекта не существует
    let mockStorage = {};
    mockStorage.setItem = function (key, val) {
      this[key] = val + '';
    };
    mockStorage.getItem = function (key) {
      if (key in this) {
        return this[key];
      }
      return null;
    };
    Object.defineProperty(mockStorage, 'length', {
      get() {
        return Object.keys(this).length - 2;
      }
    });

    global.localStorage = mockStorage;

    before(function () {
      // сбрасываем состояние рейтингов в моке LocalStorage для того, чтобы предыдущие тесты не повлияли на текущий
      // связано с тем, что мы объявляем глобальный объект localStorage
      localStorage['allRatings'] = '[]';
    });

    it('Если нет других результатов, должен создаваться новый рейтинг', function () {
      assert.deepEqual(updateRatings(10), [10]);
    });

    it('Если такой рейтинг в массиве результатов есть, массив меняться не должен', function () {
      updateRatings(11);
      updateRatings(8);

      assert.deepEqual(updateRatings(10), [11, 10, 8]);
    });

    it('Если рейтинга текущего пользователя в общем массиве нет, он должен в него добавляться', function () {
      assert.deepEqual(updateRatings(7), [11, 10, 8, 7]);
    });

    it('Общий рейтинг отсортирован по убыванию', function () {
      assert.sameOrderedMembers(updateRatings(7), [11, 10, 8, 7]);
    });

  })();

});

// Для тестирования внутренней функции подсчета рейтинга пользователя
describe('Проверка функции расчета рейтинга текущего пользователя игры', function () {

  beforeEach(function () {
    // сбрасываем состояние рейтингов в моке LocalStorage для того, чтобы предыдущие тесты не повлияли на текущий
    // связано с тем, что мы объявляем глобальный объект localStorage
    localStorage['allRatings'] = '[]';
  });


  it('Возвращает объект вида {positionInRating: .., totalUsers: .., percentRating: ..}', function () {
    assert.containsAllKeys(getUserRating([11, 10, 8, 6, 5, 4], 6), ['positionInRating', 'totalUsers', 'percentRating']);
  });

  it('Правильно рассчитывает рейтинги, если других результатов нет', function () {
    assert.deepEqual(getUserRating([], 10), {positionInRating: 1, totalUsers: 1, percentRating: 100});
  });

  it('Правильно вычисляется позиция игрока в общем рейтинге', function () {
    assert.propertyVal(getUserRating([6, 4], 4), 'positionInRating', 2);
    assert.propertyVal(getUserRating([11, 10, 8, 6, 5, 4], 4), 'positionInRating', 6);
    assert.propertyVal(getUserRating([11, 10, 8, 6, 5, 4], 11), 'positionInRating', 1);
  });

  it('Правильно возвращает общее количество игроков в общем рейтинге', function () {
    assert.propertyVal(getUserRating([11, 5, 4], 6), 'totalUsers', 3);
    assert.propertyVal(getUserRating([11, 10, 8, 6, 5, 4], 4), 'totalUsers', 6);
    assert.propertyVal(getUserRating([4], 11), 'totalUsers', 1);
  });

  it('Правильно рассчитывает процент пользователей у которых рейтинг меньше', function () {
    assert.propertyVal(getUserRating([4], 4), 'percentRating', 100);
    assert.propertyVal(getUserRating([6, 4], 6), 'percentRating', 100);
    assert.propertyVal(getUserRating([11, 10, 8, 5], 10), 'percentRating', 50);
    assert.propertyVal(getUserRating([11, 10, 8, 5], 8), 'percentRating', 25);
    assert.propertyVal(getUserRating([11, 10, 8, 5], 5), 'percentRating', 0);
    assert.propertyVal(getUserRating([11, 10, 8], 10), 'percentRating', 33);
  });
});

