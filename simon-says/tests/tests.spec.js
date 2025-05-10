import { test, expect } from "@playwright/test";
import {
  getVirtualKeys,
  getRandomIndices,
  waitForGeneratedSequence,
  waitForSequencePlayback,
} from "./test-utils.js";
import { mediumLevelSet, easyLevelSet, hardLevelSet } from "../script/utils.js";

test.beforeEach(async ({ page }) => {
  await page.goto("/dashaleskina-JSFE2024Q4/simon-says/");
});

test("ID.1.1 Проверка блокировки физической клавиатуры на стартовом экране", async ({
  page,
}) => {
  const keys = getVirtualKeys(page);
  const count = await keys.count();
  const indices = getRandomIndices(count);

  for (const index of indices) {
    const btn = keys.nth(index);
    const keyText = await btn.textContent();
    if (keyText) {
      await page.keyboard.press(keyText.trim());
      await expect(page.locator("#inputScreen")).toHaveValue("");
    }
  }
});

test("ID.1.2 Проверка блокировки виртуальной клавиатуры на стартовом экране", async ({
  page,
}) => {
  const keys = getVirtualKeys(page);
  const count = await keys.count();
  const indices = getRandomIndices(count);

  for (const index of indices) {
    const btn = keys.nth(index);
    await btn.click({ force: true });
    await expect(page.locator("#inputScreen")).toHaveValue("");
  }
});

test("ID.1.3 Проверка отображения символов при вводе с виртуальной клавиатуры", async ({
  page,
}) => {
  const sequencePromise = waitForGeneratedSequence(page);
  await page.getByRole("button", { name: "START" }).click();
  const sequence = await sequencePromise;

  await waitForSequencePlayback(page);

  for (const symbol of sequence) {
    await page.getByRole("button", { name: symbol }).click();
  }

  const inputScreen = page.locator("#inputScreen");
  await expect(inputScreen).toHaveValue(sequence.join(""));
});

test("ID.1.4 Проверка отображения символов при вводе с физической клавиатуры", async ({
  page,
}) => {
  const sequencePromise = waitForGeneratedSequence(page);
  await page.getByRole("button", { name: "START" }).click();
  const sequence = await sequencePromise;

  await waitForSequencePlayback(page);

  for (const symbol of sequence) {
    await page.keyboard.press(String(symbol));
  }

  const inputScreen = page.locator("#inputScreen");
  await expect(inputScreen).toHaveValue(sequence.join(""));
});

test("ID.1.5 Проверка регистронезависимого ввода с физической клавиатуры", async ({
  page,
}) => {
  const sequencePromise = waitForGeneratedSequence(page);
  await page.getByRole("button", { name: "START" }).click();
  const sequence = await sequencePromise;

  await waitForSequencePlayback(page);

  for (const symbol of sequence) {
    const lowerSymbol = String(symbol).toLowerCase();
    await page.keyboard.press(lowerSymbol);
  }

  const inputScreen = page.locator("#inputScreen");
  await expect(inputScreen).toHaveValue(sequence.join(""));
});

test("ID.1.7 Проверка игнорирования клавиш физической клавиатуры не входящих в выбранный уровень сложности (easy)", async ({
  page,
}) => {
  const unvalidKeys = mediumLevelSet;

  await page.getByRole("button", { name: "START" }).click();
  await waitForSequencePlayback(page);

  // Выбираем 3 клавиши из невалидных
  const randomKeys = [];
  while (randomKeys.length < 3) {
    const randomKey =
      unvalidKeys[Math.floor(Math.random() * unvalidKeys.length)];
    if (!randomKeys.includes(randomKey)) {
      randomKeys.push(randomKey);
    }
  }

  const inputScreen = page.locator("#inputScreen");

  for (const key of randomKeys) {
    await page.keyboard.press(key);
    await expect(inputScreen).toHaveValue("");
  }
});

test("ID.1.8 Проверка блокировки физической клавиатуры после успешного прохождения уровня", async ({
  page,
}) => {
  const sequencePromise = waitForGeneratedSequence(page);
  await page.getByRole("button", { name: "START" }).click();
  const sequence = await sequencePromise;

  await waitForSequencePlayback(page);

  for (const symbol of sequence) {
    await page.keyboard.press(String(symbol));
  }

  const inputScreen = page.locator("#inputScreen");
  const lockedValue = sequence.join("");
  await expect(inputScreen).toHaveValue(lockedValue);

  const keys = getVirtualKeys(page);
  const count = await keys.count();
  const indices = getRandomIndices(count);

  for (const index of indices) {
    const btn = keys.nth(index);
    const keyText = await btn.textContent();
    if (keyText) {
      await page.keyboard.press(keyText.trim());
      await expect(inputScreen).toHaveValue(lockedValue);
    }
  }
});

