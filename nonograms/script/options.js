//установка размера поля
export function setSizeOfField(difficulty) {
  return difficulty === "hard" ? 15 : difficulty === "medium" ? 10 : 5;
}

//установка размера ячейки
export function setSizeOfCell(difficulty) {
  let sizes = difficulty === "hard" ? 25 : difficulty === "medium" ? 35 : 50;
  return sizes;
}
