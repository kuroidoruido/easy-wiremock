import { useQuery } from "@tanstack/react-query";

export interface AppInfos {
  name: string;
  version: string;
}

export function useAppInfos() {
  return useQuery({
    queryKey: ["app-infos"],
    queryFn: () =>
      import("../../package.json").then(
        (packageJson): AppInfos => ({
          name: packageJson.name,
          version: packageJson.version,
        }),
      ),
  });
}
