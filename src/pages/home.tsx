import { Router } from "../config/router";
import { Server, useServers } from "../services/servers";
import { useSubmitCallback } from "../utils/form";

import "./home.css";

export function Home() {
  return (
    <>
      <ServerList />
      <p>or </p>
      <AddNewServer />
    </>
  );
}

function ServerList() {
  const { servers } = useServers();
  return (
    <section>
      <h2>Choose your server</h2>
      {servers.data?.map((server) => (
        <article
          className="server-card"
          key={server.id}
          onClick={() => Router.push("Wiremock", { serverId: server.id })}
        >
          <main>
            <h3>{server.label}</h3>
            <p>{server.url}</p>
          </main>
        </article>
      ))}
    </section>
  );
}

export function AddNewServer() {
  const { pushOneServer } = useServers();
  const onSubmit = useSubmitCallback<Server>((formState) => {
    pushOneServer.mutate(formState);
  });

  return (
    <article>
      <h2>Add a new server</h2>
      <form onSubmit={onSubmit}>
        <input type="text" name="url" placeholder="http://localhost:8080" />
        <input type="text" name="label" placeholder="My wiremock instance" />
        <button>Add a server</button>
      </form>
    </article>
  );
}
