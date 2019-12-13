import {calcUserResult} from './game-statistic.js';
import {getRandomIntInclusive} from '../utilities.js';
import {assert} from 'chai';

describe('Проверка функции подсчета статистики', function () {

  function getFakeAnswers(successAnswer, littleTime) {
    const TOTAL_ANSWERS = 10;
    let answers = [];
    let time = littleTime;
    let answer;

    for (let i = 0; i < successAnswer; i++) {
      answer = time > 0 ? {result: true, time: 20} : {result: true, time: 40};
      answers.push(answer);
      time--;
    }

    for (let i = 0; i < (TOTAL_ANSWERS - successAnswer); i++) {
      answers.push({result: false, time: 10});
    }

    return answers;
  }


  it('Должно быть -1 когда ответом меньше чем нужно', function () {
    assert.equal(-1, calcUserResult(getFakeAnswers(8, 0)));
    assert.equal(-1, calcUserResult(getFakeAnswers(5, 0)));
  });

  it('Должно быть 10 когда ответы правильные но медленные', function () {
    assert.equal(10, calcUserResult(getFakeAnswers(10, 0), 2));
  });

  for (let i = 1; i <= 9; i = i + getRandomIntInclusive(1, 2)) {
    let notes = getRandomIntInclusive(0, 2);
    it(`Должно быть ${i * 2 + (10 - i) + (2 - notes) * -2} когда ${i} быстрых ответов и осталось ${notes} жизней`, function () {
      assert.equal(i * 2 + (10 - i) + (2 - notes) * -2, calcUserResult(getFakeAnswers(10, i), notes));
    });
  }
});
