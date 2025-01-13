// Imports
import {
  easyLevelSet,
  mediumLevelSet,
  hardLevelSet,
  createSequence,
  clearContainer,
  createKeyboard,
} from "./utils.js";

// Global Variables
let setsOfDiffuculties = ["easy", "medium", "hard"];

let currentDifficultyLevel = "easy";
let currentRound = 1;
let currentSequence = [];

let userInput = [];
let errorsPerRound = 0;

let isPlayingSequence = false; //проигрывается ли сейчас последовательность
let repeatUsed = false;

let isInputEnabled = false;
let isKeyProcessing = false;

function createStartScreen(container) {
  clearContainer(container);
  const gameOptionsBlock = document.createElement("div");
  gameOptionsBlock.className = "gameOptionsBlock";
  container.appendChild(gameOptionsBlock);

  const difficultyLevels = document.createElement("div");
  difficultyLevels.className = "difficultyLevels";
  gameOptionsBlock.appendChild(difficultyLevels);

  const difficultyLevelsText = document.createElement("div");
  difficultyLevelsText.className = "difficultyLevelsText";
  difficultyLevelsText.textContent =
    `Chosen difficulty level: ${currentDifficultyLevel}`.toUpperCase();
  difficultyLevels.appendChild(difficultyLevelsText);

  const difficultyLevelsButtons = document.createElement("div");
  difficultyLevelsButtons.className = "difficultyLevelsButtons";
  difficultyLevels.appendChild(difficultyLevelsButtons);

  const difficultyButtons = setsOfDiffuculties.map((level) => {
    const button = document.createElement("button");
    button.textContent = level;
    button.className = "difficultyButton";
    if (button.textContent === currentDifficultyLevel) {
      button.classList.add("difficultyButtonActive");
    }
    difficultyLevelsButtons.appendChild(button);
    return button;
  });

  difficultyButtons.forEach((button) => {
    button.addEventListener("click", () => {
      changeLevelDifficulty(button);
    });
  });

  const roundNumber = document.createElement("div");
  roundNumber.className = "roundNumber";
  roundNumber.textContent = "Your level:".toUpperCase();
  gameOptionsBlock.appendChild(roundNumber);

  const roundNumberScreen = document.createElement("div");
  roundNumberScreen.className = "screen";
  roundNumberScreen.textContent = currentRound;
  roundNumberScreen.id = "roundNumberScreen";
  roundNumber.appendChild(roundNumberScreen);

  // Screen
  const inputScreen = document.createElement("input");
  inputScreen.className = "screen";
  inputScreen.id = "inputScreen";
  inputScreen.readOnly = true;
  container.appendChild(inputScreen);

  // Container for buttons
  const buttonsContainer = document.createElement("div");
  buttonsContainer.className = "buttons";
  container.appendChild(buttonsContainer);
  createKeyboard(currentDifficultyLevel, buttonsContainer);

  buttonsContainer.addEventListener("click", (event) => {
    if (event.target.tagName === "BUTTON" && !isPlayingSequence &&
      isInputEnabled) {
      handleUserInput(event.target, inputScreen);
    }
  });

  const startButton = document.createElement("button");
  startButton.className = "levelOptionsButton";
  startButton.textContent = "START";
  container.appendChild(startButton);

  startButton.addEventListener("click", () => {
    startGame(startButton, roundNumber);
  });

  const levelOptionsBlock = document.createElement("div");
  levelOptionsBlock.className = "levelOptionsBlock";
  container.appendChild(levelOptionsBlock);

  const repeatButton = document.createElement("button");
  repeatButton.className = "levelOptionsButton";
  repeatButton.id = "repeat";
  repeatButton.textContent = "Repeat the sequence".toUpperCase();
  levelOptionsBlock.appendChild(repeatButton);

  repeatButton.addEventListener("click", () => {
    if (!repeatUsed) {
      displaySequenceOnKeyboard(currentSequence, buttonsContainer);
      repeatButton.disabled = true;
      repeatButton.classList.add("disabledButton");
      repeatUsed = true;
      informationBlock.style.display = "none";
      inputScreen.value = "";
      userInput = [];
      isInputEnabled = true;
    }
  });

  const nextButton = document.createElement("button");
  nextButton.className = "levelOptionsButton";
  nextButton.id = "next";
  nextButton.textContent = "Next".toUpperCase();
  levelOptionsBlock.appendChild(nextButton);

  const restartGame = document.createElement("button");
  restartGame.className = "levelOptionsButton restartButton";
  restartGame.textContent = "New Game".toUpperCase();
  levelOptionsBlock.appendChild(restartGame);

  restartGame.addEventListener("click", resetGame);

  const informationBlock = document.createElement("div");
  informationBlock.className = "informationBlock";
  container.appendChild(informationBlock);

  setupKeyboardListener();
}

