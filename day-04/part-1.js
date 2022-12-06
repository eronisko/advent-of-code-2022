import { createReadStream } from "fs";
import path from "path";
import { createInterface } from "readline";
import { strict as assert } from "node:assert";
import { fileURLToPath } from "url";

async function solution(filename) {
  const lines = createInterface({
    input: createReadStream(filename),
  });

  let fullOverlapsCount = 0;

  for await (const line of lines) {
    const [firstRange, secondRange] = line.split(",").map((range) => {
      const [start, end] = range
        .split("-")
        .map((boundary) => parseInt(boundary));
      return { start, end };
    });

    if (
      (firstRange.start <= secondRange.start &&
        firstRange.end >= secondRange.end) ||
      (secondRange.start <= firstRange.start &&
        secondRange.end >= firstRange.end)
    ) {
      fullOverlapsCount++;
    }
  }

  return fullOverlapsCount;
}

const currentDir = path.dirname(fileURLToPath(import.meta.url));

assert.equal(await solution(path.join(currentDir, "example.txt")), 2);
console.log(await solution(path.join(currentDir, "input.txt")));
