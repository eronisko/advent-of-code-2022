import { createReadStream } from "fs";
import path from "path";
import { createInterface } from "readline";
import { strict as assert } from "node:assert";
import { fileURLToPath } from "url";

function getScore(item) {
  if (item === item.toLowerCase()) return item.charCodeAt(0) - 96;
  return item.charCodeAt(0) - 38; // uppercase
}

async function solution(filename) {
  const lines = createInterface({
    input: createReadStream(filename),
  });

  let score = 0;
  let lineIndex = 0;
  let groupCounts;

  for await (const line of lines) {
    if (lineIndex % 3 === 0) {
      groupCounts = {};
    }

    const uniqueItems = Array.from(new Set(Array.from(line)));
    uniqueItems.forEach((item) => {
      groupCounts[item] ? (groupCounts[item] += 1) : (groupCounts[item] = 1);
    });

    if (lineIndex % 3 === 2) {
      const badgeItem = Object.entries(groupCounts).find(
        ([item, count]) => count === 3
      )[0];

      score += getScore(badgeItem);
    }

    lineIndex++;
  }

  return score;
}

const currentDir = path.dirname(fileURLToPath(import.meta.url));

assert.equal(await solution(path.join(currentDir, "example.txt")), 70);
console.log(await solution(path.join(currentDir, "input.txt")));