test("ID.1.9 Проверка блокировки виртуальной клавиатуры после успешного прохождения уровня", async ({
  page,
}) => {
  const sequencePromise = waitForGeneratedSequence(page);
  await page.getByRole("button", { name: "START" }).click();
  const sequence = await sequencePromise;

  await waitForSequencePlayback(page);

  for (const symbol of sequence) {
    await page.getByRole("button", { name: symbol }).click();
  }

  const inputScreen = page.locator("#inputScreen");
  const finalValue = sequence.join("");
  await expect(inputScreen).toHaveValue(finalValue);

  const lockedValue = await inputScreen.inputValue();

  const keys = getVirtualKeys(page);
  const count = await keys.count();
  const indices = getRandomIndices(count);

  for (const index of indices) {
    const btn = keys.nth(index);
    await btn.click({ force: true });
    await expect(inputScreen).toHaveValue(lockedValue);
  }
});

test("ID.1.10 Проверка блокировки физической клавиатуры после ошибочного ввода", async ({
  page,
}) => {
  const sequencePromise = waitForGeneratedSequence(page);
  await page.getByRole("button", { name: "START" }).click();
  const sequence = await sequencePromise;

  await waitForSequencePlayback(page);

  const partialSequence = sequence.slice(0, -1);
  for (const symbol of partialSequence) {
    await page.keyboard.press(String(symbol));
  }

  const inputScreen = page.locator("#inputScreen");

  //выбираем неверный символ и прожимаем его для получения ошибки
  const allKeys = hardLevelSet;
  const invalidKey = allKeys.find((k) => !sequence.includes(k));
  await page.keyboard.press(invalidKey);

  const valueAfterError = await inputScreen.inputValue();

  const testKeys = ["A", "Z", "1", "8"];
  for (const key of testKeys) {
    await page.keyboard.press(key);
    await expect(inputScreen).toHaveValue(valueAfterError);
  }
});

test("ID.1.11 Проверка блокировки виртуальной клавиатуры после ошибочного ввода", async ({
  page,
}) => {
  const sequencePromise = waitForGeneratedSequence(page);
  await page.getByRole("button", { name: "START" }).click();
  const sequence = await sequencePromise;

  await waitForSequencePlayback(page);

  const partialSequence = sequence.slice(0, -1);
  for (const symbol of partialSequence) {
    await page.getByRole("button", { name: symbol }).click();
  }

  const inputScreen = page.locator("#inputScreen");

  //выбираем неверный символ и прожимаем его для получения ошибки
  const allKeys = hardLevelSet;
  const invalidKey = allKeys.find((k) => !sequence.includes(k));
  await page.getByRole("button", { name: invalidKey }).click();

  const valueAfterError = await inputScreen.inputValue();

  const keys = getVirtualKeys(page);
  const count = await keys.count();
  const indices = getRandomIndices(count);

  for (const index of indices) {
    const key = keys.nth(index);
    await key.click({ force: true });
    await expect(inputScreen).toHaveValue(valueAfterError);
  }
});

test("ID.2.1 Проверка блокировки кнопок изменения уровня после нажатия кнопки Start", async ({
  page,
}) => {
  await page.getByRole("button", { name: "START" }).click();

  const level = await page.locator('.difficultyLevelsText').textContent();

  const difficultyButtons = await page.$$(".difficultyButton");

  for (let button of difficultyButtons) {
    await button.click({force: true});
  }

  const newLevel = await page.locator('.difficultyLevelsText').textContent();
  expect(level).toBe(newLevel);
});

test("ID.2.2 Проверка функционала сброса игры после нажатия кнопки New Game", async ({
  page,
}) => {
  await page.getByRole("button", { name: "START" }).click();
  await waitForSequencePlayback(page);
  await page.getByRole("button", { name:  "NEW GAME"}).click();
  await expect(page.getByRole("button", { name: "START" })).toHaveCount(1);
});

