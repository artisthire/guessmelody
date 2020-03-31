/**
 * Модуль содержит презентер финального окна результатов игры
 */

import ResultScreenView from '../views/result-screen-view.js';
import Application from '../application.js';

import {GAME_DATA} from '../data/data.js';
import {calcUserResult, getResultMessage, updateRatings} from '../process/statistics.js';
import {sendStatistics} from '../network/server-communication.js';

export default class ResultScreen {

  constructor(model) {
    // ссылка на модель игры, откуда берется статистика
    this.model = model;

    this._createResultScreen();
  }

  _createResultScreen() {

    if (!this.model.isDie() || this.model.hasMoreTime()) {
      this._updateRatings();
    }

    const endMessage = getResultMessage(
        {isDie: this.model.isDie(), overTime: !this.model.hasMoreTime()},
        this.model.state,
        GAME_DATA.statistics,
        this._userResult
    );

    this.view = new ResultScreenView(endMessage);
    this.view.onRestartGame = Application.showStart;
    this.element = this.view.element;
  }

  _updateRatings() {
    let {statistics, wrong} = this.model.state;
    this._userResult = calcUserResult(statistics, wrong, statistics.length);

    GAME_DATA.statistics = updateRatings(GAME_DATA.statistics, this._userResult.ball);

    sendStatistics(GAME_DATA.statistics);
  }

}
