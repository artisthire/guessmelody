/**
 * Модуль шаблона разметки для окна выбора песни по жанру
 */
import {showGameScreen, startGame} from '../controller.js';
import {getElementFromTemplate} from '../utilities.js';
import screenSelectArtist from './game-artist.js';

const selectGenreTemplate = `<section class="game game--genre">
    <header class="game__header">
      <a class="game__back" href="#">
        <span class="visually-hidden">Сыграть ещё раз</span>
        <img class="game__logo" src="/img/melody-logo-ginger.png" alt="Угадай мелодию">
      </a>

      <svg xmlns="http://www.w3.org/2000/svg" class="timer" viewBox="0 0 780 780">
        <circle class="timer__line" cx="390" cy="390" r="370" style="filter: url(.#blur); transform: rotate(-90deg) scaleY(-1); transform-origin: center">
      </svg>

      <div class="timer__value" xmlns="http://www.w3.org/1999/xhtml">
        <span class="timer__mins">05</span>
        <span class="timer__dots">:</span>
        <span class="timer__secs">00</span>
      </div>

      <div class="game__mistakes">
        <div class="wrong"></div>
        <div class="wrong"></div>
        <div class="wrong"></div>
      </div>
    </header>

    <section class="game__screen">
      <h2 class="game__title">Выберите инди-рок треки</h2>
      <form class="game__tracks">
        <div class="track">
          <button class="track__button track__button--play" type="button"></button>
          <div class="track__status">
            <audio></audio>
          </div>
          <div class="game__answer">
            <input class="game__input visually-hidden" type="checkbox" name="answer" value="answer-1" id="answer-1">
            <label class="game__check" for="answer-1">Отметить</label>
          </div>
        </div>

        <div class="track">
          <button class="track__button track__button--play" type="button"></button>
          <div class="track__status">
            <audio></audio>
          </div>
          <div class="game__answer">
            <input class="game__input visually-hidden" type="checkbox" name="answer" value="answer-1" id="answer-2">
            <label class="game__check" for="answer-2">Отметить</label>
          </div>
        </div>

        <div class="track">
          <button class="track__button track__button--pause" type="button"></button>
          <div class="track__status">
            <audio></audio>
          </div>
          <div class="game__answer">
            <input class="game__input visually-hidden" type="checkbox" name="answer" value="answer-1" id="answer-3">
            <label class="game__check" for="answer-3">Отметить</label>
          </div>
        </div>

        <div class="track">
          <button class="track__button track__button--play" type="button"></button>
          <div class="track__status">
            <audio></audio>
          </div>
          <div class="game__answer">
            <input class="game__input visually-hidden" type="checkbox" name="answer" value="answer-1" id="answer-4">
            <label class="game__check" for="answer-4">Отметить</label>
          </div>
        </div>

        <button class="game__submit button" type="submit">Ответить</button>
      </form>
    </section>
  </section>`;

const selectGenreScreen = getElementFromTemplate(selectGenreTemplate);

/**
 * Функция инициализации DOM-элементов игрового окна
 * @param {object} container - DOM-элемент контейнер, содержащий DOM разметку, сгенерированную на основе шаблона
 * @return {object} - DOM-элемент контейнер с разметкой игрового окна, над которым выполнена инциализация (добавлены обработчики событий)
 */
function initScreenSelectGenre(container) {
  const form = container.querySelector('.game__tracks');
  const btnSubmit = container.querySelector('.game__submit');
  const selectBtns = [...container.querySelectorAll('.game__input')];
  const backBtn = container.querySelector('.game__back');

  // до выбора хотябы одной песни кнопка ответа отключена
  btnSubmit.disabled = true;

  // обработчик по клику на одну из кнопок выбора песни
  form.addEventListener('click', onSelectBtnClick);
  // обработчки "Ответа"
  form.addEventListener('submit', onFormSubmit);
  // обработчик перезапуска игры
  backBtn.addEventListener('click', onBackBtnClick);

  return container;

  /**
   * Обработчик клика на кнопку начала игры заново
   * @param {object} evt - объект события клика на кнопку
   */
  function onBackBtnClick(evt) {
    evt.preventDefault();
    startGame();
  }

  /**
   * Обработчик клика кнопки выбора песен, соответствующих жанру
   * Навешен на общую форму с кнопками (делегирование события клика)
   * @param {object} evt - объект события при клике на одну из кнопок внутри формы
   */
  function onSelectBtnClick(evt) {
    const target = evt.target;

    // если клик не по одной из кнопок выбора песни ничего не делаем
    if (!selectBtns.includes(target)) {
      return;
    }

    // если не выбран ни одина из песен, на следующий экран не переходим
    if (!getSelectedGenres().length) {
      btnSubmit.disabled = true;
      return;
    }

    // иначе разрешаем нажать кнопку "Ответ" и перейти на следующий игровой экран
    btnSubmit.disabled = false;
  }

  /**
   * Обработчик подтвержения выбора песен, соответствующих заданному жанру (ответа на форму с checkboxes)
   * @param {object} evt - объект события submit формы
   */
  function onFormSubmit(evt) {
    evt.preventDefault();

    // если не выбрана ни одна из песен, ничего не делаем
    if (!getSelectedGenres().length) {
      return;
    }

    // иначе показываем следующий игровой экран
    showGameScreen(screenSelectArtist);
  }

  /**
   * Функция, которая возвращает все выбранные игроком песни
   * @return {array} evt - массив DOM-элементов checkbox-сов выбранных песен
   */
  function getSelectedGenres() {
    // найти все выбранные жанры
    const checkedSelectBtns = selectBtns.filter((checkbox) => checkbox.checked);

    return checkedSelectBtns;
  }
}

export default {container: selectGenreScreen, initFunction: initScreenSelectGenre};
