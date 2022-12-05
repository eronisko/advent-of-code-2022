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
  // X means you need to lose, Y means you need to end the round in a draw, and Z means you need to win
  //
  // Scores
  // 1 for Rock, 2 for Paper, and 3 for Scissors
  // 0 if you lost, 3 if the round was a draw, and 6 if you won

  const scores = {
    "A X": 0 + 3, // lose   scissors
    "A Y": 3 + 1, // draw   rock
    "A Z": 6 + 2, // win    paper
    "B X": 0 + 1, // ...
    "B Y": 3 + 2,
    "B Z": 6 + 3,
    "C X": 0 + 2,
    "C Y": 3 + 3,
    "C Z": 6 + 1,
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

assert.equal(await solution(path.join(currentDir, "example.txt")), 12);
console.log(await solution(path.join(currentDir, "input.txt")));
