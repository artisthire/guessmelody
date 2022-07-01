/**
 * Модуль содержит для получения/отправки данных на сервер
 */
import staticData from '../data/game-static-data.js';
import {GAME_DATA} from '../data/data.js';
import {getRandomIntInclusive} from '../utilities.js';

// ссылки на URL-адрес взаимодействия с сервером
// тестовые, должны быть заменены на реальные адреса
const SERVER_URLS = {
  questions: 'https://dummyjson.com/products',
  getStatistics: 'https://dummyjson.com/products/1',
  setStatistics: 'https://dummyjson.com/products/add'
};

/**
 * Функция получения данных по вопросам с сервера
 * Временно генерирует объект с вопросами для уровней игры на основе статических данных
 * @return {object} - объект с данными о вопросах
 */
export async function loadQuestions() {
  // временно генерируем статические данные
  const gameQuestions = getQuestions(
      ['artist', 'genre', 'genre', 'genre', 'artist', 'artist', 'genre', 'genre', 'artist', 'artist'],
      ['Кто исполняет эту песню?', 'Выберите рок треки', 'Выберите джаз треки', 'Выберите РНБ треки',
        'Кто исполняет эту песню?', 'Кто исполняет эту песню?', 'Выберите поп треки', 'Выберите электроник треки',
        'Кто исполняет эту песню?', 'Кто исполняет эту песню?']
  );

  const response = await fetch(SERVER_URLS.questions, {
    method: 'GET',
    redirect: 'follow'
  });

  checkServerResp(response);

  await response.json();

  // временно возвращаем статические данные для игры
  // нужно заменить на реальное взаимодействие с сервером
  return gameQuestions;
}

/**
 * Функция получения статистики с результатами игор пользователей с сервера
 * Временно сохраняет статические данные локально, без взаимодейстия с сервером
 * @return {array} - массив статистики результатов игры всех пользователей
 */
export async function loadStatistics() {
  // временно мокаем локальное хранилище статическими данными
  // пока не будет правильного URL на сервер хранения статистики
  if (!GAME_DATA.statistics.length) {
    GAME_DATA.statistics = [11, 10, 9];
  }

  // запрос на URL с уникальным номером сессии текущей игры
  const url = `${SERVER_URLS.getStatistics}?appId=${GAME_DATA.appId}`;

  // запрос статистики
  const response = await fetch(url, {
    method: 'GET',
    redirect: 'follow'
  });

  // проверка статуса ответа
  checkServerResp(response);
  await response.json();

  return GAME_DATA.statistics;
}

/**
 * Функция отправки результатов игры на сервер
 * Временно сохраняет результаты локально, без взаимодействия с сервером
 * @param {array} statistics - массив статистики результатов игры других пользователей и текущего игрока
 */
export async function sendStatistics(statistics) {
  // временно сохраняем статические данные локально
  GAME_DATA.statistics = statistics;

  // запрос на URL с уникальным номером сессии текущей игры
  const url = `${SERVER_URLS.setStatistics}?appId=${GAME_DATA.appId}`;
  const body = {answers: statistics};

  // запрос статистики
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(body)
  });

  // проверка статуса ответа
  checkServerResp(response);
}

/**
 * Функция проверки статуса ответа сервера
 * @param {object} response - объект со статусом ответа
 */
function checkServerResp(response) {
  if (!response.ok) { // если HTTP-статус НЕ в диапазоне 200-299
    // получаем тело ответа
    throw new Error();
  }
}

/**
 * Временная функция для генерации вопросов для игры на основе статической информации
 * @param {array} types - массив типов каждого вопроса ('artist' - угадай исполнителя, 'genre' - жанр)
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
