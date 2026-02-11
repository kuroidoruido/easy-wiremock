import { DefaultLogFields, simpleGit } from "simple-git";
import fs from "node:fs";

console.log("Found tags: ", await simpleGit().tags());
const logs = await simpleGit().log();
console.log("Found logs: ", logs.total);

fs.writeFileSync("dist/CHANGELOG.md", formatChangeLog(buildLogsByTag(logs.all)));

function buildLogsByTag(logs: readonly DefaultLogFields[]): Record<string, DefaultLogFields[]> {
  const groups = logs.toReversed().reduce(
    (groups: Record<string, DefaultLogFields[]>, current: DefaultLogFields) => {
      groups["_"].push(current);
      const match = current.refs?.match(/tag: (v\d+\.\d+\.\d+)/);
      if (match != null) {
        const [, tag] = match;
        groups[tag] = groups["_"];
        groups["_"] = [];
      }
      return groups;
    },
    { _: [] },
  );
  delete groups["_"];
  return groups;
}

function formatChangeLog(logs: Record<string, DefaultLogFields[]>): string {
  const tagSections = Object.entries(logs)
    .toSorted(([a], [b]) => b.localeCompare(a))
    .map(([tag, logs]): string =>
      [`## ${tag}`, "", ...logs.filter((l) => !l.message.includes("release ")).map((l) => `- ${l.message}`), ""].join(
        "\n",
      ),
    );
  return ["# CHANGELOG", "", ...tagSections].join("\n");
}
