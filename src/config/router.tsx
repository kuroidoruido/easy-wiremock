import { createRouter, createGroup, InferRoutes } from "@swan-io/chicane";
import { match } from "ts-pattern";
import { Home } from "../pages/home";
import { WiremockMappings } from "../pages/wiremock/mappings";
import { WiremockRequests } from "../pages/wiremock/requests";
import { NotFound } from "../pages/not-found";
import { WiremockServer } from "../pages/wiremock/root";
import { Changelogs } from "../pages/changelogs";

export const Router = createRouter({
  Home: "/",
  Changelogs: "/changelogs",
  Wiremock: "/wiremock/:serverId",
  ...createGroup("Wiremock", "wiremock/:serverId", {
    Mappings: "/mappings",
    Requests: "/requests",
  }),
});

export type Routes = InferRoutes<typeof Router>;
export type RouteName = keyof Routes;

export function AppRouting() {
  const route = useRoute();
  return (
    <main data-route={route?.name}>
      {match(route)
        .with({ name: "Home" }, () => <Home />)
        .with({ name: "Changelogs" }, () => <Changelogs />)
        .with({ name: "Wiremock" }, ({ params }) => (
          <WiremockServer {...params} />
        ))
        .with({ name: "WiremockMappings" }, ({ params }) => (
          <WiremockMappings {...params} />
        ))
        .with({ name: "WiremockRequests" }, ({ params }) => (
          <WiremockRequests {...params} />
        ))
        .otherwise(() => (
          <NotFound />
        ))}
    </main>
  );
}

export function useRoute() {
  return Router.useRoute([
    "Home",
    "Changelogs",
    "Wiremock",
    "WiremockMappings",
    "WiremockRequests",
  ]);
}

export function useServerRoute() {
  return Router.useRoute(["Wiremock", "WiremockMappings", "WiremockRequests"]);
}

export function useServerId() {
  const route = useServerRoute();
  return route!.params!.serverId!;
}
