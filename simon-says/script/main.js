// Imports
import {
  easyLevelSet,
  mediumLevelSet,
  hardLevelSet,
  createSequence,
  clearContainer,
  createKeyboard
} from "./utils.js";

// Global Variables
let setsOfDiffuculties = ["easy", "medium", "hard"];

let currentDifficultyLevel = "easy";
let currentRound = 1;
let currentSequence = [];

let userInput = [];
let errorsPerRound = 0;

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
  createKeyboard(currentDifficultyLevel, buttonsContainer)
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
