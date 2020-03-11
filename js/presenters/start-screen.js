/**
 * Модуль содержит класс StartScreen
 * Который выполняет роль контроллера для представления стартового экрана
 */
import StartScreenView from '../views/start-screen-view.js';

export default class StartScreen {

  constructor() {
    this._screenView = new StartScreenView();
    this._screenView.onStartBtnClick = () => console.log('Start Game');
  }

  get element() {
    return this._screenView.element;
  }

}
