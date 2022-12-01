import { createReadStream } from "fs";
import path from "path";
import { createInterface } from "readline";
import { strict as assert } from "node:assert";
import { fileURLToPath } from "url";

async function solution(filename) {
  const fileStream = createReadStream(filename);

  const rl = createInterface({
    input: fileStream,
  });

  let maxCalories = 0;
  let currentCalories = 0;

  for await (const line of rl) {
    if (line == "") {
      if (currentCalories > maxCalories) maxCalories = currentCalories;

      currentCalories = 0;

      continue;
    }

    currentCalories += parseInt(line);
  }

  return maxCalories;
}

const currentDir = path.dirname(fileURLToPath(import.meta.url));

assert.equal(await solution(path.join(currentDir, "example.txt")), 24000);
console.log(await solution(path.join(currentDir, "input.txt")));
