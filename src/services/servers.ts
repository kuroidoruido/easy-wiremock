import { isDefinedAndNotEmpty } from "@anthonypena/fp";
import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

  function getOneServer(serverId: string): Server | undefined {
    return servers.data?.find(s => s.id === serverId) ?? undefined;
  }

  const pushOneServer = useLocalStorageMutation<Server, Server>(client, 
    LOCAL_STORAGE_SERVERS_KEY, 
    (newServer: Server) => (actual: Server[]) => {
      newServer.id = crypto.randomUUID();
      return [...actual, newServer];
    });

  const updateOneServer = useLocalStorageMutation<Server, Server>(client, 
    LOCAL_STORAGE_SERVERS_KEY, 
    (newServer: Server) => (actual: Server[]) => {
      return actual.map((server: Server) => server.id === newServer.id ? newServer : server );
    });

  const removeOneServer = useLocalStorageMutation<string, Server>(client, 
    LOCAL_STORAGE_SERVERS_KEY, 
    (serverId: string) => (actual: Server[]) => {
      return actual.filter(({ id }: Server) => id !== serverId);
    });

  return { servers, getOneServer, pushOneServer, updateOneServer, removeOneServer } as const;
}

export function useServer(serverId: string) {
  const { servers } = useServers();
  return servers.data?.find((s) => s.id === serverId);
}

function useLocalStorageMutation<Arg, T>(client: QueryClient, key: string, mutationFn: (arg: Arg) => (actual: T[]) => T[]) {
  return useMutation({
    mutationFn: (arg: Arg) =>
      new Promise((resolve, reject) => {
        const serversInLocalStorage = localStorage.getItem(key);
        try {
          if (isDefinedAndNotEmpty(serversInLocalStorage)) {
            const newState = JSON.stringify(mutationFn(arg)(JSON.parse(serversInLocalStorage)));
            localStorage.setItem(key, newState);
          } else {
            const newState = JSON.stringify(mutationFn(arg)([]));
            localStorage.setItem(key, newState);
          }
          resolve(null);
          client.invalidateQueries({ queryKey: buildQueryKey() });
        } catch {
          reject(null);
        }
      }),
  })
}