/**
 * Модуль тестирования функций подсчета статистики игры
 */
import {assert} from 'chai';

import {calcUserResult, getGameEndMessage, updateRatings, getUserRating} from './statistics.js';
import {initConfig, statisticConfig} from './config.js';


describe('calcUserResult - проверка функции подсчета статистики', function () {
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

describe('Проверка функции вывода результата игры', function () {

  it('Должен быть проигрыш, когда закончились попытки', function () {
    getGameEndMessage(initConfig.gameEndCode['failTries'])
    .then((message) => assert.match(message, /попытки/));
  });

  it('Должен быть проигрыш, когда законилось время', function () {
    getGameEndMessage(initConfig.gameEndCode['failTime'])
    .then((message) => assert.match(message, /Время/));
  });

  it('Должен быть выигрыш, когда получены все ответы, не закончились попытки и время', function () {
    const wrongAnswer = 1;
    const totalQuestions = 10;
    const lastTime = (3 * 60 + 25) * 1000;
    const fakeResults = [
      {'time': 20000}, {'time': 30000}, {'time': 30000}, {'time': 30000}, {'time': 30000},
      {'time': 20000}, {'time': 30000}, {'time': 30000}, {'time': 30000}, {'time': 30000}
    ];

    getGameEndMessage(initConfig.gameEndCode['complete'], {statistics: fakeResults, wrongAnswer, totalQuestions, lastTime})
    .then((message) => assert.match(message, /меломан/));
  });
});

describe('updateRatings - проверка функции добавления рейтинга пользователя в общий рейтинг', function () {

  it('Если нет других результатов, должен создаваться новый рейтинг', function () {
    updateRatings(10)
    .then((ratings) => assert.deepEqual(ratings, [10]));
  });


  it('Если такой рейтинг в массиве результатов есть, массив меняться не должен', function () {
    updateRatings(10)
    .then(() => updateRatings(9))
    .then(() => updateRatings(9))
    .then((ratings) => assert.deepEqual(ratings, [10, 9]));
  });

  it('Если рейтинга текущего пользователя в общем массиве нет, он должен в него добавляться', function () {
    updateRatings(10)
    .then(() => updateRatings(9))
    .then(() => updateRatings(8))
    .then((ratings) => assert.deepEqual(ratings, [10, 9, 8]));
  });


  it('Общий рейтинг отсортирован по убыванию', function () {
    updateRatings(10)
    .then(() => updateRatings(8))
    .then(() => updateRatings(9))
    .then((ratings) => assert.sameOrderedMembers(ratings, [10, 9, 8]));
  });

});

// Для тестирования внутренней функции подсчета рейтинга пользователя
describe('getUserRating - проверка функции расчета рейтинга текущего пользователя игры', function () {

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
    assert.propertyVal(getUserRating([4], 4), 'percentRating', 0);
    assert.propertyVal(getUserRating([6, 4], 6), 'percentRating', 50);
    assert.propertyVal(getUserRating([11, 10, 8, 5], 10), 'percentRating', 50);
    assert.propertyVal(getUserRating([11, 10, 8, 5], 8), 'percentRating', 25);
    assert.propertyVal(getUserRating([11, 10, 8, 5], 5), 'percentRating', 0);
    assert.propertyVal(getUserRating([11, 10, 8], 10), 'percentRating', 33);
  });
});

