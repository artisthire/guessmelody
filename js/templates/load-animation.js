/**
 * Модуль содержит функции добавления и удаления анимации задержки игры при взаимодействии с сервером
 */

// <div id="preload-spinner" class="spinner"></div>
const ELEMENT_ID = 'preload-spinner';
const ELEMENT_CLASS = 'spinner';

let animationContainer = null;

/**
 * Функция показывает анимацию задержки игры при взаимодействии с сервером
 * @param {string} message - сообщение, которое отображается внутри спиннера анимации загрузки
 */
export function showLoadAnimation(message) {
  animationContainer = document.createElement('div');
  animationContainer.id = ELEMENT_ID;
  animationContainer.classList.add(ELEMENT_CLASS);
  animationContainer.innerHTML = message || 'Синхронизация<br>данных!';

  document.body.append(animationContainer);
}

/**
 * Функция скрывает анимацию задержки игры при взаимодействии с сервером
 */
export function removeLoadAnimation() {
  let element = animationContainer || document.getElementById(ELEMENT_ID);
  element.remove();
}
