import { match } from "ts-pattern";
import { Router, useRoute, useServerId } from "../../config/router";
import { useServer } from "../../services/servers";
import { Link } from "@swan-io/chicane";

import "./header.css";
import { useChangelogs } from "../../services/changelogs";

export function AppHeader() {
  const route = useRoute();
  return match(route)
    .when(
      (r) => r?.name.startsWith("Wiremock"),
      () => <ServerSelectedHeader />
    )
    .otherwise(() => <NoServerSelectedHeader />);
}

function ServerSelectedHeader() {
  const serverId = useServerId();
  const server = useServer(serverId);
  return (
    <header>
      <nav>
        <ul>
          <li>
            <Link to={Router.Home()}>Easy Wiremock</Link>
          </li>
          <li>
            <Link to={Router.Wiremock({ serverId })}>
              <strong>{server?.label}</strong>
            </Link>
          </li>
        </ul>
        <ul>
          <li>
            <Link to={Router.WiremockMappings({ serverId })}>Mappings</Link>
          </li>
          <li>
            <Link to={Router.WiremockRequests({ serverId })}>Requests</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

function NoServerSelectedHeader() {
  const { newVersionReleasedFromLastVisit } = useChangelogs();
  return (
    <header>
      <nav>
        <ul>
          <li>
            <Link to={Router.Home()}>
              <strong>Easy Wiremock</strong>
            </Link>
          </li>
        </ul>
        <ul>
          {newVersionReleasedFromLastVisit && 
            <li><Link to={Router.Changelogs()}>✨ Check news from last visit</Link></li>}
        </ul>
      </nav>
    </header>
  );
}
