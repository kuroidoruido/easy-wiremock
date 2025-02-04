import { useQuery } from "@tanstack/react-query";
import { useServer } from "./servers";

function buildAdminReq(baseUrl: string | undefined, adminPath: string) {
  return `${baseUrl}/__admin/${adminPath}`;
}
function getAdminReq<T>(baseUrl: string | undefined, adminPath: string) {
  return fetch(buildAdminReq(baseUrl, adminPath)).then(
    (res): Promise<T> => res.json()
  );
}

export interface ServerHealth {
  status: string;
  message: string;
  version: string;
  uptimeInSeconds: number;
  timestamp: Date;
}

export function useWiremockServerHealth(serverId: string) {
  const server = useServer(serverId);
  return useQuery({
    queryKey: [server?.url, "admin", "health"],
    queryFn: () => getAdminReq<ServerHealth>(server?.url, "health"),
  });
}

export interface Mappings {
  meta: {
    total: number;
  };
  mappings: Mapping[];
}

export type Method =
  | "ANY"
  | "DELETE"
  | "GET"
  | "HEAD"
  | "OPTIONS"
  | "PATCH"
  | "POST"
  | "PUT";
type BodyPattern = unknown;

export interface Mapping {
  id: string;
  uuid: string;
  priority?: number;
  request: {
    method?: Method;
    url?: string;
    urlPattern?: string;
    headers?: Record<string, string>;
    bodyPatterns?: BodyPattern[];
  };
  response: {
    status: number;
    statusMessage?: string;
    jsonBody?: Record<string, unknown>;
    headers?: Record<string, string>;
    body?: string;
    bodyFileName?: string;
    base64Body?: string;
  };
}

export function useWiremockMappings(serverId: string) {
  const server = useServer(serverId);
  return useQuery({
    queryKey: [server?.url, "admin", "mappings"],
    queryFn: () => getAdminReq<Mappings>(server?.url, "mappings"),
  });
}
