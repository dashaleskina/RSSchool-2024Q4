// Imports
import {
  easyLevelSet,
  mediumLevelSet,
  hardLevelSet,
  createSequence,
  clearContainer,
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

  const inputScreen = document.createElement("input");
  inputScreen.className = "screen";
  inputScreen.id = "inputScreen";
  inputScreen.readOnly = true;
  container.appendChild(inputScreen);
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
