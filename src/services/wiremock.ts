import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServer } from "./servers";

function buildAdminReq(baseUrl: string | undefined, adminPath: string) {
  return `${baseUrl}/__admin/${adminPath}`;
}
function deleteAdminReq<T>(baseUrl: string | undefined, adminPath: string) {
  return fetch(buildAdminReq(baseUrl, adminPath), { method: "DELETE" }).then(
    (res): Promise<T> => res.json()
  );
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
  metadata?: Record<string, unknown>;
}

export function useWiremockMappings(serverId: string) {
  const server = useServer(serverId);
  const client = useQueryClient();
  const mappings = useQuery({
    queryKey: [server?.url, "admin", "mappings"],
    queryFn: () => getAdminReq<Mappings>(server?.url, "mappings"),
  });

  const deleteOneMapping = useMutation({
    mutationFn: (mappingId: string) =>
      deleteAdminReq(server?.url, `mappings/${mappingId}`).then(() => {
        client.invalidateQueries({
          queryKey: [server?.url, "admin", "mappings"],
        });
      }),
  });

  return { mappings, deleteOneMapping } as const;
}

export interface Requests {
  requests: WRequest[];
  meta: {
    total: number;
  };
  requestJournalDisabled: boolean;
}

export interface WRequest {
  id: string;
  request: {
    url: string;
    absoluteUrl: string;
    method: Method;
    clientIp: string;
    headers: Record<string, string>;
    cookies: Record<string, string>;
    browserProxyRequest: boolean;
    loggedDate: number;
    bodyAsBase64: string;
    body: string;
    loggedDateString: Date;
    protocol: string;
    scheme: string;
    host: string;
    port: number;
    queryParams: Record<string, string>;
    formParams: Record<string, string>;
  };
  responseDefinition: {
    status: number;
    jsonBody?: unknown;
    headers?: Record<string, string>;
    transformers: unknown[];
    fromConfiguredStub: boolean;
    transformerParameters: unknown;
  };
  response: {
    status: 200;
    headers: Record<string, string>;
    bodyAsBase64: string;
    body: string;
  };
  wasMatched: boolean;
  timing: {
    addedDelay: number;
    processTime: number;
    responseSendTime: number;
    serveTime: number;
    totalTime: number;
  };
  subEvents?: unknown[];
  stubMapping?: Mapping;
}

export function useWiremockRequests(serverId: string) {
  const server = useServer(serverId);
  return useQuery({
    queryKey: [server?.url, "admin", "requests"],
    queryFn: () => getAdminReq<Requests>(server?.url, "requests"),
  });
}
