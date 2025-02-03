//imports
import { schemes, schemesNames, difficultyLevels } from "./schemes.js";
import {
  setSizeOfField,
  setSizeOfCell,
  setVerticalHints,
  setHorizontalHints,
  setCountOfBlocksInHintsField,
} from "./options.js";
import { createButton, createDiv } from "./createElements.js";

//variables
let selectedText;
let chosenDifficulty = "easy";
let lengthOfFirstLine;
let indexOfSchema = 0;
let flatArray = schemes[0].flat();
let flatArrayForCheck = flatArray.map((item) => {
  return item === 1 ? 0 : item;
});
let timerInterval;
let timerStarted = false;
let minutes = 0;
let seconds = 0;
let isSoundOn = false;

const hatchSound = new Audio("../nonograms/sounds/pencilAdd.wav");
const crossSound = new Audio("../nonograms/sounds/pencilCross.wav");
const eraseSound = new Audio("../nonograms/sounds/pencilErase.wav");
const winSound = new Audio("../nonograms/sounds/win.mp3");

//создание элементов модалки c меню
const dialog = document.createElement("dialog");
dialog.id = "myDialog";
dialog.classList = "child";
const wrapper = createDiv("dialogWrapper", dialog);
const randomGameButtonInDialog = createButton(
  "randomGameButton",
  "Random game",
  wrapper
);
const showSolutionButtonInDialog = createButton(
  "showSolutionButton",
  "solution",
  wrapper
);
const resetButtonInDialog = createButton("resetButton", "Reset", wrapper);
const toggleSoundButtonInDialog = createButton(
    "toggleSoundButton",
    "turn off sound 🔇",
    wrapper
  );
const closeButton = createButton("closeButton", "Close", wrapper);
document.body.appendChild(dialog);

//создание элементов модалки с лучшими результатами
const highScoresDialog = document.createElement("dialog");
highScoresDialog.id = "highScoresDialog";
highScoresDialog.classList = "highScoresDialog";

const highScoresTitle = document.createElement("h2");
highScoresTitle.textContent = "High Scores";
highScoresDialog.appendChild(highScoresTitle);

const highScoresContainer = document.createElement("div");
highScoresContainer.id = "highScoresContainer";
highScoresContainer.classList = "highScoresContainer";
highScoresDialog.appendChild(highScoresContainer);

const closeHighScoresButton = createButton(
  "closeButton",
  "Close",
  highScoresDialog
);
closeHighScoresButton.addEventListener("click", () => {
  highScoresDialog.close();
});

document.body.appendChild(highScoresDialog);

//создание элементов игрового поля
const nonogramField = createDiv("nonogramField");
const optionBlock = createDiv("optionBlock");
const headerBlock = createDiv("headerBlock");
const headerBlockTitle = createDiv(
  "headerBlockTitle",
  headerBlock,
  "Nonograms"
);
const headerBlockOptions = createDiv("headerBlockOptions", headerBlock);
const openMenuButton = createButton(
  "openMenuButton",
  "menu",
  headerBlockOptions
);
const changeThemeButton = createButton(
  "changeThemeButton",
  "dark theme 🌃",
  headerBlockOptions
);
const bestScore = createButton(
  "bestScore",
  "best score 🏆",
  headerBlockOptions
);
const leftHintsField = createDiv("leftHintsField");
const topHintsField = createDiv("topHintsField");
const topLevelOfField = createDiv("topLevelOfField");
const bottomLevelOfField = createDiv("bottomLevelOfField");
const menu = createDiv("menu", topLevelOfField);
const footerBlock = createDiv("footerBlock");
const timer = createDiv("timer", footerBlock, "Time:");
const infoBlock = createDiv("infoBlock", footerBlock);
const infoMessage = createDiv(
  "infoMessage",
  infoBlock,
  `Great!
   You have solved the nonogram in XX:XX seconds!`
);
let winningTime = "";

