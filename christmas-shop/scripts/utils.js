export { createCard, shuffleCards };

//создаем модификатор для специфического класса товара
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

//создаем карточку товара при помощи темплейта
function createCard(cardData) {
  const giftCardTemplate = document.querySelector("#card-template").content;
  const cardElement = giftCardTemplate
    .querySelector(".gifts__card")
    .cloneNode(true);

  const cardImage = cardElement.querySelector(".gifts__card-image");
  cardImage.src = cardData.image;
  cardImage.alt = cardData.category;

  const cardCategory = cardElement.querySelector(
    ".gifts__card-caption-category"
  );
  cardCategory.textContent = cardData.category;
  const categoryModifier = getCategoryModifier(cardData.category);
  cardCategory.classList.add(
    `gifts__card-caption-category--${categoryModifier}`
  );
  const cardTitle = cardElement.querySelector(".gifts__card-caption-title");
  cardTitle.textContent = cardData.name;

  return cardElement;
}

//применяем тасование Фишера - Йетса для тасовки массива с карточками
function shuffleCards(cardsList) {
  for (let i = cardsList.length - 1; i > 0; i--) {
    let randomIndex = Math.floor(Math.random() * (i + 1));
    [cardsList[i], cardsList[randomIndex]] = [cardsList[randomIndex], cardsList[i]];
  }
}
