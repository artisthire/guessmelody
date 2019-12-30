/**
 * Содержит структуры данных для использования в игре
 */
import staticGameData from './game-static-data.js';

// состояние игры
// в statistics добавляются результаты ответов по каждому уровню
export const gameState = {
  level: 0,
  lifes: 3,
  statistics: []
};

// структура, хранящая результаты игры пользователя
export const levelResult = {
  answers: [],
  time: 0
};

// структура, хранящая вопросы для всех уровней игры
const questionTemplate = {
  type: '',
  title: '',
  srcs: [],
  answers: []
};

// структура для хранения информации по ответам на вопросы
export const answerTemplate = {
  artist: '',
  name: '',
  img: '',
  src: '',
  isCorrect: true
};

export const questions = getQuestions(
    ['artist', 'genre', 'genre', 'genre', 'artist', 'artist', 'genre', 'genre', 'artist', 'artist'],
    ['Кто исполняет эту песню?', 'Выберите рок треки', 'Выберите джаз треки', 'Выберите РНБ треки', 'Кто исполняет эту песню?', 'Кто исполняет эту песню?', 'Выберите поп треки', 'Выберите электроник треки', 'Кто исполняет эту песню?', 'Кто исполняет эту песню?'],
    [[0], [1], [0, 1], [3, 4], [5], [4], [3, 4], [5, 1], [2], [3]],
    [[0, 1, 2], [1, 0, 2, 3], [0, 1, 2, 3], [3, 4, 2, 5], [5, 1, 2], [4, 1, 3], [4, 3, 2, 5], [1, 5, 2, 3], [2, 1, 3], [3, 1, 4]]
);

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
      tempArr.push(staticGameData[currentSrc].src);
    });

    question.srcs = Object.assign([], tempArr);
    tempArr = [];

    currentAnswers.forEach((currentAnswer) => {
      const answer = Object.assign({}, answerTemplate);

      answer.artist = staticGameData[currentAnswer].artist;
      answer.name = staticGameData[currentAnswer].name;
      answer.img = staticGameData[currentAnswer].image;
      answer.src = staticGameData[currentAnswer].src;
      answer.isCorrect = currentSrcs.includes(currentAnswer);

      tempArr.push(answer);
    });

    question.answers = tempArr;

    gameQuestions.push(question);
  });

  return gameQuestions;
}


