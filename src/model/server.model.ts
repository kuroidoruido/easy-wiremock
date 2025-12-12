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