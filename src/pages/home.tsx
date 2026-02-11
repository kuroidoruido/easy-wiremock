import { useState } from "react";
import { ServerCard } from "../components/server-card";
import { Server, useServer, useServers } from "../services/servers";
import { useSubmitCallback } from "../utils/form";

import "./home.css";
import { isDefinedAndNotEmpty } from "@anthonypena/fp";

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
  const { serversByTag, removeOneServer } = useServers();
  const [editingServer, setEditingServer] = useState<string|null>(null);
  const isEditing = isDefinedAndNotEmpty(editingServer);
  return (
    <>
      <section className="server-list">
        <h2>Choose your server</h2>
        {serversByTag.map((group) =>
          <details className="tag-group" key={group.label} open>
            <summary>{group.label}</summary>
            <div className="server-list-container">
              {group.servers.map((server) => 
                <ServerCard
                key={server.id}
                server={server}
                onEdit={setEditingServer}
                onRemove={(id) => removeOneServer.mutate(id)}
              />)}
            </div>
          </details>
        )}
      </section>
      {isEditing && <EditServerModal serverId={editingServer} onClose={() => setEditingServer(null)} />}
    </>
  );
}

type ServerForm = Omit<Server, 'tags'> & { tags: string };

export function AddNewServer() {
  const { pushOneServer } = useServers();
  const onSubmit = useSubmitCallback<ServerForm>((formState) => {
    pushOneServer.mutate({ ...formState, tags: formState.tags.split(',').map(t => t.trim()) });
  });

  return (
    <article>
      <h2>Add a new server</h2>
      <form onSubmit={onSubmit}>
        <input type="text" name="url" placeholder="http://localhost:8080" />
        <input type="text" name="label" placeholder="My wiremock instance" />
          <input type="text" name="tags" placeholder="First tag, second tag" defaultValue="" />
        <button type="submit">Add a server</button>
      </form>
    </article>
  );
}

interface EditServerModalProps {
  serverId: string;
  onClose(): void;
}

export function EditServerModal({ serverId, onClose }: EditServerModalProps) {
  const { updateOneServer } = useServers();
  const server = useServer(serverId)!;
  const onSubmit = useSubmitCallback<ServerForm>((formState) => {
    updateOneServer.mutate({ ...formState, tags: formState.tags.split(',').map(t => t.trim()) });
    onClose();
  });
  return <dialog open>
        <article>
          <header>
            <button type="button" aria-label="Close" rel="prev" onClick={onClose}></button>
            <p>
              <strong>✏️ Edit {server.label}</strong>
            </p>
          </header>
          <form onSubmit={onSubmit}>
            <input type="hidden" name="id" defaultValue={server.id} />
            <input type="text" name="url" placeholder="http://localhost:8080" defaultValue={server.url} />
            <input type="text" name="label" placeholder="My wiremock instance" defaultValue={server.label} />
            <input type="text" name="tags" placeholder="First tag, second tag" defaultValue={server.tags.join(', ')} />
            <button type="submit">Update server</button>
          </form>
        </article>
    </dialog>
}