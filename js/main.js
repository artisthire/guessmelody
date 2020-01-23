/**
 * Модуль главного файла
 * из которого инциализируются другие модули и запускается игра
 */
import {startGame} from './controller.js';
import preloadResource from './process/resouce-preloader.js';
import showModalError from './templates/modal-error.js';
import gameStaticData from './data/game-static-data.js';

preloadResource(gameStaticData, onSuccessLoad, onErrorLoad);

/**
 * Функция удаляет анимацию процесса предзагрузки ресурсов для игры
 */
function removePreloadAnimation() {
  const preloadAnimationElement = document.getElementById('preload-spinner');
  preloadAnimationElement.remove();
}

/**
 * Функция вызывается, когда были ошибки предзагрузки ресурсов для игры
 */
function onErrorLoad() {
  removePreloadAnimation()
  showModalError();
}

/**
 * Функция вызывается, когда ресурсы для игры успешно загружены
 */
function onSuccessLoad() {
  removePreloadAnimation()
  // показываем окно приветствия
  startGame();
}


