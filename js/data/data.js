/**
 * Содержит структуры данных для использования в игре
 */

import staticGameData from './game-static-data.js';

export const gameState = {
  level: 0,
  lives: 2,
  time: 5
};

export const statistic = {
  minTime: null,
  maxTime: null,
  balls: null,
  rating: null
};

export const resultAnswers = [
  {
    isCorrect: true,
    src: ''
  }
];

export const questions = [
  {
    type: 'artist',
    title: 'Кто исполняет эту песню?',
    src: [staticGameData[0].src],
    answers: [
      {
        name: staticGameData[0].name,
        avatar: staticGameData[0].image,
        src: staticGameData[0].src
      },
      {
        name: staticGameData[1].name,
        avatar: staticGameData[1].image,
        src: staticGameData[1].src
      },
      {
        name: staticGameData[2].name,
        avatar: staticGameData[2].image,
        src: staticGameData[2].src
      },
    ]
  },
  {
    type: 'genre',
    title: 'Выберите рок треки',
    src: [staticGameData[1].src],
    answers: [
      {
        name: staticGameData[1].name,
        avatar: staticGameData[1].image,
        src: staticGameData[1].src
      },
      {
        name: staticGameData[0].name,
        avatar: staticGameData[0].image,
        src: staticGameData[0].src
      },
      {
        name: staticGameData[2].name,
        avatar: staticGameData[2].image,
        src: staticGameData[2].src
      },
      {
        name: staticGameData[3].name,
        avatar: staticGameData[3].image,
        src: staticGameData[3].src
      },
    ]
  },
  {
    type: 'genre',
    title: 'Выберите джаз треки',
    src: [staticGameData[0].src, staticGameData[1].src],
    answers: [
      {
        name: staticGameData[0].name,
        avatar: staticGameData[0].image,
        src: staticGameData[0].src
      },
      {
        name: staticGameData[1].name,
        avatar: staticGameData[1].image,
        src: staticGameData[1].src
      },
      {
        name: staticGameData[2].name,
        avatar: staticGameData[2].image,
        src: staticGameData[2].src
      },
      {
        name: staticGameData[3].name,
        avatar: staticGameData[3].image,
        src: staticGameData[3].src
      },
    ]
  },
  {
    type: 'genre',
    title: 'Выберите РНБ треки',
    src: [staticGameData[3].src, staticGameData[4].src],
    answers: [
      {
        name: staticGameData[3].name,
        avatar: staticGameData[3].image,
        src: staticGameData[3].src
      },
      {
        name: staticGameData[4].name,
        avatar: staticGameData[4].image,
        src: staticGameData[4].src
      },
      {
        name: staticGameData[2].name,
        avatar: staticGameData[2].image,
        src: staticGameData[2].src
      },
      {
        name: staticGameData[5].name,
        avatar: staticGameData[5].image,
        src: staticGameData[5].src
      },
    ]
  },
  {
    type: 'artist',
    title: 'Кто исполняет эту песню?',
    src: [staticGameData[5].src],
    answers: [
      {
        name: staticGameData[5].name,
        avatar: staticGameData[5].image,
        src: staticGameData[5].src
      },
      {
        name: staticGameData[1].name,
        avatar: staticGameData[1].image,
        src: staticGameData[1].src
      },
      {
        name: staticGameData[2].name,
        avatar: staticGameData[2].image,
        src: staticGameData[2].src
      },
    ]
  },
  {
    type: 'artist',
    title: 'Кто исполняет эту песню?',
    src: [staticGameData[4].src],
    answers: [
      {
        name: staticGameData[4].name,
        avatar: staticGameData[4].image,
        src: staticGameData[4].src
      },
      {
        name: staticGameData[1].name,
        avatar: staticGameData[1].image,
        src: staticGameData[1].src
      },
      {
        name: staticGameData[3].name,
        avatar: staticGameData[3].image,
        src: staticGameData[3].src
      },
    ]
  },
  {
    type: 'genre',
    title: 'Выберите поп треки',
    src: [staticGameData[3].src, staticGameData[4].src],
    answers: [
      {
        name: staticGameData[4].name,
        avatar: staticGameData[4].image,
        src: staticGameData[4].src
      },
      {
        name: staticGameData[3].name,
        avatar: staticGameData[3].image,
        src: staticGameData[3].src
      },
      {
        name: staticGameData[2].name,
        avatar: staticGameData[2].image,
        src: staticGameData[2].src
      },
      {
        name: staticGameData[5].name,
        avatar: staticGameData[5].image,
        src: staticGameData[5].src
      },
    ]
  },
  {
    type: 'genre',
    title: 'Выберите электроник треки',
    src: [staticGameData[5].src, staticGameData[1].src],
    answers: [
      {
        name: staticGameData[1].name,
        avatar: staticGameData[1].image,
        src: staticGameData[1].src
      },
      {
        name: staticGameData[5].name,
        avatar: staticGameData[5].image,
        src: staticGameData[5].src
      },
      {
        name: staticGameData[2].name,
        avatar: staticGameData[2].image,
        src: staticGameData[2].src
      },
      {
        name: staticGameData[3].name,
        avatar: staticGameData[3].image,
        src: staticGameData[3].src
      },
    ]
  },
  {
    type: 'artist',
    title: 'Кто исполняет эту песню?',
    src: [staticGameData[2].src],
    answers: [
      {
        name: staticGameData[2].name,
        avatar: staticGameData[2].image,
        src: staticGameData[2].src
      },
      {
        name: staticGameData[1].name,
        avatar: staticGameData[1].image,
        src: staticGameData[1].src
      },
      {
        name: staticGameData[3].name,
        avatar: staticGameData[3].image,
        src: staticGameData[3].src
      },
    ]
  },
  {
    type: 'artist',
    title: 'Кто исполняет эту песню?',
    src: [staticGameData[3].src],
    answers: [
      {
        name: staticGameData[3].name,
        avatar: staticGameData[3].image,
        src: staticGameData[3].src
      },
      {
        name: staticGameData[1].name,
        avatar: staticGameData[1].image,
        src: staticGameData[1].src
      },
      {
        name: staticGameData[4].name,
        avatar: staticGameData[4].image,
        src: staticGameData[4].src
      },
    ]
  },
];
