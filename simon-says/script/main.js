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

  const nextButton = document.createElement("button");
  nextButton.className = "levelOptionsButton";
  nextButton.id = "next";
  nextButton.textContent = "Next".toUpperCase();
  levelOptionsBlock.appendChild(nextButton);

  const restartGame = document.createElement("button");
  restartGame.className = "levelOptionsButton restartButton";
  restartGame.textContent = "New Game".toUpperCase();
  levelOptionsBlock.appendChild(restartGame);
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

function displaySequenceOnKeyboard(sequence, container) {
  let index = 0;
  const buttons = container.querySelectorAll("button");
  const optionsButtons = document.querySelectorAll(".levelOptionsBlock button");
  buttons.forEach((btn) => (btn.disabled = true));
  optionsButtons.forEach((btn) => (btn.disabled = true));

  const interval = setInterval(() => {
    if (index >= sequence.length) {
      clearInterval(interval);
      buttons.forEach((btn) => (btn.disabled = false));
      optionsButtons.forEach((btn) => (btn.disabled = false));
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
