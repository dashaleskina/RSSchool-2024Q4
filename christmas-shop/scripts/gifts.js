import { createCard } from "./utils.js";

//находим необходимые нам элементы
const giftsCardsList = document.querySelector(".gifts__cards-list"); // список для карточек
const categoryTabs = document.querySelectorAll(".gifts__tabs-item"); // сборка табов для обработки смены категорий
const upButton = document.querySelector(".up-button"); // кнопка scroll-to-top
const cardPopup = document.querySelector(".popup__overlay");
const popupImage = document.querySelector(".popup__image");
const popupCategory = document.querySelector(".popup__card-category");
const popupTitle = document.querySelector(".popup__card-title");
const cardCaption = document.querySelector(".card-caption-paragraph");
const starsContainer = document.querySelectorAll(
  ".card-superpowers-table-snowflakes"
);
const cardSuperpowerNames = document.querySelectorAll(
  ".card-superpowers-table-superpower"
);
const cardSuperpowerPoints = document.querySelectorAll(
  ".card-superpowers-table-points"
);
const closeModalButton = document.querySelector(".popup-icon");

//отрисовываем карточки на странице gifts
fetch("../scripts/gifts.json")
  .then((response) => response.json())
  .then((data) => {
    displayCards(data);
    handleCategoryTabs(data);
  })
  .catch((error) => {
    console.error("Ошбика при загрузке данных", error);
  });

// функция для отрисовки карточек на странице - очищаем список  и далее вставляем карточки из массива
function displayCards(cards) {
  giftsCardsList.innerHTML = "";
  cards.forEach((cardData) => {
    const card = createCard(cardData, onCardImageClick);
    giftsCardsList.appendChild(card);
  });
}

//обработаем клика на табы
function handleCategoryTabs(data) {
  categoryTabs.forEach((item) => {
    item.addEventListener("click", () => {
      let sortedCards;
      const categoryText = item.textContent.toLowerCase();

      if (categoryText === "all") {
        sortedCards = data;
      } else {
        sortedCards = data.filter((card) =>
          card.category.toLowerCase().includes(categoryText)
        );
      }

      displayCards(sortedCards);

      //удаляем активный класс у всех кнопок и переключаем на новый
      categoryTabs.forEach((item) =>
        item.classList.remove("gifts__tabs-item--active")
      );
      item.classList.add("gifts__tabs-item--active");
    });
  });
}

//переключаем класс на кнопке "вверх" при скролле на 300px
window.addEventListener("scroll", () => {
  upButton.classList.toggle("up-button-visible", window.scrollY > 300);
});

//слушаем клики по карточке, открываем модалку, заполняем данными
function onCardImageClick(cardData) {
  popupImage.src = cardData.image;

  popupImage.alt = cardData.category;
  popupCategory.textContent = cardData.category;
  popupCategory.className =
    `gifts__card-caption-category popup__card-category gifts__card-caption-category--${cardData.categoryModifier}`;

  popupTitle.textContent = cardData.name;
  cardCaption.textContent = cardData.description;

  //получаем коллекцию значений из нашего массива с данными
  const cardSuperpowerNameValues = Object.keys(cardData.superpowers);
  const cardSuperpowerPointsValues = Object.values(cardData.superpowers);

  cardSuperpowerNames.forEach((elem, index) => {
    if (index < cardSuperpowerNameValues.length) {
      elem.textContent = cardSuperpowerNameValues[index];
    }
  });

  cardSuperpowerPointsValues.forEach((elem, index) => {
    if (index < cardSuperpowerPoints.length) {
      cardSuperpowerPoints[index].textContent = elem;
      changeStarsColor(elem, starsContainer[index]);
    }
  });

  const cardPopup = document.querySelector(".popup__overlay");
  openPopup(cardPopup);
}

//открываем модалку
function openPopup(cardPopup) {
  if (cardPopup) {
    cardPopup.classList.add("popup_opened");
    document.addEventListener("keydown", closeByKeydown);
    cardPopup.addEventListener("click", clickOnOverlay);
    document.documentElement.style.overflow = "hidden"
  }
}

closeModalButton.addEventListener("click", closePopup);
function closePopup() {
  if (cardPopup && cardPopup.classList.contains("popup_opened")) {
    cardPopup.classList.remove("popup_opened");
    document.removeEventListener("keydown", closeByKeydown);
    cardPopup.removeEventListener("click", clickOnOverlay);
    document.documentElement.style.overflow = ""
  }
}

//Если кликнули на оверлей
function clickOnOverlay(evt) {
  if (evt.target.classList.contains("popup__overlay")) {
    closePopup();
  }
}

//Если кликнули на esc
function clickOnEsc(evt) {
  return evt.key === "Escape" || evt.key === "Esc";
}

// Закрытие по клавише
function closeByKeydown(evt) {
  if (clickOnEsc(evt)) {
    closePopup(document.querySelector(".popup-opened"));
  }
}

//окрашиваем звездочки согласно значения суперсил
function changeStarsColor(pointsValue, starsContainer) {
  const numberOfStars = parseInt(pointsValue.substring(1, 2));

  const stars = starsContainer.querySelectorAll("svg path");

  stars.forEach((star, index) => {
    if (index < numberOfStars) {
      star.setAttribute("fill", "#FF4646");
      star.setAttribute("fill-opacity", "1");
    } else {
      star.setAttribute("fill-opacity", "0.1");
    }
  });
}
