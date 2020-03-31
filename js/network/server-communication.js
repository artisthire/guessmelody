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
      ['Кто исполняет эту песню?', 'Выберите рок треки', 'Выберите джаз треки', 'Выберите РНБ треки', 'Кто исполняет эту песню?', 'Кто исполняет эту песню?', 'Выберите поп треки', 'Выберите электроник треки', 'Кто исполняет эту песню?', 'Кто исполняет эту песню?']
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
 * @return {array} - массив объектов с вопросами и вариантами ответов для каждого уровня игры
 */
function getQuestions(types, titles) {
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

  // здесь будет сгенерированный массив вопросов и ответов к игре
  const gameQuestions = [];

  types.forEach((type, index) => {
    const question = Object.assign({}, questionTemplate);

    question.type = type;
    question.title = titles[index];

    // генерируем массивы случайных числе для вопросов и вариантов ответов
    // в массивы попадут только индексы ограничивающиеся длинной статического массива данных {staticData}
    const questionIndexes = new Set();
    const answerIndexes = new Set();

    if (type === 'artist') {
      // для типа игры на выбо артиста
      // 3 варианта ответов
      while (answerIndexes.size < 3) {
        answerIndexes.add(getRandomIntInclusive(0, staticData.length - 1));
      }

      // 1 вопрос
      questionIndexes.add(Array.from(answerIndexes)[getRandomIntInclusive(0, answerIndexes.size - 1)]);

    } else if (type === 'genre') {
      // для типа игры на выбо жанра
      // 4 варианта ответов
      while (answerIndexes.size < 4) {
        answerIndexes.add(getRandomIntInclusive(0, staticData.length - 1));
      }

      // 1 вопрос, но генерируется масси индексов от 1 до 2 вариантов
      // поскольку корректность вариантов в этой функции устанавливается
      // путем сравнения ссылки на аудиофайл в вопросах и вариантах ответов
      const questionVariants = getRandomIntInclusive(1, 2);

      while (questionIndexes.size < questionVariants) {
        questionIndexes.add(Array.from(answerIndexes)[getRandomIntInclusive(0, answerIndexes.size - 1)]);
      }
    }

    // временный массив в который будут копироваться результаты вложенных объектов для src и answer
    // т.к. Object.assign создаст поверхностную копию, а внутренние объекты будут ссылками
    // и без этого объекта во все внутренние объекты question для каждого уровня запишутся одни и те же ответы и src
    let tempArr = [];
    // заполняем массив вопросам ссылками на аудиофайлы
    questionIndexes.forEach((currentSrc) => {
      tempArr.push(staticData[currentSrc].src);
    });

    question.srcs = Object.assign([], tempArr);
    tempArr = [];

    // заполняем массив ответов
    answerIndexes.forEach((currentAnswer) => {
      const answer = Object.assign({}, answerTemplate);

      answer.artist = staticData[currentAnswer].artist;
      answer.name = staticData[currentAnswer].name;
      answer.img = staticData[currentAnswer].image;
      answer.src = staticData[currentAnswer].src;
      answer.isCorrect = questionIndexes.has(currentAnswer);

      tempArr.push(answer);
    });

    question.answers = tempArr;

    // сохраняем данные по вопросам/ответам по каждому уровню в общий массив
    gameQuestions.push(question);
  });

  return gameQuestions;
}
