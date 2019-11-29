'use strict';

// окно приветствия
const welcomeScreen = document.getElementById('welcome');
// окно выбора жанра музыки
const selectGenreScreen = document.getElementById('game-genre');
// окно выбора исполнителя
const selectArtistScreen = document.getElementById('game-artist');
// окно показывающее выигрыш в игре
const victoryScreen = document.getElementById('result-success');
// окно проигрыша в результате истечения времени
const failTimeScreen = document.getElementById('fail-time');
// окно проигрыша в результате преувеличения колличества попыток
const failTriesScreen = document.getElementById('fail-tries');
// окно результатов игры на выбор исполнителя
const resultArtistScreen = document.getElementById('result-artist');
// окно результатов игры на выбор исполнителя. СПИСОК
const resultArtistDetailScreen = document.getElementById('result-list');
// окно результатов игры на выбор жанра
const resultGenreScreen = document.getElementById('result-genre');

// массив со ссылками на шаблоны игровых окон
const gameScreens = [welcomeScreen, selectGenreScreen, selectArtistScreen, victoryScreen, failTimeScreen,
  failTriesScreen, resultArtistScreen, resultArtistDetailScreen, resultGenreScreen];
// контейнер, в котором отображаются все игровые окна
const screensContainerElement = document.querySelector('.main');
// элемент главного тега MAIN, где содержится основная разметка приложения
const appContainerElement = document.querySelector('.app');

// коды клавиатурных событий клавиш переключения экранов
const LEFT_KEY_CODE = 'ArrowLeft';
const RIGTH_KEY_CODE = 'ArrowRight';

// общая переменная, хранящая номер индекса отображаемого экарана соответствующего номеру индеса в массиве gameScreens
let screenIndex = 0;

// шаблон разметки стрелок переключения экранов
const arrowsTemplate = `<div class="arrows__wrap">
    <style>
      .arrows__wrap {
        position: absolute;
        top: 135px;
        left: 50%;
        margin-left: -56px;
      }
      .arrows__btn {
        background: none;
        border: 2px solid black;
        padding: 5px 20px;
      }
    </style>
    <button class="arrows__btn"><-</button>
    <button class="arrows__btn">-></button>
</div>`;

// добавляем визуальные кнопки в разметку
appContainerElement.insertAdjacentHTML('beforeend', arrowsTemplate);

// элементы кнопок переключения экранов в HTML
const controlArrows = appContainerElement.querySelectorAll('.arrows__btn');
const controlArrowLeft = controlArrows[0];
const controlArrowRight = controlArrows[1];

// добавляем обработчик переключения экранов визуальтыми кнопками
controlArrowLeft.addEventListener('click', onLeftArrowClick);
controlArrowRight.addEventListener('click', onRightArrowClick);

// добавляем обработчик переключения экранов с клавиатуры
document.addEventListener('keydown', onArrowKeydown);

// показать стартовый игровой экран
showGameScreen(screenIndex);

/**
 * Функция-обработчик переключения игрового экрана при нажатии визуальной кнопки "влево"
 * @param {object} evt - объект события нажатия на <button>
 */
function onLeftArrowClick(evt) {
  evt.preventDefault();

  screenIndex = decrementScreenIndex(screenIndex);
  showGameScreen(screenIndex);
}

/**
 * Функция-обработчик переключения игрового экрана при нажатии визуальной кнопки "вправо"
 * @param {object} evt - объект события нажатия на <button>
 */
function onRightArrowClick(evt) {
  evt.preventDefault();

  screenIndex = incrementScreenIndex(screenIndex);
  showGameScreen(screenIndex);
}

/**
 * Функция-обработчик переключения игровых экранов с клавиатуры
 * @param {object} evt - объект события нажатия на клавишу клавиатуры
 */
function onArrowKeydown(evt) {

  const keyCode = evt.code;

  // проверяем нажаты ли клавыши управления
  if (keyCode !== LEFT_KEY_CODE && keyCode !== RIGTH_KEY_CODE) {
    return;
  }

  evt.preventDefault();

  if (keyCode === LEFT_KEY_CODE) {
    screenIndex = decrementScreenIndex(screenIndex);
  } else {
    screenIndex = incrementScreenIndex(screenIndex);
  }

  showGameScreen(screenIndex);
}

/**
 * Функция по индеску из массива игровых окон gameScreens берет шаблон разметки и добавляет его в контейнер галвного окна
 * @param {number} index - порядковый номер шаблона игрового окна
 */
function showGameScreen(index) {

  const screenTemplate = gameScreens[index].content.firstElementChild.cloneNode(true);

  screensContainerElement.textContent = '';
  screensContainerElement.append(screenTemplate);
}

/**
 * Функция увеличивающая индекс номера игрового окна
 * @param {number} index - текущий индекс номера игрового окна
 * @return {number} - индекс игрового окна после увеличения
 */
function incrementScreenIndex(index) {
  index++;

  if (index > (gameScreens.length - 1)) {
    index = 0;
  }

  return index;
}

/**
 * Функция уменьшающая индекс номера игрового окна
 * @param {number} index - текущий индекс номера игрового окна
 * @return {number} - индекс игрового окна после уменьшения
 */
function decrementScreenIndex(index) {
  index--;

  if (index < 0) {
    index = gameScreens.length - 1;
  }

  return index;
}
