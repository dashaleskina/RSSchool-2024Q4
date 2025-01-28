//imports
import { schemes } from "./schemes.js";
import {
  setSizeOfField,
  setSizeOfCell,
  setVerticalHints,
  setHorizontalHints,
  setCountOfBlocksInHintsField,
} from "./options.js";

//variables
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

function createStartScreen(container, difficulty) {
  topLevelOfField.appendChild(createTopHintsField(difficulty));

  container.appendChild(topLevelOfField);

  bottomLevelOfField.appendChild(createLeftHintsField(difficulty));
  bottomLevelOfField.appendChild(createFieldSize(difficulty, nonogramField)); //само поле
  container.appendChild(bottomLevelOfField);
}

function createLeftHintsField(difficulty) {
  const leftHintsArray = setVerticalHints(schemes[2]);
  return createHintsField(
    leftHintsArray,
    difficulty,
    "vertical",
    leftHintsField
  );
}
function createTopHintsField(difficulty) {
  const topHintsArray = setHorizontalHints(schemes[2]);
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

function initGame() {
  let gamepad = document.querySelector(".gamepad");
  if (!gamepad) {
    gamepad = document.createElement("div");
    gamepad.className = "gamepad";
    document.body.appendChild(gamepad);
  }
  createStartScreen(gamepad, "easy");
}

initGame();

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