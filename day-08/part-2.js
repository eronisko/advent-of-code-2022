import { createReadStream } from "fs";
import path from "path";
import { createInterface } from "readline";
import { strict as assert } from "node:assert";
import { fileURLToPath } from "url";

async function loadTreesFromFile(filename) {
  const lines = createInterface({
    input: createReadStream(filename),
  });

  let trees = [];
  let lineNumber = 0;

  for await (const line of lines) {
    trees[lineNumber] = line.split("").map((t) => parseInt(t));
    lineNumber++;
  }

  return trees;
}

function getScenicScore(trees, row, column) {
  if (
    row === 0 ||
    column === 0 ||
    row === trees.length - 1 ||
    column === trees[0].length - 1
  )
    return 0;

  let scenicScore = 1;
  const candidateTree = trees[row][column];

  const treesRight = trees[row].slice(column + 1, trees[row].length);
  const treesLeft = trees[row].slice(0, column).reverse();
  const treesDown = trees
    .map((treeRow) => treeRow[column])
    .slice(row + 1, trees[column].length);
  const treesUp = trees
    .map((treeRow) => treeRow[column])
    .slice(0, row)
    .reverse();

  for (trees of [treesRight, treesLeft, treesDown, treesUp]) {
    let visibleTreesCount = 0;
    for (const tree of trees) {
      visibleTreesCount += 1;

      if (tree >= candidateTree) {
        break;
      }
    }

    scenicScore = scenicScore * visibleTreesCount;
  }

  return scenicScore;
}

function solution(trees) {
  let maxScenicScore = 0;

  for (const row of trees.keys()) {
    for (const column of trees[row].keys()) {
      const scenicScore = getScenicScore(trees, row, column);
      if (scenicScore > maxScenicScore) {
        maxScenicScore = scenicScore;
      }
    }
  }

  return maxScenicScore;
}

const currentDir = path.dirname(fileURLToPath(import.meta.url));

const exampleTrees = await loadTreesFromFile(
  path.join(currentDir, "example.txt")
);
assert.equal(getScenicScore(exampleTrees, 1, 2), 4);
assert.equal(getScenicScore(exampleTrees, 3, 2), 8);
assert.equal(solution(exampleTrees), 8);

const trees = await loadTreesFromFile(path.join(currentDir, "input.txt"));
console.log(solution(trees));
