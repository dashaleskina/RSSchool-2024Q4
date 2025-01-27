//imports
import { schemes } from "./schemes.js";
import { setSizeOfField, setSizeOfCell } from "./options.js";

//variables
const nonogramField = document.createElement("div");
nonogramField.className = "nonogramField";

function createStartScreen(container, difficulty) {
  container.appendChild(createFieldSize(difficulty, nonogramField));
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
  createStartScreen(gamepad, "hard");
}

initGame();
