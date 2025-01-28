//imports
import { schemes, schemesNames } from "./schemes.js";
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

const select = document.createElement("select");
select.classList = 'select';
schemesNames.forEach((optionText) => {
  const option = document.createElement("option");
  option.value = optionText;
  option.textContent = optionText;
  select.appendChild(option);
});
menu.appendChild(select);

const resetButton = document.createElement("button");
resetButton.classList = "resetButton";
resetButton.textContent = 'Reset'
menu.appendChild(resetButton)

function createStartScreen(container, difficulty, number) {
  topLevelOfField.appendChild(createTopHintsField(difficulty, number));

  container.appendChild(topLevelOfField);

  bottomLevelOfField.appendChild(createLeftHintsField(difficulty, number));
  bottomLevelOfField.appendChild(createFieldSize(difficulty, nonogramField)); //само поле
  container.appendChild(bottomLevelOfField);
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

function initGame(difficulty, number) {
  let gamepad = document.querySelector(".gamepad");
  if (!gamepad) {
    gamepad = document.createElement("div");
    gamepad.className = "gamepad";
    document.body.appendChild(gamepad);
  }
  createStartScreen(gamepad, difficulty, number);
}

initGame(chosenDifficulty, indexOfSchema);

//listeners
const cellsArray = document.querySelectorAll(".nonogramField .cell"); //псевдомассив с ячейками на поле для отработки событий
cellsArray.forEach((cell) => {
  cell.addEventListener("click", () => {
    if (cell.classList.contains("shadedCell")) {
      cell.classList.remove("shadedCell");
    } else {
      cell.classList.remove("crossCell");
      cell.classList.add("shadedCell");
    }
  });

  cell.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    if (cell.classList.contains("crossCell")) {
      cell.classList.remove("crossCell");
    } else {
      cell.classList.remove("shadedCell");
      cell.classList.add("crossCell");
    }
  });
});

select.addEventListener("change", () => {
  selectedText = select.options[select.selectedIndex].text;
  lengthOfFirstLine = schemes[select.selectedIndex][0].length;
  chosenDifficulty =
    lengthOfFirstLine === 5
      ? "easy"
      : lengthOfFirstLine === 10
      ? "medium"
      : lengthOfFirstLine === 15
      ? "hard"
      : chosenDifficulty;
  console.log(lengthOfFirstLine, chosenDifficulty);
  initGame(chosenDifficulty, select.selectedIndex);
});

resetButton.addEventListener('click', () => {
    cellsArray.forEach((cell) => {
        cell.classList.remove('shadedCell', 'crossCell')
    })
})
