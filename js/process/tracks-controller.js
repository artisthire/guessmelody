/**
 * Модуль содержит функционал по инициализации элементов управления тегами <audio>,
 * которые отвечают за воспроизведение аудиотреков в уровнях игры
 */

// классы для поиска и изменения состояния кнопками управления аудиотреками
const CONTROL_BTN_CLASS = 'track__button';
const PLAY_CLASS = 'track__button--play';
const PAUSE_CLASS = 'track__button--pause';

export default class TrackContoller {

  constructor(container) {
    // находим элементы управления и теги <audio> соответствующие элементам управления
    this.controlBtns = Array.from(container.querySelectorAll(`.${CONTROL_BTN_CLASS}`));
    this.audioElements = this.controlBtns.map((controlBtn) => controlBtn.parentElement.querySelector('audio'));

    // карта сопоставления элементов управления тегам <audio>
    this._controlToAudioElement = new Map();
    this.controlBtns.forEach((controlBtn, index) => this._controlToAudioElement.set(controlBtn, this.audioElements[index]));

    // хранит значения предудущих элементов и аудиотреков
    // для поочередного включения только одного трека
    this._prevControlBtn = null;
    this._prevAudioElement = null;

    // всем кнопкам упрвления добавляем обработчики нажатия на них
    this.controlBtns.forEach((controlBtn) => controlBtn.addEventListener('click', (evt) => {
      evt.preventDefault();
      this._onControlBtnClick(evt.target);
    }));

    // всем аудио-элементам добавляем обработчики окончания воспроизведения трека
    this.audioElements.forEach((audioElement) => audioElement.addEventListener('ended', (evt) => {
      this._onAudioTrackEnd(evt.target);
    }));
  }

  /**
   * Обработчик клика на кнопке управления воспроизведением треков
   * Запускает/останавливает воспроизведение аудиотреков, меняе вид кнопкок управления воспроизведением
   * Контролирует, чтобы одновременно не играло больше 1 трека
   * @param {object} target - объект, на котором перехвачен клик
   */
  _onControlBtnClick(target) {
    // для BUTTON используем CLOSEST, т.к. клик может быть внутри BUTTON на другом элементе и тогда будет неправильный target
    const currentControlBtn = target.closest(`.${CONTROL_BTN_CLASS}`);
    const currentAudioElement = this._controlToAudioElement.get(currentControlBtn);

    // при первоначальной загрузке страницы определить значение для предыдущего воспроизводимого трека
    if (!this._prevControlBtn) {
      this._prevControlBtn = this.controlBtns.find((controlBtn) => controlBtn.classList.contains(PAUSE_CLASS));
      this._prevAudioElement = this._controlToAudioElement.get(this._prevControlBtn);
    }

    // если клик по кнопке управления, которая соответствует воспроизведению другого трека
    // остановить проигрывание предыдущего трека
    // чтобы одновременно не играло больше 1 трека
    if (this._prevControlBtn && this._prevControlBtn !== currentControlBtn && this._prevControlBtn.classList.contains(PAUSE_CLASS)) {
      this._pauseTrack(this._prevControlBtn, this._prevAudioElement);
    }

    // сохранить новое значение для элемента управления и аудиотрека
    [this._prevControlBtn, this._prevAudioElement] = [currentControlBtn, currentAudioElement];

    // если кнопка управления в виде "паузы", остановить воспроизведение
    // иначе, запустить проигрывание трека
    if (currentControlBtn.classList.contains(PAUSE_CLASS)) {
      this._pauseTrack(currentControlBtn, currentAudioElement);
    } else {
      this._playTrack(currentControlBtn, currentAudioElement);
    }
  }

  /**
   * Обработчик события окончания воспроизведения аудиотрека
   * При окончании проигрывание меняет состояние соответствующей кнопки управления
   * @param {object} target - объект адудиотрека, на котором произошло событие окончания воспроизведения
   */
  _onAudioTrackEnd(target) {
    const currentAudioElement = target;
    const currentControlBtn = this.controlBtns[this.audioElements.indexOf(currentAudioElement)];

    if (currentControlBtn && currentControlBtn.classList.contains(PAUSE_CLASS)) {
      this._pauseTrack(currentControlBtn, currentAudioElement);
    }
  }

  /**
   * Функция воспроизведения аудиотрека
   * При запуске трека меняет состояние соответствующей кнопки управления
   * И запускает соответствующий кнопке аудиотрек на воспроизведение
   * @param {object} controlBtn - ссылка на кнопку управления, которой запускаетсся воспроизведение
   * @param {object} audioElement - ссылка на DOM-элемент аудиотега <audio>
   */
  _playTrack(controlBtn, audioElement) {
    controlBtn.classList.remove(PLAY_CLASS);
    controlBtn.classList.add(PAUSE_CLASS);

    audioElement.play();
  }

  /**
   * Функция остановки воспроизведения аудиотрека
   * При окончании проигрывания меняет состояние соответствующей кнопки управления
   * И останавливает воспроизведение соответствующего кнопке аудиотрека
   * @param {object} controlBtn - ссылка на кнопку управления, которой останавливается воспроизведение
   * @param {object} audioElement - ссылка на DOM-элемент аудиотега <audio>
   */
  _pauseTrack(controlBtn, audioElement) {
    controlBtn.classList.remove(PAUSE_CLASS);
    controlBtn.classList.add(PLAY_CLASS);

    audioElement.pause();
  }

}
