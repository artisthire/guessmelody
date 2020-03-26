/**
 * Модуль содержит для получения/отправки данных на сервер
 */
import staticData from '../data/game-static-data.js';
import {GAME_DATA} from '../data/data.js';
import {getRandomIntInclusive} from '../utilities.js';

/**
 * Функция получения данных по вопросам с сервера
 * @return {object} - объект с данными о вопросах
 */
export async function loadGameData() {
  // временно возвращаем статические данные для игры
  // нужно заменить на реальное взаимодействие с сервером
  const gameData = await Promise.resolve(staticData);

  return gameData;
}

/**
 * Функция получения данных по вопросам с сервера
 * Временно генерирует объект с вопросами для уровней игры на основе статических данных
 * @return {object} - объект с данными о вопросах
 */
export async function loadQuestions() {
  // временно возвращаем статические данные для игры
  // нужно заменить на реальное взаимодействие с сервером
  // имитация задержки по сети
  await new Promise((resolve) => setTimeout(() => resolve(), getRandomIntInclusive(15, 100)));

  const gameQuestions = getQuestions(
      ['artist', 'genre', 'genre', 'genre', 'artist', 'artist', 'genre', 'genre', 'artist', 'artist'],
      ['Кто исполняет эту песню?', 'Выберите рок треки', 'Выберите джаз треки', 'Выберите РНБ треки', 'Кто исполняет эту песню?', 'Кто исполняет эту песню?', 'Выберите поп треки', 'Выберите электроник треки', 'Кто исполняет эту песню?', 'Кто исполняет эту песню?'],
      [[0], [1], [0, 1], [3, 4], [5], [4], [3, 4], [5, 1], [2], [3]],
      [[0, 1, 2], [1, 0, 2, 3], [0, 1, 2, 3], [3, 4, 2, 5], [5, 1, 2], [4, 1, 3], [4, 3, 2, 5], [1, 5, 2, 3], [2, 1, 3], [3, 1, 4]]
  );

  return gameQuestions;
}

/**
 * Функция получения статистики с результатами игор пользователей с сервера
 * Временно сохраняет статические данные в sessionStorage, без взаимодейстия с сервером
 * @return {array} - массив статистики результатов игры всех пользователей
 */
export async function loadStatistics() {
  // имитация задержки по сети
  await new Promise((resolve) => setTimeout(() => resolve(), getRandomIntInclusive(15, 100)));

  if (!GAME_DATA.statistics.length) {
    GAME_DATA.statistics = [11, 10, 9];
  }

  return GAME_DATA.statistics;
}

/**
 * Функция отправки результатов игры на сервер
 * Временно сохраняет результаты в sessionStorage, без взаимодействия с сервером
 * @param {array} statistics - массив статистики результатов игры других пользователей и текущего игрока
 */
export async function sendStatistics(statistics) {
  // имитация задержки по сети
  await new Promise((resolve) => setTimeout(() => resolve(), getRandomIntInclusive(15, 100)));

  GAME_DATA.statistics = statistics;
}

/**
 * Временная функция для генерации вопросов для игры на основе статической информации
 * @param {array} types - массив строк указывающих на тип каждого вопроса ('artist' - угадай исполнителя, 'genre' - жанр)
 * @param {array} titles - массив содержащий строки с тексотом вопроса
 * @param {array} srcs - массив с массивами номеров индексов со ссылками на SRC музыкальных файлов.
 *  Используется как массив содержащий индексы правильных ответов на вопросы. А также для типа игры 'artist' как источник для аудиофайла в вопросе.
 * @param {array} answerIndexes - массив с массивами номеров индексов указывающих на номер информации по аудиофайлу в статических данных
 *  Используется при генерации информации по вариантам ответов. Также сопоставляется с массивом в srcs для поиска правильных ответов.
 * @return {array} - массив объектов с вопросами и вариантами ответов для каждого уровня игры
 */
function getQuestions(types, titles, srcs, answerIndexes) {
  // структура, хранящая вопросы для всех уровней игры
  const questionTemplate = {
    type: '',
    title: '',
    srcs: [],
    answers: []
  };

  // структура для хранения информации по ответам на вопросы
  const answerTemplate = {
    artist: '',
    name: '',
    img: '',
    src: '',
    isCorrect: true
  };

  const gameQuestions = [];

  types.forEach((type, index) => {
    const question = Object.assign({}, questionTemplate);

    question.type = type;
    question.title = titles[index];

    const currentSrcs = srcs[index];
    const currentAnswers = answerIndexes[index];
    // временный массив в который будут копироваться результаты вложенных объектов для src и answer
    // т.к. Object.assign создаст поверхностную копию, а внутренние объекты будут ссылками
    // и без этого объекта во все внутренние объекты question для каждого уровня запишутся одни и те же ответы и src
    let tempArr = [];

    currentSrcs.forEach((currentSrc) => {
      tempArr.push(staticData[currentSrc].src);
    });

    question.srcs = Object.assign([], tempArr);
    tempArr = [];

    currentAnswers.forEach((currentAnswer) => {
      const answer = Object.assign({}, answerTemplate);

      answer.artist = staticData[currentAnswer].artist;
      answer.name = staticData[currentAnswer].name;
      answer.img = staticData[currentAnswer].image;
      answer.src = staticData[currentAnswer].src;
      answer.isCorrect = currentSrcs.includes(currentAnswer);

      tempArr.push(answer);
    });

    question.answers = tempArr;

    gameQuestions.push(question);
  });

  return gameQuestions;
}
