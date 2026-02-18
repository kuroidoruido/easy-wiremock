import { format, parseISO } from "date-fns";
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
    .toSorted(([a], [b]) => -semVerSort(a, b))
    .map(([tag, logs]): string =>
      [
        `## ${tag} (${formatTagDate(logs[logs.length - 1].date)})`,
        "",
        ...logs.filter((l) => l.message.match(/^release \d+\.\d+\.\d+$/) == null).map((l) => `- ${l.message}${addAuthorNotCreator(l)}`),
        "",
      ].join("\n"),
    );
  return ["# CHANGELOG", "", ...tagSections].join("\n");
}

function formatTagDate(date: string): string {
  return format(parseISO(date), "yyyy-MM-dd");
}

function addAuthorNotCreator(log: DefaultLogFields): string {
  if (log.author_email === "anthony.pena@outlook.fr") {
    return "";
  }
  return ` @${log.author_name}`;
}

function semVerSort(a: string, b: string): number {
  const [aMajor, aMinor, aPatch] = (a ?? '').split('.');
  const [bMajor, bMinor, bPatch] = (b ?? '').split('.');
  if (aMajor !== bMajor) {
    return Number.parseInt(aMajor, 10) - Number.parseInt(bMajor, 10)
  }
  if (aMinor !== bMinor) {
    return Number.parseInt(aMinor, 10) - Number.parseInt(bMinor, 10)
  }
  if (aPatch !== bPatch) {
    return Number.parseInt(aPatch, 10) - Number.parseInt(bPatch, 10)
  }
  return a.localeCompare(b);
}