import {assert} from 'chai';

import {getTimeComponents, getRandomIntInclusive} from './utilities.js';

describe('Тест функции получения компонентов времени', function () {

  it(`Должна возвращать массив строкового представления минут и секунд из времени заданного в миллисекундах`, function () {
    let time = 3 * 60 * 1000 + 25 * 1000;
    assert.deepEqual(['03', '25'], getTimeComponents(time));

    time = 4 * 60 * 1000 + 0 * 1000;
    assert.deepEqual(['04', '00'], getTimeComponents(time));
  });

});
