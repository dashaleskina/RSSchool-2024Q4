export { createCard, shuffleCards };

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

const menuButton = document.querySelector('.header__menu');
const menuLines = document.querySelectorAll('.header__menu-line');
const navSidebar = document.querySelector('.nav-sidebar');
const navLinks = document.querySelectorAll('.nav-sidebar .nav__item');

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

function toggleBurgerLines(menuLines) {
  menuLines.forEach(line => {
      if (line.classList.contains('line-top')) {
          line.classList.toggle('line-top--active');
      }
      if (line.classList.contains('line-bottom')) {
          line.classList.toggle('line-bottom--active');
      }
  });
}

function togglePageScroll() {
  document.body.classList.toggle('body--locked');
}


function smoothScrollToElement(targetElement) {
  targetElement.scrollIntoView({
      behavior: 'smooth'
  });
}

function handleNavLinkClick(e, link, toggleMenu) {
  if (link.getAttribute('href').startsWith('#')) {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
          toggleMenu();
          smoothScrollToElement(targetElement);
      }
  } else {
      toggleMenu();
  }
}

function resetMobileMenu(navSidebar, menuLines) {
  navSidebar.classList.remove('nav-sidebar--active');
  menuLines.forEach(line => {
      line.classList.remove('line-top--active');
      line.classList.remove('line-bottom--active');
  });
  document.body.classList.remove('body--locked');
}

export function turnOnMenu() {

  function toggleMenu() {
      toggleBurgerLines(menuLines);
      navSidebar.classList.toggle('nav-sidebar--active');
      togglePageScroll();
  }
  
  menuButton.addEventListener('click', toggleMenu);
  
  navLinks.forEach(link => {
      link.addEventListener('click', (e) => handleNavLinkClick(e, link, toggleMenu));
  });
  
  window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
          resetMobileMenu(navSidebar, menuLines);
      }
  });
}

//создаем карточку товара при помощи темплейта
function createCard(cardData, onClick) {
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

  cardData.categoryModifier = categoryModifier;
  const cardTitle = cardElement.querySelector(".gifts__card-caption-title");
  cardTitle.textContent = cardData.name;

  // Добавляем обработчик на изображение в карточке
  cardElement.addEventListener("click", () => onClick(cardData));

  return cardElement;
}

//применяем тасование Фишера - Йетса для тасовки массива с карточками
function shuffleCards(cardsList) {
  for (let i = cardsList.length - 1; i > 0; i--) {
    let randomIndex = Math.floor(Math.random() * (i + 1));
    [cardsList[i], cardsList[randomIndex]] = [
      cardsList[randomIndex],
      cardsList[i],
    ];
  }
}

export function displayCards(cards, container) {
  container.innerHTML = "";
  cards.forEach((cardData) => {
    const card = createCard(cardData, onCardImageClick);
    container.appendChild(card);
  });
}

export function onCardImageClick(cardData) {
  popupImage.src = cardData.image;

  popupImage.alt = cardData.category;
  popupCategory.textContent = cardData.category;
  popupCategory.className = `gifts__card-caption-category popup__card-category gifts__card-caption-category--${cardData.categoryModifier}`;

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

export function changeStarsColor(pointsValue, starsContainer) {
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

export function openPopup(cardPopup) {
  if (cardPopup) {
    cardPopup.classList.add("popup_opened");
    document.addEventListener("keydown", closeByKeydown);
    cardPopup.addEventListener("click", clickOnOverlay);
    document.documentElement.style.overflow = "hidden";
  }
}

closeModalButton.addEventListener("click", closePopup);
export function closePopup() {
  if (cardPopup && cardPopup.classList.contains("popup_opened")) {
    cardPopup.classList.remove("popup_opened");
    document.removeEventListener("keydown", closeByKeydown);
    cardPopup.removeEventListener("click", clickOnOverlay);
    document.documentElement.style.overflow = "";
  }
}

export function clickOnOverlay(evt) {
  if (evt.target.classList.contains("popup__overlay")) {
    closePopup();
  }
}

//Если кликнули на esc
export function clickOnEsc(evt) {
  return evt.key === "Escape" || evt.key === "Esc";
}

// Закрытие по клавише
export function closeByKeydown(evt) {
  if (clickOnEsc(evt)) {
    closePopup(document.querySelector(".popup-opened"));
  }
}
