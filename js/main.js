import {loadGameData} from './network/server-communication.js';
import preloadResource from './network/resouce-preloader.js';

import Application from './application.js';
import ModalLoadAnimationView from './views/modal-load-animatin-view.js';
import ModalErrorView from './views/modal-error-view.js';
import {showScreen} from './utilities.js';

const loadAnimationElement = new ModalLoadAnimationView().element;

showScreen(loadAnimationElement, false);

// предзагрузка ресуров для игры:
loadGameData()
.then((gameData) => preloadResource(gameData))
// в любом случае убираем анимацию процесса загрузки
.finally(() => loadAnimationElement.remove())
// при успешной загрузке стартуем игру
.then(() => Application.showStart())
// в случае ошибок, игру не стартуем, а показываем экран ошибки
.catch(() => showScreen(new ModalErrorView().element, false));
