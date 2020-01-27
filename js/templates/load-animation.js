/**
 * Модуль содержит функции добавления и удаления анимации задержки игры при взаимодействии с сервером
 */

// <div id="preload-spinner" class="spinner"></div>
const ELEMENT_ID = 'preload-spinner';
const ELEMENT_CLASS = 'spinner';

/**
 * Функция показывает анимацию задержки игры при взаимодействии с сервером
 */
export function showLoadAnimation() {
  let element = document.createElement('div');
  element.id = ELEMENT_ID;
  element.classList.add(ELEMENT_CLASS);
  document.body.prepend(element);
}

/**
 * Функция скрывает анимацию задержки игры при взаимодействии с сервером
 */
export function removeLoadAnimation() {
  let element = document.getElementById(ELEMENT_ID);
  element.remove();
}
