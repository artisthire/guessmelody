import {getRandomIntInclusive} from '../utilities.js';
import {assert} from 'chai';

import {calcUserResult, getGameResult, updateRatings, getUserRating} from './statistics.js';

describe('Проверка функции подсчета статистики', function () {

  /**
 * Функция используется для генерации фальшивых результатов игры, в целях тестирования
 * @param {number} successAnswer - колличество правильных ответов
 * @param {number} fastAnswer - колличество быстрых ответов
 * @param {number} totalAnswers - общее колличество ответов, которые дал пользователей. По-умолчанию = 10
 * @return {object} - объект с массивом результатов игры
 *  [{result: true|false (правильный/неправильный ответ), time: {number} (секунд затраченных на ответ)}]
 */
  function getFakeAnswers(successAnswer, fastAnswer, totalAnswers = 10) {
    let answers = [];
    const FAST_TIME = 20 * 1000;
    const LOW_TIME = 40 * 1000;

    for (let i = totalAnswers; i--;) {
      answers.push({result: false, time: LOW_TIME});
    }

    const createArray = (length) => Array.from({length}, (v, k) => k);
    const shuffle = (array) => array.sort(() => Math.random() - 0.5);

    const trueAnswerIndexes = shuffle(createArray(totalAnswers)).slice(0, successAnswer);
    const fastAnswerIndexes = shuffle(createArray(totalAnswers)).slice(0, fastAnswer);

    for (let indexTrue of trueAnswerIndexes) {
      answers[indexTrue].result = true;
    }

    for (let indexFast of fastAnswerIndexes) {
      answers[indexFast].time = FAST_TIME;
    }

    return answers;
  }

  it('Должно быть -1, когда пользователь не успел ответить на все вопросы', function () {
    assert.equal(-1, calcUserResult(getFakeAnswers(5, 0, 8), 2));
    assert.equal(-1, calcUserResult(getFakeAnswers(2, 2, 5), 2));
  });

  it('Должно быть 10, когда ответы правильные но медленные', function () {
    assert.equal(10, calcUserResult(getFakeAnswers(10, 0), 2));
  });

  for (let i = 1; i <= 9; i = i + getRandomIntInclusive(1, 2)) {
    let notes = getRandomIntInclusive(0, 2);
    it(`Должно быть ${i * 2 + (10 - i) + (2 - notes) * -2}, когда ${i} быстрых ответов и осталось ${notes} жизней`, function () {
      assert.equal(i * 2 + (10 - i) + (2 - notes) * -2, calcUserResult(getFakeAnswers(10, i), notes));
    });
  }
});

describe('Проверка функции выбода результата игры', function () {

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

describe('Проверка функции добавления рейтинга пользователя в общий рейтинг', function () {

  it('Результат игрока должен добавляться в общий рейтинг игроков', function () {
    assert.deepInclude(updateRatings([11, 8, 5, 4], 10), 10);
    assert.deepInclude(updateRatings([11, 8, 5, 4], 6), 6);
  });

  it('Если такой рейтинг в массиве результатов есть, массив меняться не должен', function () {
    assert.deepEqual(updateRatings([11, 10, 8, 5, 4], 10), [11, 10, 8, 5, 4]);
    assert.deepEqual(updateRatings([11, 10, 8, 5, 4], 4), [11, 10, 8, 5, 4]);
  });

  it('Общий рейтинг отсортирован по убыванию', function () {
    assert.sameOrderedMembers(updateRatings([11, 10, 8, 5, 4], 6), [11, 10, 8, 6, 5, 4]);
    assert.sameOrderedMembers(updateRatings([15, 10, 8, 5, 4], 12), [15, 12, 10, 8, 5, 4]);
    assert.sameOrderedMembers(updateRatings([11, 10, 8, 5, 4], 12), [12, 11, 10, 8, 5, 4]);
    assert.sameOrderedMembers(updateRatings([11, 10, 8, 5, 4], 3), [11, 10, 8, 5, 4, 3]);
  });
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