function changeLevelDifficulty(selectedButton) {
  const difficultyLevelText = document.querySelector(".difficultyLevelsText");
  const buttons = document.querySelectorAll(".difficultyButton");
  buttons.forEach((btn) => btn.classList.remove("difficultyButtonActive"));
  selectedButton.classList.add("difficultyButtonActive");
  currentDifficultyLevel = selectedButton.textContent;
  const buttonsContainer = document.querySelector(".buttons");
  createKeyboard(currentDifficultyLevel, buttonsContainer);
  difficultyLevelText.textContent =
    `Chosen difficulty level: ${currentDifficultyLevel}`.toUpperCase();
}

function handleUserInput(button, inputScreen) {
  if (isPlayingSequence) return;

   button.classList.add("sequenceKeyboardButton");

   setTimeout(() => {
     button.classList.remove("sequenceKeyboardButton");
   }, 300);

  updateInputScreen(button, inputScreen);

  if (!checkUserInput()) {
    handleErrors(inputScreen);
    return;
  }

  if (userInput.length === currentSequence.length) {
    handleCorrectSequence();
  }
}

function updateInputScreen(button, inputScreen) {
  const value = button.textContent;
  userInput.push(value);
  inputScreen.value = userInput.join("");
}

function checkUserInput() {
  const currentIndex = userInput.length - 1;
  return userInput[currentIndex] === currentSequence[currentIndex];
}

function handleErrors(inputScreen) {
  errorsPerRound++;
  const errorInfoBlock = document.querySelector(".informationBlock");
  const keyboardButtons = document.querySelectorAll(".buttons button");

  keyboardButtons.forEach((btn) => (btn.disabled = true));
  errorInfoBlock.style.display = "flex";
  errorInfoBlock.classList.add("informationBlockMistake");

  if (errorsPerRound > 1) {
    errorInfoBlock.textContent =
      "You've used two attempts. The game is over! Push 'New Game' if you want to try again.";
    isInputEnabled = false;
  } else {
    errorInfoBlock.textContent =
      "You made a mistake! There's only one chance left to win.";
    userInput = [];
    inputScreen.value = "";
    isInputEnabled = false;
  }
}

function handleCorrectSequence() {
  const errorInfoBlock = document.querySelector(".informationBlock");
  const nextButton = document.getElementById("next");
  const repeatButton = document.getElementById("repeat");
  const keyboardButtons = document.querySelectorAll(".buttons button");

  setTimeout(() => {
    if (currentRound === 5) {
      repeatButton.classList.add("disabledButton");
      errorInfoBlock.style.display = "flex";
      errorInfoBlock.classList.add("informationBlockCorrect");
      errorInfoBlock.textContent =
        "You're win! Push 'New Game' if you want to try again.";
      isInputEnabled = false;
      return;
    }
    errorInfoBlock.style.display = "flex";
    errorInfoBlock.classList.add("informationBlockCorrect");
    errorInfoBlock.textContent = "Correct! Press 'NEXT' to continue.";
    nextButton.style.display = "flex";
    repeatButton.style.display = "none";
    keyboardButtons.forEach((btn) => (btn.disabled = true));
    isInputEnabled = false;
  }, 100);
}

