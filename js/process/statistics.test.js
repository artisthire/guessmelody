/**
 * Модуль тестирования функций подсчета статистики игры
 */
import {assert} from 'chai';

import {isFastAnswer, calcUserResult, getResultMessage, updateRatings, getResultPosition} from './statistics.js';
import {GAME_PARAM} from '../data/config.js';

describe('isFastAnswer - функция скорости ответа на вопросы', function () {

  it('Должно быть FALSE, когда ответ Медленный', function () {
    assert.isNotTrue(isFastAnswer(GAME_PARAM.limitTime));
  });

  it('Должно быть TRUE, когда ответ Быстрый', function () {
    assert.isTrue(isFastAnswer(GAME_PARAM.limitTime - 1));
  });

});

describe('calcUserResult - проверка функции подсчета статистики', function () {
  // для подсчета результата игры массива ответов пользователя в целях тестирования
  function getFakeUserResult(quickAnswer, wrongAnswer, totalQuestions) {
    const quickRation = GAME_PARAM.quickRatio;
    const normalRatio = GAME_PARAM.correctRatio;
    const failRatio = GAME_PARAM.failRatio;

    return quickAnswer * quickRation + (totalQuestions - quickAnswer) * normalRatio + wrongAnswer * failRatio;
  }

  it(`Должно быть ${getFakeUserResult(0, 0, 10)} баллов и 0 быстрых ответов, когда ответы правильные но медленные`, function () {
    const quickAnswer = 0;
    const wrongAnswer = 0;
    const totalQuestions = 10;

    const fakeResults = [
      {'time': 30}, {'time': 30}, {'time': 30}, {'time': 30}, {'time': 30},
      {'time': 30}, {'time': 30}, {'time': 30}, {'time': 30}, {'time': 30}
    ];

    assert.deepEqual({quickAnswer, 'ball': getFakeUserResult(quickAnswer, wrongAnswer, totalQuestions)}, calcUserResult(fakeResults, wrongAnswer, totalQuestions));
  });

  it(`Должно быть ${getFakeUserResult(5, 2, 10)} баллов и 5 быстрых ответов, когда 5 быстрых ответов и 2 ошибки`, function () {
    const quickAnswer = 5;
    const wrongAnswer = 2;
    const totalQuestions = 10;

    const fakeResults = [
      {'time': 20}, {'time': 20}, {'time': 20}, {'time': 30}, {'time': 30},
      {'time': 20}, {'time': 20}, {'time': 30}, {'time': 30}, {'time': 30}
    ];

    assert.deepEqual({quickAnswer, 'ball': getFakeUserResult(quickAnswer, wrongAnswer, totalQuestions)}, calcUserResult(fakeResults, wrongAnswer, totalQuestions));
  });

  it(`Должно быть ${getFakeUserResult(2, 1, 10)} баллов и 2 быстрых ответа, когда 2 быстрых ответа и 1 ошибка`, function () {
    const quickAnswer = 2;
    const wrongAnswer = 1;
    const totalQuestions = 10;

    const fakeResults = [
      {'time': 20}, {'time': 30}, {'time': 30}, {'time': 30}, {'time': 30},
      {'time': 20}, {'time': 30}, {'time': 30}, {'time': 30}, {'time': 30}
    ];

    assert.deepEqual({quickAnswer, 'ball': getFakeUserResult(quickAnswer, wrongAnswer, totalQuestions)}, calcUserResult(fakeResults, wrongAnswer, totalQuestions));
  });
});

describe('getResultMessage - Проверка функции вывода результата игры', function () {

  it('Должен быть проигрыш, когда закончились попытки', function () {
    assert.match(getResultMessage({isDie: true}), /попытки/);
  });

  it('Должен быть проигрыш, когда законилось время', function () {
    assert.match(getResultMessage({overTime: true}), /Время/);
  });

  it('Должен быть выигрыш, когда получены все ответы, не закончились попытки и время', function () {
    const message = getResultMessage({isDie: false, overTime: false}, {wrong: 1, totalTime: 3 * 60 + 25, currentTime: 0}, [10, 9, 8], {ball: 9, quickAnswer: 1});
    assert.match(message, /меломан/);
  });
});

describe('updateRatings - проверка функции добавления рейтинга пользователя в общий рейтинг', function () {

  it('Если нет других результатов, должен создаваться новый рейтинг', function () {
    assert.deepEqual(updateRatings([], 10), [10]);
  });


  it('Если такой рейтинг в массиве результатов есть, массив меняться не должен', function () {
    assert.deepEqual(updateRatings([10, 9], 9), [10, 9]);
  });

  it('Если рейтинга текущего пользователя в общем массиве нет, он должен в него добавляться', function () {
    assert.deepEqual(updateRatings([10, 9], 8), [10, 9, 8]);
  });


  it('Общий рейтинг отсортирован по убыванию', function () {
    assert.sameOrderedMembers(updateRatings([10, 8], 9), [10, 9, 8]);
  });

});

// Для тестирования внутренней функции подсчета рейтинга пользователя
describe('getResultPosition - проверка функции расчета рейтинга текущего результата игры', function () {

  it('Возвращает объект вида {positionInRating: .., totalUsers: .., percentRating: ..}', function () {
    assert.containsAllKeys(getResultPosition([11, 10, 8, 6, 5, 4], 6), ['positionInRating', 'totalUsers', 'percentRating']);
  });

  it('Правильно рассчитывает рейтинги, если других результатов нет', function () {
    assert.deepEqual(getResultPosition([], 10), {positionInRating: 1, totalUsers: 1, percentRating: 100});
  });

  it('Правильно вычисляется позиция игрока в общем рейтинге', function () {
    assert.propertyVal(getResultPosition([6, 4], 4), 'positionInRating', 2);
    assert.propertyVal(getResultPosition([11, 10, 8, 6, 5, 4], 4), 'positionInRating', 6);
    assert.propertyVal(getResultPosition([11, 10, 8, 6, 5, 4], 11), 'positionInRating', 1);
  });

  it('Правильно возвращает общее количество игроков в общем рейтинге', function () {
    assert.propertyVal(getResultPosition([11, 5, 4], 6), 'totalUsers', 3);
    assert.propertyVal(getResultPosition([11, 10, 8, 6, 5, 4], 4), 'totalUsers', 6);
    assert.propertyVal(getResultPosition([4], 11), 'totalUsers', 1);
  });

  it('Правильно рассчитывает процент пользователей у которых рейтинг меньше', function () {
    assert.propertyVal(getResultPosition([4], 4), 'percentRating', 0);
    assert.propertyVal(getResultPosition([6, 4], 6), 'percentRating', 50);
    assert.propertyVal(getResultPosition([11, 10, 8, 5], 10), 'percentRating', 50);
    assert.propertyVal(getResultPosition([11, 10, 8, 5], 8), 'percentRating', 25);
    assert.propertyVal(getResultPosition([11, 10, 8, 5], 5), 'percentRating', 0);
    assert.propertyVal(getResultPosition([11, 10, 8], 10), 'percentRating', 33);
  });
});

