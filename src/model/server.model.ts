import { isNotDefined } from "@anthonypena/fp";

export interface Server {
    id: string;
    label: string;
    url: string;
    tags: string[];
}

export function migrateModel(servers: Server[]): Server[] {
    return servers.map(s => ({ ...{ tags: [] }, ...s }));
}

export function parseServers(s: string): Server[] {
    return migrateModel(JSON.parse(s));
}

export function serializeServers(s: Server[]): string {
    return JSON.stringify(s);
}

export function sortServerByLabel() {
    return (a: Server, b: Server) => a.label.localeCompare(b.label);
}

export function serverAsTagToServer(s: Server) {
    return s.tags.map((t): [string, Server] => [t, s]).concat([['all', s]]);
}

export interface ServerGroup {
    label: string;
    servers: Server[];
}

export function groupByTags(groups: ServerGroup[], [tag, server]: [string, Server]): ServerGroup[] {
    let group = groups.find(g => g.label === tag);
    if (isNotDefined(group)) {
        group = { label: tag, servers: [] };
        groups.push(group);

    }
    group.servers.push(server);
    return groups;
}

export function sortGroupByLabel({ ensureLast = [] }: {ensureLast?: string[]} = {}) {
    return (a: ServerGroup, b: ServerGroup) => {
        const aLast = ensureLast.findIndex(g => g === a.label);
        const bLast = ensureLast.findIndex(g => g === b.label);
        if (aLast != bLast) {
            return aLast - bLast;
        }
        return a.label.localeCompare(b.label);
    }
}