import { createReadStream } from "fs";
import path from "path";
import { createInterface } from "readline";
import { strict as assert } from "node:assert";
import { fileURLToPath } from "url";

async function solution(filename) {
  const lines = createInterface({
    input: createReadStream(filename),
  });

  let overlapsCount = 0;

  for await (const line of lines) {
    const [rangeA, rangeB] = line
      .split(",")
      .map((range) => {
        const [start, end] = range
          .split("-")
          .map((boundary) => parseInt(boundary));
        return { start, end };
      })
      .sort((a, b) => a.start - b.start); // sort so that we can do just one comparison

    if (rangeA.end >= rangeB.start) {
      overlapsCount++;
      continue;
    }
  }

  return overlapsCount;
}

const currentDir = path.dirname(fileURLToPath(import.meta.url));

assert.equal(await solution(path.join(currentDir, "example.txt")), 4);
console.log(await solution(path.join(currentDir, "input.txt")));
