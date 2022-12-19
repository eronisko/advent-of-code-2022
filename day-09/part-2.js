import { createReadStream } from "fs";
import path from "path";
import { createInterface } from "readline";
import { strict as assert } from "node:assert";
import { fileURLToPath } from "url";

async function loadFromFile(filename) {
  const lines = createInterface({
    input: createReadStream(filename),
  });

  let instructions = [];
  for await (const line of lines) {
    let [direction, distance] = line.split(" ");
    instructions.push({ direction, distance: parseInt(distance) });
  }

  return instructions;
}

function catchUp(head, tail) {
  let { x, y } = tail;
  if (Math.abs(head.x - x) <= 1 && Math.abs(head.y - y) <= 1) {
    return tail;
  }

  if (head.x > x) x += 1;
  if (head.x < x) x -= 1;
  if (head.y > y) y += 1;
  if (head.y < y) y -= 1;

  return { x, y };
}

assert.deepEqual(catchUp({ x: 0, y: 0 }, { x: 0, y: 0 }), { x: 0, y: 0 });
assert.deepEqual(catchUp({ x: 1, y: 1 }, { x: 0, y: 0 }), { x: 0, y: 0 });
assert.deepEqual(catchUp({ x: 2, y: 0 }, { x: 0, y: 0 }), { x: 1, y: 0 });

function solution(instructions) {
  let head = { x: 0, y: 0 };
  let tails = Array(9).fill({ x: 0, y: 0 });

  const visited = new Set(["0,0"]);

  for (const { direction, distance } of instructions) {
    for (let _count = 0; _count < distance; _count++) {
      if (direction === "U") head.y += 1;
      if (direction === "D") head.y -= 1;
      if (direction === "R") head.x += 1;
      if (direction === "L") head.x -= 1;

      for (const tailIndex of tails.keys()) {
        let headPart = tailIndex > 0 ? tails[tailIndex - 1] : head;

        tails[tailIndex] = catchUp(headPart, tails[tailIndex]);
      }

      visited.add(`${tails[8].x},${tails[8].y}`);
    }
  }

  return visited.size;
}

const currentDir = path.dirname(fileURLToPath(import.meta.url));

const example = await loadFromFile(path.join(currentDir, "example2.txt"));
assert.equal(solution(example), 36);

const input = await loadFromFile(path.join(currentDir, "input.txt"));
console.log(solution(input));