function displaySequenceOnKeyboard(sequence, container) {
  let index = 0;
  const buttons = container.querySelectorAll("button");
  const optionsButtons = document.querySelectorAll(".levelOptionsBlock button");
  buttons.forEach((btn) => (btn.disabled = true));
  optionsButtons.forEach((btn) => (btn.disabled = true));

  isPlayingSequence = true;

  const interval = setInterval(() => {
    if (index >= sequence.length) {
      clearInterval(interval);
      buttons.forEach((btn) => (btn.disabled = false));
      optionsButtons.forEach((btn) => (btn.disabled = false));
      isPlayingSequence = false;
      return;
    }

    const symbol = sequence[index];
    const button = Array.from(container.children).find(
      (btn) => btn.textContent === symbol
    );

    if (button) {
      button.classList.add("sequenceKeyboardButton");
      setTimeout(() => button.classList.remove("sequenceKeyboardButton"), 500);
    }

    index++;
  }, 800);
}

function startGame(startButton, roundNumber) {
  startButton.style.display = "none";
  roundNumber.style.display = "flex";
  document.querySelector(".levelOptionsBlock").style.display = "flex";
  document.querySelector(".difficultyLevels").style.width = "65%";

  document.querySelectorAll(".difficultyButton").forEach((button) => {
    button.disabled = true;
    button.classList.add("disabledButton");
  });

  currentSequence = createSequence(currentDifficultyLevel, currentRound);
  const buttonsContainer = document.querySelector(".buttons");
  displaySequenceOnKeyboard(currentSequence, buttonsContainer);
  isInputEnabled = true;
}

function setupKeyboardListener() {
  const layoutMap = {
    А: "F",
    Б: ",",
    В: "D",
    Г: "U",
    Д: "L",
    Е: "T",
    Ё: "T",
    Ж: ";",
    З: "P",
    И: "B",
    Й: "Q",
    К: "R",
    Л: "K",
    М: "V",
    Н: "Y",
    О: "J",
    П: "G",
    Р: "H",
    С: "C",
    Т: "N",
    У: "E",
    Ф: "A",
    Х: "[",
    Ц: "W",
    Ч: "X",
    Ш: "I",
    Щ: "O",
    Ъ: "]",
    Ы: "S",
    Ь: "M",
    Э: "'",
    Ю: ".",
    Я: "Z",
  };
  document.addEventListener("keydown", (event) => {
    if (!isInputEnabled || isPlayingSequence || isKeyProcessing) return;

    isKeyProcessing = true;

    let keyPressed = event.key.toUpperCase();
    if (layoutMap[keyPressed]) {
      keyPressed = layoutMap[keyPressed];
    }

    const validSymbols =
      currentDifficultyLevel === "easy"
        ? easyLevelSet
        : currentDifficultyLevel === "medium"
        ? mediumLevelSet
        : hardLevelSet;

    if (!validSymbols.includes(keyPressed)) {
      isKeyProcessing = false;
      return;
    }

    const buttonsContainer = document.querySelector(".buttons");
    const virtualButton = Array.from(buttonsContainer.children).find(
      (btn) => btn.textContent === keyPressed
    );

    if (virtualButton) {
      virtualButton.classList.add("sequenceKeyboardButton");
      setTimeout(() => {
        virtualButton.classList.remove("sequenceKeyboardButton");
        isKeyProcessing = false;
      }, 300);

      const inputScreen = document.getElementById("inputScreen");
      handleUserInput(virtualButton, inputScreen);
    } else {
      isKeyProcessing = false;
    }
  });
}

function resetGame() {
  currentRound = 1;
  userInput = [];
  errorsPerRound = 0;
  repeatUsed = false;
  isPlayingSequence = false;
  initializeGame();
}

function initializeGame() {
  let gamepad = document.querySelector(".gamepad");
  if (!gamepad) {
    gamepad = document.createElement("div");
    gamepad.className = "gamepad";
    document.body.appendChild(gamepad);
  } else {
    clearContainer(gamepad);
  }
  createStartScreen(gamepad);
}

initializeGame();
