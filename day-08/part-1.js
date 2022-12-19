import { createReadStream } from "fs";
import path from "path";
import { createInterface } from "readline";
import { strict as assert } from "node:assert";
import { fileURLToPath } from "url";

async function solution(filename, stacks) {
  const lines = createInterface({
    input: createReadStream(filename),
  });

  let trees = [];
  let lineNumber = 0;

  for await (const line of lines) {
    trees[lineNumber] = line.split("").map((t) => parseInt(t));
    lineNumber++;
  }

  let observableTrees = new Set();

  let highestTree = null;

  for (const [rowIndex, row] of trees.entries()) {
    // Left to right
    highestTree = null;
    for (const [columnIndex, tree] of row.entries()) {
      if (highestTree === null || tree > highestTree) {
        highestTree = tree;
        observableTrees.add(`${rowIndex},${columnIndex}`);
      }
    }

    // Right to left
    highestTree = null;
    for (const [reversedColumnIndex, tree] of [...row].reverse().entries()) {
      let columnIndex = row.length - 1 - reversedColumnIndex;
      if (highestTree === null || tree > highestTree) {
        highestTree = tree;
        observableTrees.add(`${rowIndex},${columnIndex}`);
      }
    }
  }

  for (const columnIndex of trees[0].keys()) {
    // Top to bottom
    highestTree = null;
    for (const rowIndex of trees.keys()) {
      let tree = trees[rowIndex][columnIndex];

      if (highestTree === null || tree > highestTree) {
        highestTree = tree;
        observableTrees.add(`${rowIndex},${columnIndex}`);
      }
    }

    // Bottom to top
    highestTree = null;
    for (const reversedRowIndex of [...trees].reverse().keys()) {
      const rowIndex = trees.length - 1 - reversedRowIndex;
      let tree = trees[rowIndex][columnIndex];

      if (highestTree === null || tree > highestTree) {
        highestTree = tree;
        observableTrees.add(`${rowIndex},${columnIndex}`);
      }
    }
  }

  return observableTrees.size;
}

const currentDir = path.dirname(fileURLToPath(import.meta.url));

assert.equal(await solution(path.join(currentDir, "example.txt")), 21);
console.log(await solution(path.join(currentDir, "input.txt")));
