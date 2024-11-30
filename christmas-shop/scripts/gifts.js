import { createCard } from "./utils.js";

//находим необходимые нам элементы
const giftsCardsList = document.querySelector(".gifts__cards-list"); // список для карточек
const categoryTabs = document.querySelectorAll(".gifts__tabs-item"); // сборка табов для обработки смены категорий

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
    const card = createCard(cardData);
    giftsCardsList.appendChild(card);
  });
}

//обработаем клики на табы
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

      //удаляем активный класс у всех кнопки и переключаем на новую
      categoryTabs.forEach((item) =>
        item.classList.remove("gifts__tabs-item--active")
      );
      item.classList.add("gifts__tabs-item--active");
    });
  });
}


