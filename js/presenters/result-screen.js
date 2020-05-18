/**
 * Модуль содержит презентер финального окна результатов игры
 */

import ResultScreenView from '../views/result-screen-view.js';
import ModalLoadAnimationView from '../views/modal-load-animatin-view.js';
import Application from '../application.js';

import {showScreen} from '../utilities.js';
import {GAME_DATA} from '../data/data.js';
import {calcUserResult, getResultMessage, updateRatings} from '../process/statistics.js';
import {loadStatistics, sendStatistics} from '../network/server-communication.js';

const errorMessage = `<h2 class="result__title">Ошибка синхронизации данных!</h2>
    <p class="result__total result__total--fail">Проверьте сетевое соединение и нажмите "Попробовать ещё раз"</p>`;

class ResultScreen {

  constructor(model) {
    // ссылка на модель игры, откуда берется статистика
    this.model = model;
  }

  async createResultScreen() {
    // хранит строку сообщения на финальном окне окончания игры
    let message;

    // если успешно закончена игра
    if (!this.model.hasNexLevel() && !this.model.isDie() && this.model.hasMoreTime()) {
      // попытаться синхронизировать статистику игры с сервером
      try {
        await this._dataSync();
      } catch (err) { // в случае неудачной синхронизации создать сообщение об ошибке
        message = errorMessage;
      }
    }

    // если игра окончена успешно и выполнена сихронизация данных
    // либо, если игра окончена неудачно
    // сгенерировать отдельное сообщение для отображения на финальном окне
    if (!message) {
      message = getResultMessage(
          {isDie: this.model.isDie(), overTime: !this.model.hasMoreTime()},
          this.model.state,
          GAME_DATA.statistics,
          this._userResult
      );
    }

    // создать представление для финального окна
    this.view = new ResultScreenView(message);
    this.view.onRestartGame = Application.showStart;
    this.element = this.view.element;
    // вернуть текущий объект
    return this;
  }

  async _dataSync() {
    // показываем окно синхронизации ресурсов
    this.loadAnimationElement = new ModalLoadAnimationView().element;
    showScreen(this.loadAnimationElement, false);

    try {
      // загружаем статистику предыдущих игор с сервера
      const loadenStatistics = await loadStatistics();
      // обновляем статистику на основе текущей игры и загруженных данных
      // и сохраняем локально для отображения результатов игры
      GAME_DATA.statistics = this._updateRatings(loadenStatistics);
      // также отправляем статистику на сервер
      await sendStatistics(GAME_DATA.statistics);
    } finally {
      // в любом случае убираем анимацию синхронизации ресурсов
      this.loadAnimationElement.remove();
    }
  }

  _updateRatings(loadenStatistics) {
    // вычисляем результат текущей игры
    let {statistics, wrong} = this.model.state;
    this._userResult = calcUserResult(statistics, wrong, statistics.length);
    // обновляем статистику игор на основе текущей игры и загруженных данных предыдущих игор
    return updateRatings(loadenStatistics, this._userResult.ball);
  }
}

export default function createResultScreen(model) {
  const resultScreen = new ResultScreen(model);
  return resultScreen.createResultScreen();
}
