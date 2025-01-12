//sets of symbols for keyboard
export const easyLevelSet = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
export const mediumLevelSet = [
  "Q",
  "W",
  "E",
  "R",
  "T",
  "Y",
  "U",
  "I",
  "O",
  "P",
  "A",
  "S",
  "D",
  "F",
  "G",
  "H",
  "J",
  "K",
  "L",
  "Z",
  "X",
  "C",
  "V",
  "B",
  "N",
  "M",
];
export const hardLevelSet = easyLevelSet.concat(mediumLevelSet);

// creating of sequence
export function createSequence(difficultyLevel, round) {
  let setOfSymbols = [];
  if (difficultyLevel === "easy") {
    setOfSymbols = easyLevelSet;
  } else if (difficultyLevel === "medium") {
    setOfSymbols = mediumLevelSet;
  } else {
    setOfSymbols = hardLevelSet;
  }

  const sequence = [];
  const sequenceLength = 2 * round;

  for (let i = 0; i < sequenceLength; i++) {
    const index = Math.floor(Math.random() * setOfSymbols.length);
    sequence.push(setOfSymbols[index]);
  }

  console.log("Generated sequence:", sequence);
  return sequence;
}
