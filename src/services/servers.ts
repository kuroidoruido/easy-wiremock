import { isDefinedAndNotEmpty } from "@anthonypena/fp";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface Server {
  id: string;
  label: string;
  url: string;
}

const LOCAL_STORAGE_SERVERS_KEY = "servers";

function buildQueryKey() {
  return ["servers"];
}

export function useServers() {
  const client = useQueryClient();
  const servers = useQuery({
    queryKey: buildQueryKey(),
    queryFn: () =>
      new Promise<Server[]>((resolve) => {
        const serversInLocalStorage = localStorage.getItem(
          LOCAL_STORAGE_SERVERS_KEY
        );
        if (isDefinedAndNotEmpty(serversInLocalStorage)) {
          resolve(JSON.parse(serversInLocalStorage) satisfies Server[]);
        } else {
          resolve([] satisfies Server[]);
        }
      }),
  });

  const pushOneServer = useMutation({
    mutationFn: (newServer: Server) =>
      new Promise((resolve, reject) => {
        const serversInLocalStorage = localStorage.getItem(
          LOCAL_STORAGE_SERVERS_KEY
        );
        try {
          newServer.id = crypto.randomUUID();
          if (isDefinedAndNotEmpty(serversInLocalStorage)) {
            localStorage.setItem(
              LOCAL_STORAGE_SERVERS_KEY,
              JSON.stringify([...JSON.parse(serversInLocalStorage), newServer])
            );
          } else {
            localStorage.setItem(
              LOCAL_STORAGE_SERVERS_KEY,
              JSON.stringify([newServer])
            );
          }
          resolve(null);
          client.invalidateQueries({ queryKey: buildQueryKey() });
        } catch {
          reject(null);
        }
      }),
  });
  return { servers, pushOneServer } as const;
}

export function useServer(serverId: string) {
  const { servers } = useServers();
  return servers.data?.find((s) => s.id === serverId);
}
