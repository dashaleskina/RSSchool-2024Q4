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
  //sample for create start screen
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
  createStartScreen();
}

initializeGame();
