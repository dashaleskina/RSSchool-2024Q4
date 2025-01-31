//imports
import { schemes, schemesNames, difficultyLevels } from "./schemes.js";
import {
  setSizeOfField,
  setSizeOfCell,
  setVerticalHints,
  setHorizontalHints,
  setCountOfBlocksInHintsField,
} from "./options.js";

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

const nonogramField = document.createElement("div");
nonogramField.className = "nonogramField";

const leftHintsField = document.createElement("div");
leftHintsField.className = "leftHintsField";

const topHintsField = document.createElement("div");
topHintsField.className = "topHintsField";

const topLevelOfField = document.createElement("div");
topLevelOfField.className = "topLevelOfField";

const bottomLevelOfField = document.createElement("div");
bottomLevelOfField.className = "bottomLevelOfField";

const menu = document.createElement("div");
menu.classList = "menu";
topLevelOfField.appendChild(menu);

const selectDifficulty = document.createElement("select");
selectDifficulty.classList = "selectDifficulty"
difficultyLevels.forEach((diffText) => {
    const option = document.createElement("option");
    option.value = diffText;
    option.textContent = diffText;
    selectDifficulty.appendChild(option);
})
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

const randomGameButton = document.createElement("button");
randomGameButton.classList = "randomGameButton";
randomGameButton.textContent = "Random game";
menu.appendChild(randomGameButton);

const showSolutionButton = document.createElement("button");
showSolutionButton.classList = "showSolutionButton";
showSolutionButton.textContent = "Show solution";
menu.appendChild(showSolutionButton);

const resetButton = document.createElement("button");
resetButton.classList = "resetButton";
resetButton.textContent = "Reset";
menu.appendChild(resetButton);

const footerBlock = document.createElement("div");
footerBlock.classList = "footerBlock";

const timer = document.createElement("div");
timer.classList = "timer";
timer.textContent = "Time:"
footerBlock.appendChild(timer)

for (let i = 0; i < 5; i++) {
    const span = document.createElement("span");
    span.classList = "timerSpan";
    span.textContent = "0";
    if (i === 2) {
        span.textContent = ":"
    }
    timer.appendChild(span);
  }

const infoBlock = document.createElement("div");
infoBlock.classList = "infoBlock";
footerBlock.appendChild(infoBlock);


const infoMessage = document.createElement("div");
infoMessage.classList = "infoMessage";
infoMessage.textContent = "Great! You have solved the nonogram!";
infoBlock.appendChild(infoMessage);

function createStartScreen(container, difficulty, number) {
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
    infoMessage.style.display = "flex";
    showSolutionButton.disabled = true;

    const cellsArray = document.querySelectorAll(".nonogramField .cell");
    cellsArray.forEach((cell) => {
      cell.classList.add("disabledCell");
    });

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

  infoMessage.style.display = "none";
  resetButton.disabled = false;
  showSolutionButton.disabled = false;
  initGame(chosenDifficulty, schemaIndex);
}

function randomGame () {
    const randomDifficultyIndex = Math.floor(Math.random() * difficultyLevels.length);
    const randomDifficulty = difficultyLevels[randomDifficultyIndex];

    selectDifficulty.value = randomDifficulty;
    filterSchemesByDifficulty(randomDifficulty);

    const randomIndex = Math.floor(Math.random() * select.options.length);
    select.selectedIndex = randomIndex;
    changeSchema();
}

function showSolution () {
    const cellsArray = document.querySelectorAll(".nonogramField .cell");
    flatArray.forEach((value, index) => {
        if (value === 1) {
            cellsArray[index].classList.add("shadedCell")
            showSolutionButton.disabled = true;

        } else {
            cellsArray[index].classList.remove("shadedCell")
        }
    })
    cellsArray.forEach((cell) => {
        cell.classList.add("disabledCell");
      });
}

function startTimer() {
    timerInterval = setInterval(() => {
        seconds++;
        if (seconds === 60) {
            seconds = 0
            minutes++;
        }

        updateTimerDisplay();
    }, 1000)
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
  timerSpans[2].textContent = ":"
  timerSpans[3].textContent = secondTens;
  timerSpans[4].textContent = secondOnes;
}

function filterSchemesByDifficulty(difficulty) {
    select.innerHTML = "";

    const sizeMap = {
        easy: 5,
        medium: 10,
        hard: 15,
    }

    const targetSize = sizeMap[difficulty];

    schemes.forEach((scheme, index) => {
        if (scheme[0].length === targetSize) {
            const option = document.createElement("option");
            option.value = schemesNames[index];
            option.textContent = schemesNames[index];
            option.setAttribute("data-index", index)
            select.appendChild(option)
        }
    });

    if (select.options.length > 0) {
        select.selectedIndex = 0;
        changeSchema()
    }
}

//инициализация
function initGame(difficulty, number) {
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
      } else {
        cell.classList.remove("crossCell");
        cell.classList.add("shadedCell");
        checkSchemaAnswer(index, 1);
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
      } else {
        cell.classList.remove("shadedCell");
        cell.classList.add("crossCell");
        checkSchemaAnswer(index, 0);
      }
    });
  });
}

// слушатели
selectDifficulty.addEventListener("change", () => {
    const selectedDifficulty = selectDifficulty.value;
    filterSchemesByDifficulty(selectedDifficulty);
})
select.addEventListener("change", changeSchema);
randomGameButton.addEventListener("click", randomGame);
showSolutionButton.addEventListener("click", showSolution);
resetButton.addEventListener("click", () => {
  const cellsArray = document.querySelectorAll(".nonogramField .cell");
  cellsArray.forEach((cell) => {
    cell.classList.remove("shadedCell", "crossCell", "disabledCell");
  });
  flatArrayForCheck = flatArray.map((item) => {
    return item === 1 ? 0 : item;
  });
  showSolutionButton.disabled = false;
  infoMessage.style.display = "none";

  stopTimer();
  timerStarted = false;
  minutes = 0;
  seconds = 0;
  updateTimerDisplay();
});

//вызов инициализации
initGame(chosenDifficulty, indexOfSchema);