const selectDifficulty = document.createElement("select");
selectDifficulty.classList = "selectDifficulty";
difficultyLevels.forEach((diffText) => {
  const option = document.createElement("option");
  option.value = diffText;
  option.textContent = diffText;
  selectDifficulty.appendChild(option);
});
menu.appendChild(selectDifficulty);

const select = document.createElement("select");
select.classList = "select";
schemesNames.forEach((optionText) => {
  const option = document.createElement("option");
  option.value = optionText;
  option.textContent = optionText;
  select.appendChild(option);
});
menu.appendChild(select);

for (let i = 0; i < 5; i++) {
  const span = document.createElement("span");
  span.classList = "timerSpan";
  span.textContent = "0";
  if (i === 2) {
    span.textContent = ":";
  }
  timer.appendChild(span);
}

//создание элементов бокового меню
const randomGameButton = createButton(
  "randomGameButton",
  "Random game",
  optionBlock
);
const showSolutionButton = createButton(
  "showSolutionButton",
  "solution",
  optionBlock
);
const resetButton = createButton("resetButton", "Reset", optionBlock);
const toggleSoundButton = createButton(
    "toggleSoundButton",
    "turn off sound 🔇",
    optionBlock
  );

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//функциональность
function createStartScreen(container, difficulty, number) {
  container.appendChild(headerBlock);
  topLevelOfField.appendChild(createTopHintsField(difficulty, number));

  container.appendChild(topLevelOfField);

  bottomLevelOfField.appendChild(createLeftHintsField(difficulty, number));
  bottomLevelOfField.appendChild(createFieldSize(difficulty, nonogramField)); //само поле

  container.appendChild(bottomLevelOfField);
  container.appendChild(footerBlock);
}

function createLeftHintsField(difficulty, number) {
  const leftHintsArray = setVerticalHints(schemes[number]);
  return createHintsField(
    leftHintsArray,
    difficulty,
    "vertical",
    leftHintsField
  );
}

function createTopHintsField(difficulty, number) {
  const topHintsArray = setHorizontalHints(schemes[number]);
  return createHintsField(
    topHintsArray,
    difficulty,
    "horizontal",
    topHintsField
  );
}

function createHintsField(hintsArray, difficulty, orientation, container) {
  container.innerHTML = "";

  const sizeOfCell = setSizeOfCell(difficulty);
  const countOfBlocks = setCountOfBlocksInHintsField(difficulty);

  if (orientation === "vertical") {
    container.style.width = `${countOfBlocks * sizeOfCell}px`;
    container.style.height = `${hintsArray.length * sizeOfCell}px`;
  } else if (orientation === "horizontal") {
    container.style.height = `${countOfBlocks * sizeOfCell}px`;
    container.style.width = `${hintsArray.length * sizeOfCell}px`;
  }

  for (let i = 0; i < hintsArray.length; i++) {
    const lineContainer = document.createElement("div");
    lineContainer.style.display = "flex";

    if (orientation === "vertical") {
      lineContainer.style.justifyContent = "flex-end";
      lineContainer.style.height = `${sizeOfCell}px`;
    } else if (orientation === "horizontal") {
      lineContainer.style.flexDirection = "column";
      lineContainer.style.alignItems = "center";
      lineContainer.style.width = `${sizeOfCell}px`;
    }

    for (let j = countOfBlocks - 1; j >= 0; j--) {
      const cell = document.createElement("div");
      cell.classList = "cell hintCell";
      cell.textContent = hintsArray[i][j] || "";
      cell.style.width = `${sizeOfCell}px`;
      cell.style.height = `${sizeOfCell}px`;

      if (orientation === "horizontal" && (i + 1) % 5 === 0) {
        cell.classList.add("cellBorderRow");
      }
      if (orientation === "horizontal" && j === 0) {
        cell.classList.add("cellBorderColumn");
      }

      if (orientation === "vertical" && i % 5 === 4) {
        cell.classList.add("cellBorderColumn");
      }
      if (orientation === "vertical" && j === 0) {
        cell.classList.add("cellBorderRow");
      }

      lineContainer.appendChild(cell);
    }

    menu.style.width = `${sizeOfCell * countOfBlocks}px`;
    menu.style.height = `${sizeOfCell * countOfBlocks}px`;

    container.appendChild(lineContainer);
  }

  return container;
}

