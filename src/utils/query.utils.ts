import { isDefinedAndNotEmpty } from "@anthonypena/fp";
import { QueryClient, useMutation } from "@tanstack/react-query";

interface UseLocalStorageMutationOptions<T> {
  client: QueryClient;
  key: string;
  parseFn: (s: string) => T[];
  serializeFn: (state: T[]) => string;
  buildQueryKey: () => string[];
}

export function useLocalStorageCollectionMutation<T>({
  client,
  key,
  parseFn,
  serializeFn,
  buildQueryKey,
}: UseLocalStorageMutationOptions<T>) {
  return <Arg>(mutationFn: (arg: Arg) => (actual: T[]) => T[]) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useMutation({
      mutationFn: (arg: Arg) =>
        new Promise((resolve, reject) => {
          const localStorageState = localStorage.getItem(key);
          try {
            if (isDefinedAndNotEmpty(localStorageState)) {
              const newState = serializeFn(mutationFn(arg)(parseFn(localStorageState)));
              localStorage.setItem(key, newState);
            } else {
              const newState = serializeFn(mutationFn(arg)([]));
              localStorage.setItem(key, newState);
            }
            resolve(null);
            client.invalidateQueries({ queryKey: buildQueryKey() });
          } catch {
            reject(null);
          }
        }),
    });
  };
}

export function removeTrailingSlash(url: string | undefined): string | undefined {
  if (url?.endsWith("/")) {
    return url.slice(0, -1);
  } else {
    return url;
  }
}
