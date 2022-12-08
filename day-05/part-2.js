import { createReadStream } from "fs";
import path from "path";
import { createInterface } from "readline";
import { strict as assert } from "node:assert";
import { fileURLToPath } from "url";

async function solution(filename, stacks) {
  const lines = createInterface({
    input: createReadStream(filename),
  });

  let instructionsReached = false;

  for await (const line of lines) {
    if (line === "") {
      instructionsReached = true;
      continue;
    }
    if (!instructionsReached) continue;

    const [_, howMany, __, from, ___, to] = line
      .split(" ")
      .map((part) => parseInt(part));

    stacks[to - 1] = [...stacks[to - 1], ...stacks[from - 1].slice(-howMany)];
    stacks[from - 1] = stacks[from - 1].slice(
      0,
      stacks[from - 1].length - howMany
    );
  }

  return stacks.map((stack) => stack[stack.length - 1]).join("");
}

const currentDir = path.dirname(fileURLToPath(import.meta.url));

assert.equal(
  await solution(path.join(currentDir, "example.txt"), [
    Array.from("ZN"),
    Array.from("MCD"),
    Array.from("P"),
  ]),
  "MCD"
);
console.log(
  await solution(path.join(currentDir, "input.txt"), [
    Array.from("RPCDBG"),
    Array.from("HVG"),
    Array.from("NSQDJPM"),
    Array.from("PSLGDCNM"),
    Array.from("JBNCPFLS"),
    Array.from("QBDZVGTS"),
    Array.from("BZMHFTQ"),
    Array.from("CMDBF"),
    Array.from("FCQG"),
  ])
);
