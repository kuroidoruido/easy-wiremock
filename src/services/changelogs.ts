import { isDefinedAndNotEmpty } from "@anthonypena/fp";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppInfos } from "./app";
import { useMemo } from "react";

const LOCAL_STORAGE_LAST_SEEN_KEY = "last-seen-version";

function buildLastSeenQueryKey() {
  return ["last-seen-version"];
}

function buildChangelogMdQueryKey() {
  return ["changelog.md"];
}

interface LastSeenVersion {
  lastSeenVersion: string;
}

export function useChangelogs() {
  const client = useQueryClient();
  const { data: appInfos } = useAppInfos();

  const lastSeenVersion = useQuery({
    queryKey: buildLastSeenQueryKey(),
    queryFn: () =>
      new Promise<LastSeenVersion>((resolve) => {
        const stateInLocalStorage = localStorage.getItem(LOCAL_STORAGE_LAST_SEEN_KEY);
        if (isDefinedAndNotEmpty(stateInLocalStorage)) {
          resolve(JSON.parse(stateInLocalStorage) satisfies LastSeenVersion);
        } else {
          resolve({ lastSeenVersion: "" } satisfies LastSeenVersion);
        }
      }),
  });
  const updateLastSeenVersion = useMutation({
    mutationFn: (lastSeenVersion: LastSeenVersion) =>
      new Promise((resolve, reject) => {
        try {
          localStorage.setItem(LOCAL_STORAGE_LAST_SEEN_KEY, JSON.stringify(lastSeenVersion));
          resolve(null);
          client.invalidateQueries({ queryKey: buildLastSeenQueryKey() });
        } catch {
          reject(null);
        }
      }),
  });

  const changelog = useQuery({
    queryKey: buildChangelogMdQueryKey(),
    queryFn: () =>
      fetch("/CHANGELOG.md")
        .then((r) => r.text())
        .then(parseChangelogMd),
  });

  const withSeen = useMemo(() => tagSeen(changelog.data, lastSeenVersion.data), [changelog.data, lastSeenVersion.data]);
  const newVersionReleasedFromLastVisit = useMemo(() => withSeen?.versions.some((v) => !v.seen), [withSeen]);

  const markLastVersionAsSeen = () => updateLastSeenVersion.mutate({ lastSeenVersion: appInfos?.version ?? "" });

  return { lastSeenVersion, markLastVersionAsSeen, changelog: withSeen, newVersionReleasedFromLastVisit };
}

interface Changelog {
  versions: ChangelogVersion[];
}

interface ChangelogVersion {
  version: string;
  changes: VersionChange[];
  seen: boolean;
}

interface VersionChange {
  message: string;
}

function parseChangelogMd(md: string): Changelog {
  const versions: ChangelogVersion[] = [];
  const rows = md.split("\n").slice(2);

  let currentVersion: ChangelogVersion | undefined = undefined;
  for (const row of rows) {
    if (row.startsWith("##")) {
      if (currentVersion !== undefined) {
        versions.push(currentVersion);
      }
      currentVersion = { version: row.slice(2).trim().slice(1), changes: [], seen: false };
    } else if (row.startsWith("- ")) {
      currentVersion?.changes.push({ message: row.slice(2) });
    }
  }
  if (currentVersion !== undefined) {
    versions.push(currentVersion);
  }

  return { versions };
}

function tagSeen(
  changelog: Changelog | undefined,
  lastSeenVersion: LastSeenVersion | undefined,
): Changelog | undefined {
  let areSeen = false;
  const versions: ChangelogVersion[] = [];
  for (const version of changelog?.versions ?? []) {
    if (version.version === lastSeenVersion?.lastSeenVersion) {
      areSeen = true;
    }
    versions.push({ ...version, seen: areSeen });
  }
  return { ...changelog, versions };
}
