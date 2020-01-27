/**
 * Модуль главного файла
 * из которого инциализируются другие модули и запускается игра
 */
import {startGame} from './controller.js';
import {getGameData, getGameStatistics} from './network/server-communication.js';
import preloadResource from './network/resouce-preloader.js';
import showModalError from './templates/modal-error.js';
import {showLoadAnimation, removeLoadAnimation} from './templates/load-animation.js';

showLoadAnimation();

// предзагрузка ресуров для игры:
// данных по вопросам и статистики предыдущих игор пользователей
Promise.all([getGameData(), getGameStatistics()])
.then((gameData) => preloadResource(gameData[0]))
.then(() => onSuccessLoad()).catch(() => onErrorLoad());

/**
 * Функция вызывается, когда были ошибки предзагрузки ресурсов для игры
 */
function onErrorLoad() {
  removeLoadAnimation();
  showModalError();
}

/**
 * Функция вызывается, когда ресурсы для игры успешно загружены
 */
function onSuccessLoad() {
  removeLoadAnimation();
  // показываем окно приветствия
  startGame();
}


