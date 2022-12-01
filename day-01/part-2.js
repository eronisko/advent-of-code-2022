import { createReadStream } from "fs";
import path from "path";
import { createInterface } from "readline";
import { strict as assert } from "node:assert";
import { fileURLToPath } from "url";

function getTop3(totalElfCalories, currentTop3) {
  if (totalElfCalories > currentTop3[0]) {
    if (totalElfCalories > currentTop3[2]) {
      return [currentTop3[1], currentTop3[2], totalElfCalories];
    }

    if (totalElfCalories > currentTop3[1]) {
      return [currentTop3[1], totalElfCalories, currentTop3[2]];
    }

    return [totalElfCalories, currentTop3[1], currentTop3[2]];
  }

  return currentTop3;
}

async function solution(filename) {
  const fileStream = createReadStream(filename);

  const rl = createInterface({
    input: fileStream,
  });

  let top3 = [0, 0, 0];
  let currentCalories = 0;

  for await (const line of rl) {
    if (line == "") {
      top3 = getTop3(currentCalories, top3);
      currentCalories = 0;
      continue;
    }

    currentCalories += parseInt(line);
  }

  top3 = getTop3(currentCalories, top3);
  return top3[0] + top3[1] + top3[2];
}

const currentDir = path.dirname(fileURLToPath(import.meta.url));

assert.equal(await solution(path.join(currentDir, "example.txt")), 45000);
console.log(await solution(path.join(currentDir, "input.txt")));
