import { shuffleCards, displayCards} from "./utils.js";

//находим необходимые нам элементы в дереве
const giftsCardsList = document.querySelector(".gifts__cards-list"); //список для карточек
const countdownDays = document.querySelector(".cta__timer-days"); // блок с днями
const countdownHours = document.querySelector(".cta__timer-hours"); // блок с часами
const countdownMinutes = document.querySelector(".cta__timer-minutes"); // блок с минутами
const countdownSeconds = document.querySelector(".cta__timer-seconds"); // блок с секундами

//отрисовываем карточки на странице gifts
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



  //таймер
  function dateCountdown () {
    const currentDate = new Date();
    const utcCurrentDate = new Date(currentDate.toUTCString()); //переводим местное время в utc0
    const newYearDate = new Date('January 1, 2025 00:00:00 GMT+00:00') //новый год по utc0
    const timeToDate = newYearDate - utcCurrentDate; //оставшееся время в миллисекундах

    countdownDays.innerText = Math.floor(timeToDate / (24 * 60 * 60 * 1000));
    countdownHours.innerText = Math.floor(timeToDate % (24 * 60 * 60 * 1000) / (60 * 60 * 1000));
    countdownMinutes.innerText = Math.floor(timeToDate % (60 * 60 * 1000) / (60 * 1000));
    countdownSeconds.innerText = Math.floor(timeToDate % (60 * 1000) / (1000));
  }
  dateCountdown (); //вызываем для того чтобы при первом заходе на страницу таймер сразу появлялся
  setInterval(dateCountdown, 1000);