import { schemes } from "./schemes.js";
//установка размера поля
export function setSizeOfField(difficulty) {
  return difficulty === "hard" ? 15 : difficulty === "medium" ? 10 : 5;
}

//установка размера ячейки
export function setSizeOfCell(difficulty) {
  let sizes = difficulty === "hard" ? 25 : difficulty === "medium" ? 35 : 50;
  return sizes;
}

//считаем разметку вертикальных подсказок
export function setVerticalHints(schema) {
  let repeatArrays = [];
  for (let i = 0; i < schema.length; i++) {
    let repeatLine = [];
    let repeatArrow = 0;
    for (let j = 0; j < schema[i].length; j++) {
      if (schema[i][j] === 0) {
        if (repeatArrow !== 0) {
          repeatLine.push(repeatArrow);
          repeatArrow = 0;
        }
      } else {
        repeatArrow++;
      }
    }

    if (repeatArrow !== 0) {
      repeatLine.push(repeatArrow);
    }
    repeatArrays.push(repeatLine.reverse());
  }
  return repeatArrays;
}

export function setHorizontalHints(schema) {
  let repeatArrays = [];
  for (let i = 0; i < schema.length; i++) {
    let repeatLine = [];
    let repeatArrow = 0;
    for (let j = 0; j < schema[i].length; j++) {
      if (schema[j][i] === 0) {
        if (repeatArrow !== 0) {
          repeatLine.push(repeatArrow);
          repeatArrow = 0;
        }
      } else {
        repeatArrow++;
      }
    }

    if (repeatArrow !== 0) {
      repeatLine.push(repeatArrow);
    }
    repeatArrays.push(repeatLine.reverse());
  }
  return repeatArrays;
}

export function setCountOfBlocksInHintsField(difficulty) {
  return difficulty === "hard" ? 8 : difficulty === "medium" ? 5 : 3;
}
