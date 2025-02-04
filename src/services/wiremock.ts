import { useQuery } from "@tanstack/react-query";
import { useServer } from "./servers";

export interface ServerHealth {
  status: string;
  message: string;
  version: string;
  uptimeInSeconds: number;
  timestamp: Date;
}

function buildAdminReq(baseUrl: string | undefined, adminPath: string) {
  return `${baseUrl}/__admin/${adminPath}`;
}
function getAdminReq<T>(baseUrl: string | undefined, adminPath: string) {
  return fetch(buildAdminReq(baseUrl, adminPath)).then(
    (res): Promise<T> => res.json()
  );
}

export function useWiremockServerHealth(serverId: string) {
  const server = useServer(serverId);
  return useQuery({
    queryKey: [server?.url, "health"],
    queryFn: () => getAdminReq<ServerHealth>(server?.url, "health"),
  });
}