function createFieldSize(difficulty, field) {
  field.innerHTML = "";

  let sizeOfField = setSizeOfField(difficulty);
  let sizeOfCell = setSizeOfCell(difficulty);
  field.style.width = `${sizeOfField * sizeOfCell}px`;

  for (let i = 0; i < sizeOfField * sizeOfField; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";

    cell.style.width = `${sizeOfCell}px`;
    cell.style.height = `${sizeOfCell}px`;

    if ((i + 1) % 5 === 0) {
      cell.classList.add("cellBorderRow");
    }
    if (Math.floor(i / sizeOfField) % 5 === 4) {
      cell.classList.add("cellBorderColumn");
    }
    field.appendChild(cell);
  }

  return field;
}

function checkSchemaAnswer(index, value) {
  if (value !== null) {
    flatArrayForCheck[index] = value;
  }

  if (JSON.stringify(flatArrayForCheck) === JSON.stringify(flatArray)) {
    winningTime = `${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;
    infoMessage.textContent = `Great!
      You have solved the nonogram in ${winningTime}!`;
    infoMessage.style.visibility = "visible";
    showSolutionButton.disabled = true;
    showSolutionButton.style.pointerEvents = "none";
    playSound(winSound)

    const cellsArray = document.querySelectorAll(".nonogramField .cell");
    cellsArray.forEach((cell) => {
      cell.classList.add("disabledCell");
    });

    saveResult(selectedText, winningTime, chosenDifficulty);
    stopTimer();
  } else {
    console.log("continue", flatArray, flatArrayForCheck);
  }
}

function changeSchema() {
  const selectedOption = select.options[select.selectedIndex];
  const schemaIndex = parseInt(selectedOption.getAttribute("data-index"), 10);

  selectedText = select.options[select.selectedIndex].text;
  lengthOfFirstLine = schemes[schemaIndex][0].length;
  chosenDifficulty =
    lengthOfFirstLine === 5
      ? "easy"
      : lengthOfFirstLine === 10
      ? "medium"
      : lengthOfFirstLine === 15
      ? "hard"
      : chosenDifficulty;

  flatArray = schemes[schemaIndex].flat();
  flatArrayForCheck = flatArray.map((item) => {
    return item === 1 ? 0 : item;
  });

  infoMessage.style.visibility = "hidden";
  resetButton.disabled = false;
  showSolutionButton.disabled = false;
  showSolutionButton.style.pointerEvents = "auto";
  initGame(chosenDifficulty, schemaIndex);

  stopTimer();
  timerStarted = false;
  minutes = 0;
  seconds = 0;
  updateTimerDisplay();
}

function randomGame() {
  const randomDifficultyIndex = Math.floor(
    Math.random() * difficultyLevels.length
  );
  const randomDifficulty = difficultyLevels[randomDifficultyIndex];

  selectDifficulty.value = randomDifficulty;
  filterSchemesByDifficulty(randomDifficulty);

  const randomIndex = Math.floor(Math.random() * select.options.length);
  select.selectedIndex = randomIndex;
  changeSchema();

  stopTimer();
  timerStarted = false;
  minutes = 0;
  seconds = 0;
  updateTimerDisplay();
}

function showSolution() {
  const cellsArray = document.querySelectorAll(".nonogramField .cell");
  flatArray.forEach((value, index) => {
    if (value === 1) {
      cellsArray[index].classList.add("shadedCell");
      // showSolutionButton.disabled = true;
      // showSolutionButton.style.pointerEvents = "none"
    } else {
      cellsArray[index].classList.remove("shadedCell");
    }
  });
  cellsArray.forEach((cell) => {
    cell.classList.add("disabledCell");
  });
  stopTimer();
  timerStarted = false;
  minutes = 0;
  seconds = 0;
  updateTimerDisplay();
}

function resetGame() {
  const cellsArray = document.querySelectorAll(".nonogramField .cell");
  cellsArray.forEach((cell) => {
    cell.classList.remove("shadedCell", "crossCell", "disabledCell");
  });
  flatArrayForCheck = flatArray.map((item) => {
    return item === 1 ? 0 : item;
  });
  showSolutionButton.style.pointerEvents = "auto";
  infoMessage.style.visibility = "hidden";
}

function startTimer() {
  timerInterval = setInterval(() => {
    seconds++;
    if (seconds === 60) {
      seconds = 0;
      minutes++;
    }

    updateTimerDisplay();
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function updateTimerDisplay() {
  const timerSpans = document.querySelectorAll(".timerSpan");

  const minuteTens = Math.floor(minutes / 10);
  const minuteOnes = minutes % 10;

  const secondTens = Math.floor(seconds / 10);
  const secondOnes = seconds % 10;

  timerSpans[0].textContent = minuteTens;
  timerSpans[1].textContent = minuteOnes;
  timerSpans[2].textContent = ":";
  timerSpans[3].textContent = secondTens;
  timerSpans[4].textContent = secondOnes;
}

function filterSchemesByDifficulty(difficulty) {
  select.innerHTML = "";

  const sizeMap = {
    easy: 5,
    medium: 10,
    hard: 15,
  };

  const targetSize = sizeMap[difficulty];

  schemes.forEach((scheme, index) => {
    if (scheme[0].length === targetSize) {
      const option = document.createElement("option");
      option.value = schemesNames[index];
      option.textContent = schemesNames[index];
      option.setAttribute("data-index", index);
      select.appendChild(option);
    }
  });

  if (select.options.length > 0) {
    select.selectedIndex = 0;
    changeSchema();
  }
}

function saveResult(name, time, difficulty) {
  let bestScores = JSON.parse(localStorage.getItem("bestScores")) || [];
  const newScore = {
    name: name,
    time: time,
    difficulty: difficulty,
  };
  bestScores.push(newScore);

  if (bestScore.length > 5) {
    bestScores = bestScores.slice(-5);
  }

  bestScores.sort((a, b) => {
    const [aMin, aSec] = a.time.split(":").map(Number);
    const [bMin, bSec] = b.time.split(":").map(Number);
    const aTotal = aMin * 60 + aSec;
    const bTotal = bMin * 60 + bSec;
    return aTotal - bTotal;
  });
  localStorage.setItem("bestScores", JSON.stringify(bestScores));
}

function displayHighScores() {
  const highScores = JSON.parse(localStorage.getItem("bestScores")) || [];
  const highScoresContainer = document.getElementById("highScoresContainer"); //

  highScoresContainer.innerHTML = "";

  const headerRow = document.createElement("div");
  headerRow.className = "highScoresRow highScoresHeader";
  headerRow.innerHTML = `
      <div class="highScoresCell">Nonogram</div>
      <div class="highScoresCell">Level</div>
      <div class="highScoresCell">Time</div>
    `;
  highScoresContainer.appendChild(headerRow);

  if (highScores.length === 0) {
    const emptyRow = document.createElement("div");
    emptyRow.className = "highScoresRow";
    emptyRow.innerHTML = `
        <div class="highScoresCell" colspan="3">no results yet</div>
      `;
    highScoresContainer.appendChild(emptyRow);
    return;
  }
  highScores.forEach((score) => {
    const row = document.createElement("div");
    row.className = "highScoresRow";
    row.innerHTML = `
        <div class="highScoresCell">${score.name}</div>
        <div class="highScoresCell">${score.difficulty}</div>
        <div class="highScoresCell">${score.time}</div>
      `;
    highScoresContainer.appendChild(row);
  });
}

function playSound(sound) {
    if (!isSoundOn) {
        sound.play();
    }
}

//инициализация
function initGame(difficulty, number) {
  document.body.appendChild(optionBlock);
  let gamepad = document.querySelector(".gamepad");

  if (!gamepad) {
    gamepad = document.createElement("div");
    gamepad.className = "gamepad";
    document.body.appendChild(gamepad);
  }

  gamepad.innerHTML = "";
  createStartScreen(gamepad, difficulty, number);
  addCellEventListeners();
}

filterSchemesByDifficulty(chosenDifficulty);

// клик по клетке
function addCellEventListeners() {
  const cellsArray = document.querySelectorAll(".nonogramField .cell");

  cellsArray.forEach((cell, index) => {
    cell.addEventListener("click", () => {
      if (!timerStarted) {
        startTimer();
        timerStarted = true;
      }

      if (cell.classList.contains("shadedCell")) {
        cell.classList.remove("shadedCell");
        checkSchemaAnswer(index, 0);
        playSound(eraseSound)
        // eraseSound.play();
      } else {
        cell.classList.remove("crossCell");
        cell.classList.add("shadedCell");
        checkSchemaAnswer(index, 1);
        playSound(hatchSound);
        // hatchSound.play();
      }
    });

    cell.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      if (!timerStarted) {
        startTimer();
        timerStarted = true;
      }

      if (cell.classList.contains("crossCell")) {
        cell.classList.remove("crossCell");
        checkSchemaAnswer(index, null);
        playSound(eraseSound)
      } else {
        cell.classList.remove("shadedCell");
        cell.classList.add("crossCell");
        checkSchemaAnswer(index, 0);
        playSound(crossSound)
      }
    });
  });
}

function changeSoundOption (button) {
    isSoundOn = !isSoundOn;
    button.textContent = isSoundOn ? "turn on sound 🔈" : "turn off sound 🔇"
    }

// слушатели
changeThemeButton.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");

  if (document.body.classList.contains("dark-theme")) {
    changeThemeButton.textContent = "light theme";
    localStorage.setItem("theme", "dark");
  } else {
    changeThemeButton.textContent = "dark theme 🌃";
    localStorage.setItem("theme", "light");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark-theme")
    changeThemeButton.textContent = "light theme 🌅";
  } else {
    changeThemeButton.textContent = "dark theme 🌃";
  }
});

selectDifficulty.addEventListener("change", () => {
  const selectedDifficulty = selectDifficulty.value;
  filterSchemesByDifficulty(selectedDifficulty);
});
select.addEventListener("change", changeSchema);
randomGameButton.addEventListener("click", randomGame);
randomGameButtonInDialog.addEventListener("click", () => {
  randomGame();
  close();
});
showSolutionButton.addEventListener("click", showSolution);
showSolutionButtonInDialog.addEventListener("click", () => {
  showSolution();
  close();
});
resetButton.addEventListener("click", resetGame);
resetButtonInDialog.addEventListener("click", () => {
  resetGame();
  close();
});

function closeOnOverlay({ currentTarget, target }) {
  const dialog = currentTarget;
  const isClickedOnBackDrop = target === dialog;
  if (isClickedOnBackDrop) {
    close();
  }
}

function lockScroll() {
  dialog.showModal();
  document.body.classList.add("scroll-lock");
}

function returnScroll() {
  document.body.classList.remove("scroll-lock");
}

function close() {
  dialog.close();
  returnScroll();
}

dialog.addEventListener("click", closeOnOverlay);
dialog.addEventListener("cancel", (event) => {
  returnScroll();
});
openMenuButton.addEventListener("click", lockScroll);
closeButton.addEventListener("click", (event) => {
  event.stopPropagation();
  close();
});

bestScore.addEventListener("click", () => {
  displayHighScores();
  highScoresDialog.showModal(); // Открываем dialog
});
toggleSoundButton.addEventListener("click", () => changeSoundOption(toggleSoundButton));
toggleSoundButtonInDialog.addEventListener("click", () => changeSoundOption(toggleSoundButtonInDialog));


//вызов инициализации
initGame(chosenDifficulty, indexOfSchema);
