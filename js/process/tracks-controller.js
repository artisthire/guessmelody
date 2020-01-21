/**
 * Модуль содержит функционал по инициализации элементов управления тегами <audio>,
 * которые отвечают за воспроизведение аудиотреков в уровнях игры
 */

// классы для поиска и изменения состояния кнопками управления аудиотреками
const CONTROL_BTN_CLASS = 'track__button';
const PLAY_CLASS = 'track__button--play';
const PAUSE_CLASS = 'track__button--pause';

/**
 * Добавляет обработчики запуска и остановки аудиотреков на уровнях игры соответствующими кнопками управления
 * @param {object} container - DOM-элемент, содержащий разметку к которой нужно добавить управление
 * @return {object} - контейнер, с добавленными обработчиками
 */
export function initTrackController(container) {
  const controlBtns = Array.from(container.querySelectorAll(`.${CONTROL_BTN_CLASS}`));
  const audioElements = controlBtns.map((controlBtn) => controlBtn.parentElement.querySelector('audio'));
  const controlToAudioElement = new Map();
  controlBtns.forEach((controlBtn, index) => controlToAudioElement.set(controlBtn, audioElements[index]));

  let prevControlBtn = null;
  let prevAudioElement = null;

  controlBtns.forEach((controlBtn) => controlBtn.addEventListener('click', onControlBtnClick));
  audioElements.forEach((audioElement) => audioElement.addEventListener('ended', onAudioTrackEnd));

  return container;

  /**
   * Обработчик клика на кнопке управления воспроизведением треков
   * Запускает/останавливает воспроизведение аудиотреков, меняе вид кнопкок управления воспроизведением
   * Контролирует, чтобы одновременно не играло больше 1 трека
   * @param {object} evt - объект события при клике на кнопку
   */
  function onControlBtnClick(evt) {
    evt.preventDefault();

    // для BUTTON используем CLOSEST, т.к. клик может быть внутри BUTTON на другом элементе и тогда будет неправильный target
    const currentControlBtn = evt.target.closest(`.${CONTROL_BTN_CLASS}`);
    const currentAudioElement = controlToAudioElement.get(currentControlBtn);

    // при первоначальной загрузке страницы определить значение для предыдущего воспроизводимого трека
    if (!prevControlBtn) {
      prevControlBtn = controlBtns.find((controlBtn) => controlBtn.classList.contains(PAUSE_CLASS));
      prevAudioElement = controlToAudioElement.get(prevControlBtn);
    }

    // если клик по кнопке управления, которая соответствует воспроизведению другого трека
    // остановить проигрывание предыдущего трека
    // чтобы одновременно не играло больше 1 трека
    if (prevControlBtn && prevControlBtn !== currentControlBtn && prevControlBtn.classList.contains(PAUSE_CLASS)) {
      pauseTrack(prevControlBtn, prevAudioElement);
    }

    // сохранить новое значение для элемента управления и аудиотрека
    [prevControlBtn, prevAudioElement] = [currentControlBtn, currentAudioElement];

    // если кнопка управления в виде "паузы", остановить воспроизведение
    // иначе, запустить проигрывание трека
    if (currentControlBtn.classList.contains(PAUSE_CLASS)) {
      pauseTrack(currentControlBtn, currentAudioElement);
    } else {
      playTrack(currentControlBtn, currentAudioElement);
    }
  }

  /**
   * Обработчик события окончания воспроизведения аудиотрека
   * При окончании проигрывание меняет состояние соответствующей кнопки управления
   * @param {object} evt - объект события окончания воспроизведения аудиотрека
   */
  function onAudioTrackEnd(evt) {
    const currentAudioElement = evt.target;
    const currentControlBtn = controlBtns[audioElements.indexOf(currentAudioElement)];

    if (currentControlBtn && currentControlBtn.classList.contains(PAUSE_CLASS)) {
      pauseTrack(currentControlBtn, currentAudioElement);
    }
  }
}

/**
 * Функция воспроизведения аудиотрека
 * При окончании проигрывание меняет состояние соответствующей кнопки управления
 * И запускает соответствующий кнопке аудиотрек на воспроизведение
 * @param {object} controlBtn - ссылка на кнопку управления, которой запускаетсся воспроизведение
 * @param {object} audioElement - ссылка на DOM-элемент аудиотега <audio>
 */
function playTrack(controlBtn, audioElement) {
  controlBtn.classList.remove(PLAY_CLASS);
  controlBtn.classList.add(PAUSE_CLASS);

  audioElement.play();
}

/**
 * Функция остановки воспроизведения аудиотрека
 * При окончании проигрывание меняет состояние соответствующей кнопки управления
 * И останавливает воспроизведение соответствующего кнопке аудиотрека
 * @param {object} controlBtn - ссылка на кнопку управления, которой останавливается воспроизведение
 * @param {object} audioElement - ссылка на DOM-элемент аудиотега <audio>
 */
function pauseTrack(controlBtn, audioElement) {
  controlBtn.classList.remove(PAUSE_CLASS);
  controlBtn.classList.add(PLAY_CLASS);

  audioElement.pause();
}
