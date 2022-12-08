import { createReadStream } from "fs";
import path from "path";
import { createInterface } from "readline";
import { strict as assert } from "node:assert";
import { fileURLToPath } from "url";

async function solution(filename, stacks) {
  const lines = createInterface({
    input: createReadStream(filename),
  });

  let entries = [];
  let cwd = [];

  for await (const line of lines) {
    if (line === "$ cd ..") {
      cwd.pop();
      continue;
    }

    if (line === "$ cd /") {
      cwd = ["/"];
      continue;
    }

    if (line.startsWith("$ cd")) {
      const [_, __, directory] = line.split(" ");
      cwd.push(directory);
      continue;
    }

    if (line.startsWith("$")) {
      // ignore other commands
      continue;
    }

    if (line.startsWith("dir")) {
      const [_, name] = line.split(" ");
      entries.push({ path: [...cwd, name].join("/"), type: "directory" });
      continue;
    }

    const [size, name] = line.split(" ");
    entries.push({
      path: [...cwd, name].join("/"),
      type: "file",
      size: parseInt(size),
    });
  }

  const directoriesWithSizeAtMost100k = entries
    .filter(({ type }) => type === "directory")
    .map((directory) => {
      const files = entries.filter(
        ({ type, path }) => type === "file" && path.startsWith(directory.path)
      );

      let totalSize = 0;

      for (const file of files) {
        totalSize += file.size;
      }

      return { ...directory, totalSize };
    })
    .filter(({ totalSize }) => totalSize <= 100000);

  let resultSize = 0;
  for (const directory of directoriesWithSizeAtMost100k) {
    resultSize += directory.totalSize;
  }

  return resultSize;
}

const currentDir = path.dirname(fileURLToPath(import.meta.url));

assert.equal(await solution(path.join(currentDir, "example.txt")), 95437);
console.log(await solution(path.join(currentDir, "input.txt")));
