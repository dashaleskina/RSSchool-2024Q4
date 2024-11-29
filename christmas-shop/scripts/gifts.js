import { createCard } from "./utils.js";


const giftsCardsList = document.querySelector(".gifts__cards-list");

//отрисовываем карточки на странице gifts
fetch("../scripts/gifts.json")
  .then((response) => response.json())
  .then((data) => {
    data.forEach((cardData) => {
      const card = createCard(cardData);
      giftsCardsList.appendChild(card);
    });
  })
  .catch((error) => {
    console.error("Ошбика при загрузке данных", error);
  });
