import { shuffleCards, displayCards, turnOnMenu } from "./utils.js";

//находим необходимые нам элементы в дереве
//для вывода карточек
const giftsCardsList = document.querySelector(".gifts__cards-list"); //список для карточек
//для таймера
const countdownDays = document.querySelector(".cta__timer-days"); // блок с днями
const countdownHours = document.querySelector(".cta__timer-hours"); // блок с часами
const countdownMinutes = document.querySelector(".cta__timer-minutes"); // блок с минутами
const countdownSeconds = document.querySelector(".cta__timer-seconds"); // блок с секундами
//для слайдера
const sliderContainer = document.querySelector(".slider__cards-wrapper"); //родительский блок слайдера
const slider = document.querySelector(".slider__cards");
const toLeftButton = document.querySelector(".slider__button-left"); //левая кнопка
const toRightButton = document.querySelector(".slider__button-right"); //правая кнопка

//ВЫВОД КАРТОЧЕК НА СТРАНИЦЕ HOME
fetch("../scripts/gifts.json")
  .then((response) => response.json())
  .then((data) => {
    shuffleCards(data);
    const choosenCards = data.slice(0, 4);
    displayCards(choosenCards, giftsCardsList);
  })
  .catch((error) => {
    console.error("Ошбика при загрузке данных", error);
  });
//ВЫВОД КАРТОЧЕК НА СТРАНИЦЕ HOME

//ТАЙМЕР
function dateCountdown() {
  const currentDate = new Date();
  const utcCurrentDate = new Date(currentDate.toUTCString()); //переводим местное время в utc0
  const newYearDate = new Date("January 1, 2025 00:00:00 GMT+00:00"); //новый год по utc0
  const timeToDate = newYearDate - utcCurrentDate; //оставшееся время в миллисекундах

  countdownDays.innerText = Math.floor(timeToDate / (24 * 60 * 60 * 1000));
  countdownHours.innerText = Math.floor(
    (timeToDate % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)
  );
  countdownMinutes.innerText = Math.floor(
    (timeToDate % (60 * 60 * 1000)) / (60 * 1000)
  );
  countdownSeconds.innerText = Math.floor((timeToDate % (60 * 1000)) / 1000);
}
dateCountdown(); //вызываем для того чтобы при первом заходе на страницу таймер сразу появлялся
setInterval(dateCountdown, 1000);
//ТАЙМЕР

//СЛАЙДЕР
//определим количество шагов для прокрутки
let maxCountOfSteps = window.innerWidth > 768 ? 3 : 6;


//определим переменную для работы с позицией
let positionX = 0;

let sizeOfStep = countSliderShift();

//посчитаем кол-во шагов требуемое для определенной ширины
function countSliderShift() {
  let hiddenPartOfSlider = slider.scrollWidth - sliderContainer.clientWidth;
  return Math.ceil(hiddenPartOfSlider / maxCountOfSteps);
}


//изменяем css свойства для того чтобы слайдер ожил
function scrollSlider(position) {
  positionX = Math.min(position, slider.scrollWidth - sliderContainer.clientWidth);
  slider.style.transform = `translateX(-${position}px)`;
  slider.style.transition = `transform 0.5s ease-in-out`;
  changeButtonsStatus();
}

//двигаем слайдер вправо
function scrollToRight() {
  const newPosition = Math.min(positionX + sizeOfStep, slider.scrollWidth - sliderContainer.clientWidth);
  scrollSlider(newPosition);
}

//двигаем слайдер влево
function scrollToLeft() {
  const newPosition = Math.max(positionX - sizeOfStep, 0);
  scrollSlider(newPosition);
}

//скидываем слайдер при изменении окна, пересчитаем шаги и вернем на старт
function resizeSlider() {
   maxCountOfSteps = window.innerWidth > 768 ? 3 : 6
  sizeOfStep = countSliderShift();
  scrollSlider(0);
}

//настроим переключение классов кнопок
function changeButtonsStatus() {
  const startPosition = positionX === 0;
  const finishPosition = positionX >= slider.scrollWidth - sliderContainer.clientWidth;

  //левая кнопка и стартовая позиция
  if (startPosition) {
    toLeftButton.classList.add("slider__button--inactive");
    toLeftButton.classList.remove("slider__button--active");
  } else {
    toLeftButton.classList.remove("slider__button--inactive");
    toLeftButton.classList.add("slider__button--active");
  }

  //правая кнопка и финишная позиция
  if (finishPosition) {
    toRightButton.classList.add("slider__button--inactive");
    toRightButton.classList.remove("slider__button--active");
  } else {
    toRightButton.classList.remove("slider__button--inactive");
    toRightButton.classList.add("slider__button--active");
  }
}

//включим обработчики и запустим слайдер
function turnOnSlider() {
  toRightButton.addEventListener('click', scrollToRight);
  toLeftButton.addEventListener('click', scrollToLeft);
  window.addEventListener('resize', resizeSlider);
  changeButtonsStatus();
}
//СЛАЙДЕР


// вызываем функции после загрузки DOM
document.addEventListener('DOMContentLoaded', turnOnSlider)
document.addEventListener('DOMContentLoaded', turnOnMenu)