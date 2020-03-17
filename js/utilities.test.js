import {assert} from 'chai';

import {getTimeComponents, getTimeAnimationRadius} from './utilities.js';

describe('Тест функции получения компонентов времени', function () {

  it(`Должна возвращать массив строкового представления минут и секунд из времени заданного в миллисекундах`, function () {
    let time = 3 * 60 + 25;
    assert.deepEqual({minuts: '03', seconds: '25'}, getTimeComponents(time));

    time = 4 * 60;
    assert.deepEqual({minuts: '04', seconds: '00'}, getTimeComponents(time));
  });

});

describe(`getTimeAnimationRadius - корректно вычисляет параметры отображения длинны окружности анимации оставшегося внемени`, () => {

  it(`Должна вернуть полную длинну и 0 offset в начальном состоянии`, () => {
    // circleLength = 628.5
    assert.equal(getTimeAnimationRadius(1, 628.5).stroke, 629);
    assert.equal(getTimeAnimationRadius(1, 628.5).offset, 0);
  });

  it(`Должна вернуть полную длинну и offset на полную длинну в конечном состоянии`, () => {
    // circleLength = 628.2
    assert.equal(getTimeAnimationRadius(0, 628.2).stroke, 629);
    assert.equal(getTimeAnimationRadius(0, 628.2).offset, 629);
  });

  it(`Offset и длинна должны быть одинаковые, когда прошла половина времени`, () => {
    // circleLength = 628.8
    assert.equal(getTimeAnimationRadius(0.5, 628.8).stroke, 629);
    assert.equal(getTimeAnimationRadius(0.5, 628.8).offset, 314);
  });

});

