import {assert} from 'chai';

import {calcUserResult, getGameResult, updateRatings, getUserRating} from './statistics.js';
import {statisticConfig} from './config.js';

describe('Проверка функции подсчета статистики', function () {

  it('Должно быть 10, когда ответы правильные но медленные', function () {
    const fakeResults = [
      {'answers': [], 'time': 30000}, {'answers': [], 'time': 30000}, {'answers': [], 'time': 30000}, {'answers': [], 'time': 30000},
      {'answers': [], 'time': 30000}, {'answers': [], 'time': 30000}, {'answers': [], 'time': 30000}, {'answers': [], 'time': 30000},
      {'answers': [], 'time': 30000}, {'answers': [], 'time': 30000}
    ];

    assert.equal(10, calcUserResult(fakeResults, 0, 10));
  });

  // для подсчета результата игры массива ответов пользователя в целях тестирования
  function getFakeUserResult(fastAnswer, wrongAnswer, totalQuestion) {
    const quickRation = statisticConfig.quickRatio;
    const normalRatio = statisticConfig.correctRatio;
    const failRatio = statisticConfig.failRatio;

    return fastAnswer * quickRation + (totalQuestion - fastAnswer) * normalRatio + wrongAnswer * failRatio;
  }

  it(`Должно быть ${getFakeUserResult(5, 2, 10)} когда 5 быстрых ответов и 2 ошибка`, function () {
    const fastAnswer = 5;
    const wronAnswer = 2;
    const totalQuestion = 10;

    let fakeResult = [
      {'answers': [], 'time': 20000}, {'answers': [], 'time': 30000}, {'answers': [], 'time': 20000}, {'answers': [], 'time': 30000},
      {'answers': [], 'time': 20000}, {'answers': [], 'time': 20000}, {'answers': [], 'time': 30000}, {'answers': [], 'time': 30000},
      {'answers': [], 'time': 30000}, {'answers': [], 'time': 20000}
    ];

    assert.equal(getFakeUserResult(fastAnswer, wronAnswer, totalQuestion), calcUserResult(fakeResult, wronAnswer, totalQuestion));
  });

  it(`Должно быть ${getFakeUserResult(2, 1, 10)} когда 2 быстрых ответов и 1 ошибка`, function () {
    const fastAnswer = 2;
    const wronAnswer = 1;
    const totalQuestion = 10;


    let fakeResult = [
      {'answers': [], 'time': 20000}, {'answers': [], 'time': 30000}, {'answers': [], 'time': 20000}, {'answers': [], 'time': 30000},
      {'answers': [], 'time': 30000}, {'answers': [], 'time': 30000}, {'answers': [], 'time': 30000}, {'answers': [], 'time': 30000},
      {'answers': [], 'time': 30000}, {'answers': [], 'time': 30000}
    ];

    assert.equal(getFakeUserResult(fastAnswer, wronAnswer, totalQuestion), calcUserResult(fakeResult, wronAnswer, totalQuestion));
  });
});

describe.skip('Проверка функции выбода результата игры', function () {

  it('Должен быть проигрыш, когда закончились попытки', function () {
    assert.match(getGameResult([11, 10, 8, 5, 4], {result: 8, lastLive: 0, lastTime: 50}), /попытки/);
    assert.match(getGameResult([11, 10, 8, 5, 4], {result: 5, lastLive: 0, lastTime: 50}), /попытки/);
  });

  it('Должен быть проигрыш, когда законилось время', function () {
    assert.match(getGameResult([11, 10, 8, 5, 4], {result: 9, lastLive: 1, lastTime: 0}), /Время/);
    assert.match(getGameResult([11, 10, 8, 5, 4], {result: 10, lastLive: 2, lastTime: 0}), /Время/);
  });

  it('Должен быть выигрыш, когда не закончились попытки и время', function () {
    assert.match(getGameResult([11, 10, 8, 5, 4], {result: 10, lastLive: 1, lastTime: 20}), /место/);
  });

  it('Должна правильно рассчитываться позиция игрока в общем рейтинге', function () {
    assert.match(getGameResult([15, 14, 13, 12, 10], {result: 16, lastLive: 1, lastTime: 20}), /1 место/);
    assert.match(getGameResult([15, 14, 13, 12, 10], {result: 10, lastLive: 1, lastTime: 20}), /5 место/);
    assert.match(getGameResult([16, 17, 18, 15, 14, 13, 12, 10], {result: 15, lastLive: 1, lastTime: 20}), /4 место/);
  });

  it('Должна правильно рассчитываться процент игроков с меньшим рейтингом', function () {
    assert.match(getGameResult([15, 14, 13, 12, 10], {result: 16, lastLive: 1, lastTime: 20}), /83%/);
    assert.match(getGameResult([20, 19, 15, 14, 13, 12, 11, 10], {result: 18, lastLive: 1, lastTime: 20}), /67%/);
    assert.match(getGameResult([15, 14, 13, 12], {result: 10, lastLive: 1, lastTime: 20}), /0%/);
    assert.match(getGameResult([16, 17, 18, 14, 13, 12, 10], {result: 15, lastLive: 1, lastTime: 20}), /50%/);
  });
});

describe('Проверка функции добавления рейтинга пользователя в общий рейтинг всех пользователей', function () {

  (function () {
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

  it('Возвращает объект вида {userPosition: .., totalUsers: .., percentRating: ..}', function () {
    assert.containsAllKeys(getUserRating([11, 10, 8, 6, 5, 4], 6), ['userPosition', 'totalUsers', 'percentRating']);
  });

  it('Правильно вычисляется позиция игрока в общем рейтинге', function () {
    assert.propertyVal(getUserRating([11, 10, 8, 6, 5, 4], 6), 'userPosition', 4);
    assert.propertyVal(getUserRating([11, 10, 8, 6, 5, 4], 4), 'userPosition', 6);
    assert.propertyVal(getUserRating([11, 10, 8, 6, 5, 4], 11), 'userPosition', 1);
  });

  it('Правильно возвращает общее количество игроков в общем рейтинге', function () {
    assert.propertyVal(getUserRating([11, 5, 4], 6), 'totalUsers', 3);
    assert.propertyVal(getUserRating([11, 10, 8, 6, 5, 4], 4), 'totalUsers', 6);
    assert.propertyVal(getUserRating([4], 11), 'totalUsers', 1);
  });

  it('Правильно рассчитывает процент пользователей у которых рейтинг меньше', function () {
    assert.propertyVal(getUserRating([11, 10, 8, 5, 4], 10), 'percentRating', 60);
    assert.propertyVal(getUserRating([11, 10, 8, 5, 4], 8), 'percentRating', 40);
    assert.propertyVal(getUserRating([15, 14, 13, 12, 11, 10, 8, 5, 4], 8), 'percentRating', 22);
    assert.propertyVal(getUserRating([15, 14, 13, 12, 11, 10, 8, 5, 4], 4), 'percentRating', 0);
    assert.propertyVal(getUserRating([15, 14, 13, 12, 11, 10, 8, 5, 4], 12), 'percentRating', 56);
    assert.propertyVal(getUserRating([15, 14, 13, 12, 11, 10, 8, 5, 4], 14), 'percentRating', 78);
  });
});

