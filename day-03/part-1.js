import { createReadStream } from "fs";
import path from "path";
import { createInterface } from "readline";
import { strict as assert } from "node:assert";
import { fileURLToPath } from "url";

function getScore(item) {
  if (item === item.toLowerCase()) return item.charCodeAt(0) - 96;
  return item.charCodeAt(0) - 38; // uppercase
}

assert.equal(getScore("p"), 16);
assert.equal(getScore("L"), 38);

async function solution(filename) {
  const lines = createInterface({
    input: createReadStream(filename),
  });

  let score = 0;

  for await (const line of lines) {
    const firstCompartmentItems = new Set(
      Array.from(line.slice(0, line.length / 2))
    );
    const secondCompartmentItems = new Set(
      Array.from(line.slice(line.length / 2))
    );

    const commonItem = [...firstCompartmentItems].find((x) =>
      secondCompartmentItems.has(x)
    );

    score += getScore(commonItem);
  }

  return score;
}

const currentDir = path.dirname(fileURLToPath(import.meta.url));

assert.equal(await solution(path.join(currentDir, "example.txt")), 157);
console.log(await solution(path.join(currentDir, "input.txt")));
