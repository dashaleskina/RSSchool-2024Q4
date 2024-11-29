const giftCardTemplate = document.querySelector("#card-template").content;
const giftsCardsList = document.querySelector(".gifts__cards-list");

function getCategoryModifier(category) {
  const categoryLowerCase = category.toLowerCase();

  if (categoryLowerCase.includes("work")) {
    return "work";
  } else if (categoryLowerCase.includes("health")) {
    return "health";
  } else if (categoryLowerCase.includes("harmony")) {
    return "harmony";
  }
}

function createCard(cardData) {
  const cardElement = giftCardTemplate
    .querySelector(".gifts__card")
    .cloneNode(true);

  const cardImage = cardElement.querySelector(".gifts__card-image");
  cardImage.src = cardData.image;
  cardImage.alt = cardData.category;

  const cardCategory = cardElement.querySelector(".gifts__card-caption-category");
  cardCategory.textContent = cardData.category;
  const categoryModifier = getCategoryModifier(cardData.category);
  cardCategory.classList.add(
    `gifts__card-caption-category--${categoryModifier}`
  );
  const cardTitle = cardElement.querySelector(".gifts__card-caption-title");
  cardTitle.textContent = cardData.name;

  return cardElement;
}

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
