/**
 * Модуль содержит класс StartScreen
 * Который выполняет роль контроллера для представления стартового экрана
 */
import StartScreenView from '../views/start-screen-view.js';
import Application from '../application.js';

export default class StartScreen {

  constructor() {
    this._screenView = new StartScreenView();
    this._screenView.onStartBtnClick = Application.showGameLevel;
    this.element = this._screenView.element;
  }

}
