import { createReadStream } from "fs";
import path from "path";
import { createInterface } from "readline";
import { strict as assert } from "node:assert";
import { fileURLToPath } from "url";

async function solution(filename) {
  const lines = createInterface({
    input: createReadStream(filename),
  });

  // A for Rock, B for Paper, and C for Scissors
  // X for Rock, Y for Paper, and Z for Scissors
  //
  // Scores
  // 1 for Rock, 2 for Paper, and 3 for Scissors
  // 0 if you lost, 3 if the round was a draw, and 6 if you won

  const scores = {
    "A X": 1 + 3,
    "A Y": 2 + 6,
    "A Z": 3 + 0,
    "B X": 1 + 0,
    "B Y": 2 + 3,
    "B Z": 3 + 6,
    "C X": 1 + 6,
    "C Y": 2 + 0,
    "C Z": 3 + 3,
  };

  let totalScore = 0;

  for await (const line of lines) {
    const roundScore = scores[line];
    if (typeof roundScore === "undefined")
      throw new Error("Unexpected line " + line);

    totalScore += roundScore;
  }

  return totalScore;
}

const currentDir = path.dirname(fileURLToPath(import.meta.url));

assert.equal(await solution(path.join(currentDir, "example.txt")), 15);
console.log(await solution(path.join(currentDir, "input.txt")));
