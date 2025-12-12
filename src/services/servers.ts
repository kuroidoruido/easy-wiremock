import { isDefinedAndNotEmpty } from "@anthonypena/fp";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { groupByTags, parseServers, serializeServers, Server, serverAsTagToServer, sortGroupByLabel, sortServerByLabel } from "../model/server.model";
import { useLocalStorageCollectionMutation } from "../utils/query.utils";

export type { Server } from '../model/server.model'

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
          resolve(parseServers(serversInLocalStorage) satisfies Server[]);
        } else {
          resolve([] satisfies Server[]);
        }
      }),
  });

  function getOneServer(serverId: string): Server | undefined {
    return servers.data?.find(s => s.id === serverId) ?? undefined;
  }

  const useServersMutation = useLocalStorageCollectionMutation<Server>({
    client, 
    key: LOCAL_STORAGE_SERVERS_KEY, 
    parseFn: parseServers,
    serializeFn: serializeServers,
    buildQueryKey
  });

  const pushOneServer = useServersMutation(
    (newServer: Server) => (actual: Server[]) => {
      newServer.id = crypto.randomUUID();
      return [...actual, newServer].toSorted(sortServerByLabel());
    });

  const updateOneServer = useServersMutation(
    (newServer: Server) => (actual: Server[]) => {
      return actual.map((server: Server) => server.id === newServer.id ? newServer : server );
    });

  const removeOneServer = useServersMutation(
    (serverId: string) => (actual: Server[]) => {
      return actual.filter(({ id }: Server) => id !== serverId);
    });

  return { servers, getOneServer, pushOneServer, updateOneServer, removeOneServer } as const;
}

export function useServer(serverId: string) {
  return useServers().getOneServer(serverId);
}

