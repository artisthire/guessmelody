/**
 * Модуль содержит функции для предзагрузки данных для игры
 * Не используется FETCH, поскольку политика сайтов ресурсов не дает загрузить без {mode: 'no-cors'}
 * А FETCH с {mode: 'no-cors'} не дает получить доступ к Response и телу ответа, т.е. нельзя проверть успешность загрузки ресурсов
 */

/**
 * Функция получения URL-адресов предзагружаемых файлов изображения и музыки,
 * которые используются в вопросах на игровых уровнях
 * @param {object} gameData - объект, содержащий информацию о необходимых файла для игры, в т.ч. URL-ссылки на файлы
 * @return {object} - объект вида {audio: [], image: []} содержащий перечень URL-ссылок на файлы музыки и картинок
 */
function getResourceUrls(questions) {
  const audioUrls = new Set();
  const imgUrls = new Set();

  questions.forEach((question) => {
    question.srcs.forEach((src) => audioUrls.add(src));
    question.answers.forEach((answer) => {
      audioUrls.add(answer.src);
      imgUrls.add(answer.img);
    });
  });

  const urls = {audio: [], image: []};
  urls.audio = Array.from(audioUrls);
  urls.image = Array.from(imgUrls);

  return urls;
}

/**
 * Функция загрузки всех файлов одного типа (картинки, музыка) на которые полученны ссылки URL
 * Использует отдельную функцию как аргумент, которая отвечает за правильную загрузку файлов, тип которых соотвествует переденным ссылкам
 * @param {function} loadFileFunc - специфичная для заданного типа файлов функция, которая отвечает за загрузку каждой отдельной ссылки
 * @param {array} urls - массив ссылок URL на файлы, которые нужно загрузить
 * @return {promise} - промис, который завершается после загрузки всех файлов
 */
function getFiles(loadFileFunc, urls) {
  let requests = urls.map((url) => loadFileFunc(url));

  return Promise.all(requests);
}

/**
 * Функция загрузки для файлов с типом "Аудио"
 * @param {string} url - URL-адрес аудиофайла, который нужно загрузить
 * @return {promise} - промис, который завершается после загрузки файла
 */
function getAudioFile(url) {
  return new Promise(function (resolve, reject) {
    const audioElement = new Audio();
    audioElement.addEventListener('canplaythrough', resolve, false);
    audioElement.addEventListener('error', reject, false);
    audioElement.src = url;
  });
}

/**
 * Функция загрузки для файлов с типом "Картинка"
 * @param {string} url - URL-адрес картинки, которую нужно загрузить
 * @return {promise} - промис, который завершается после загрузки файла
 */
function getImageFile(url) {
  return new Promise(function (resolve, reject) {
    const imgElement = new Image();
    imgElement.addEventListener('load', resolve, false);
    imgElement.addEventListener('error', reject, false);
    imgElement.src = url;
  });
}


/**
 * Общая функция, которая отвечает за предзагрузку ресурсов для игры
 * @param {object} gameData - объект с данными о ресурсах, которые нужно загрузить. Содержит в т.ч. ссылки URL на файлы.
 * @param {function} success - callback-функция, которая вызывается при успешной загруке всех файлов
 * @param {function} error - callback-функция, которая вызывается если хоть один файл загружен не был
 * @return {array} - массив результатов предзагрузки
 */
export default async function preloadResource(gameData) {
  let resourceUrls = getResourceUrls(gameData);

  await getFiles(getImageFile, resourceUrls.image);
  return await getFiles(getAudioFile, resourceUrls.audio);
}

