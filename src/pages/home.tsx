import { ServerCard } from "../components/server-card";
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
  const { servers, removeOnServer } = useServers();
  return (
    <section>
      <h2>Choose your server</h2>
      {servers.data?.map((server) => 
        <ServerCard
          key={server.id}
          server={server}
          onRemove={(id) => removeOnServer.mutate(id)}
        />)}
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
