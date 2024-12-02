import { displayCards } from "./utils.js";

//находим необходимые нам элементы
const giftsCardsList = document.querySelector(".gifts__cards-list"); // список для карточек
const categoryTabs = document.querySelectorAll(".gifts__tabs-item"); // сборка табов для обработки смены категорий
const upButton = document.querySelector(".up-button"); // кнопка scroll-to-top

//отрисовываем карточки на странице gifts
fetch("../scripts/gifts.json")
  .then((response) => response.json())
  .then((data) => {
    displayCards(data, giftsCardsList);
    handleCategoryTabs(data);
  })
  .catch((error) => {
    console.error("Ошбика при загрузке данных", error);
  });

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

