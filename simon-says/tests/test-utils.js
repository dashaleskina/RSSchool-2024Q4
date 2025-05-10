import { expect } from "@playwright/test";

//Массив клавиш с виртуальной клавиатуры
 export function getVirtualKeys(page) {
  return page.locator(".buttons button");
}

export function getRandomIndices(count, amount = 3) {
  const indices = new Set();
  while (indices.size < amount) {
    indices.add(Math.floor(Math.random() * count));
  }
  return Array.from(indices);
}

export async function waitForSequencePlayback(page) {
  await page.waitForFunction(() => {
    return Array.from(document.querySelectorAll(".buttons button")).every(
      (btn) => !btn.hasAttribute("disabled")
    );
  });
}

export function waitForGeneratedSequence(page) {
  return new Promise((resolve) => {
    page.on("console", (msg) => {
      const text = msg.text();
      if (text.startsWith("Generated sequence:")) {
        const match = text.match(/\[(.*?)\]/);
        if (match) {
          const parsed = JSON.parse(`[${match[1]}]`);
          resolve(parsed);
        }
      }
    });
  });
}

