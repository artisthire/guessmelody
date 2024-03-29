import {assert} from 'chai';

import {hasWrongAnswer, getSelectedAnswers} from './process.js';


describe('Функция проверки наличия неправильных ответов', function () {

  it('Должно быть FALSE, когда все ответы правильные', function () {
    assert.isNotTrue(hasWrongAnswer([false, false, true, true, false],
        [{isCorrect: false}, {isCorrect: false}, {isCorrect: true}, {isCorrect: true}, {isCorrect: false}]));
  });

  it('Должно быть TRUE, когда выбраны не все правильные ответы', function () {
    assert.isTrue(hasWrongAnswer([false, false, true, true, false],
        [{isCorrect: false}, {isCorrect: true}, {isCorrect: true}, {isCorrect: true}, {isCorrect: false}]));
  });

  it('Должно быть TRUE, когда выбран хоть один неправильный ответ', function () {
    assert.isTrue(hasWrongAnswer([false, true, true, true, false],
        [{isCorrect: false}, {isCorrect: false}, {isCorrect: true}, {isCorrect: true}, {isCorrect: false}]));
  });

});

describe('Функция получения выбранных вариантов ответов', function () {

  it('Должна выдавать колличество ответов, соответствующее колличеству выбранных вариантов', function () {
    assert.lengthOf(getSelectedAnswers([false, false, true, true, false], ['a', 'b', 'c', 'd', 'e']), 2);
  });

  it('Должна выдавать только те варианты ответов, которые были выбраны пользователем', function () {
    assert.deepEqual(getSelectedAnswers([true, false, true, true, false], ['a', 'b', 'c', 'd', 'e']), ['a', 'c', 'd']);
  });

});
