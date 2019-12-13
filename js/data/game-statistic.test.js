import {getRandomIntInclusive} from '../utilities.js';
import {assert} from 'chai';

import {calcUserResult, getUserResult, updateRatings, getUserRating} from './game-statistic.js';

describe('Проверка функции подсчета статистики', function () {

  function getFakeAnswers(successAnswer, littleTime) {
    let answers = [];
    let time = littleTime;
    let answer;

    for (let i = 0; i < successAnswer; i++) {
      answer = time > 0 ? {result: true, time: 20} : {result: true, time: 40};
      answers.push(answer);
      time--;
    }

    return answers;
  }


  it('Должно быть -1, когда ответом меньше чем нужно', function () {
    assert.equal(-1, calcUserResult(getFakeAnswers(8, 0)));
    assert.equal(-1, calcUserResult(getFakeAnswers(5, 0)));
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
    assert.match(getUserResult([11, 10, 8, 5, 4], {rating: 8, lastLive: 0, lastTime: 50}), /попытки/);
    assert.match(getUserResult([11, 10, 8, 5, 4], {rating: 5, lastLive: 0, lastTime: 50}), /попытки/);
  });

  it('Должен быть проигрыш, когда законилось время', function () {
    assert.match(getUserResult([11, 10, 8, 5, 4], {rating: 9, lastLive: 1, lastTime: 0}), /Время/);
    assert.match(getUserResult([11, 10, 8, 5, 4], {rating: 10, lastLive: 2, lastTime: 0}), /Время/);
  });

  it('Должен быть выигрыш, когда не закончились попытки и время', function () {
    assert.match(getUserResult([11, 10, 8, 5, 4], {rating: 10, lastLive: 1, lastTime: 20}), /место/);
  });

  it('Должна правильно рассчитываться позиция игрока в общем рейтинге', function () {
    assert.match(getUserResult([15, 14, 13, 12, 10], {rating: 16, lastLive: 1, lastTime: 20}), /1 место/);
    assert.match(getUserResult([15, 14, 13, 12, 10], {rating: 10, lastLive: 1, lastTime: 20}), /5 место/);
    assert.match(getUserResult([16, 17, 18, 15, 14, 13, 12, 10], {rating: 15, lastLive: 1, lastTime: 20}), /4 место/);
  });

  it('Должна правильно рассчитываться процент игроков с меньшим рейтингом', function () {
    assert.match(getUserResult([15, 14, 13, 12, 10], {rating: 16, lastLive: 1, lastTime: 20}), /83%/);
    assert.match(getUserResult([20, 19, 15, 14, 13, 12, 11, 10], {rating: 18, lastLive: 1, lastTime: 20}), /67%/);
    assert.match(getUserResult([15, 14, 13, 12], {rating: 10, lastLive: 1, lastTime: 20}), /0%/);
    assert.match(getUserResult([16, 17, 18, 14, 13, 12, 10], {rating: 15, lastLive: 1, lastTime: 20}), /50%/);
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

/* Для тестирования внутренней функции подсчета рейтинга пользователя
// Заменена на проверку правильности формирования строки в функции getUserResult которая использует getUserRating
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

  it('Правильно рассчитывает процент пользователей у которых рейтинг меньше', function (){
    assert.propertyVal(getUserRating([11, 10, 8, 5, 4], 10), 'percentRating', 60);
    assert.propertyVal(getUserRating([11, 10, 8, 5, 4], 8), 'percentRating', 40);
    assert.propertyVal(getUserRating([15, 14, 13, 12, 11, 10, 8, 5, 4], 8), 'percentRating', 22);
    assert.propertyVal(getUserRating([15, 14, 13, 12, 11, 10, 8, 5, 4], 4), 'percentRating', 0);
    assert.propertyVal(getUserRating([15, 14, 13, 12, 11, 10, 8, 5, 4], 12), 'percentRating', 56);
    assert.propertyVal(getUserRating([15, 14, 13, 12, 11, 10, 8, 5, 4], 14), 'percentRating', 78);
  });
});
*/
