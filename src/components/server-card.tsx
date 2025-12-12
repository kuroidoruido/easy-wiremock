import { Router } from "../config/router";
import { Server } from "../services/servers";

import './server-card.css';
import { renderTag, TagContainer } from "./tag";

interface ServerCardProps {
    server: Server;
    onEdit(serverId: string): void;
    onRemove(serverId: string): void;
}

export function ServerCard({ server, onEdit, onRemove }: ServerCardProps) {
    const onActionClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    }
    return <article className="server-card"
              onClick={() => Router.push("Wiremock", { serverId: server.id })}>
        <main>
            <h3>{server.label}</h3>
            <p>{server.url}</p>
            <TagContainer>{server.tags.map(renderTag)}</TagContainer>
        </main>
        <footer>
            <button className="btn-dropdown secondary" onClick={onActionClick}>
                ⠇
                <ul className="btn-dropdown-menu">
                    <li role="button" onClick={() => onEdit(server.id)}>Edit</li>
                    <li role="button" onClick={() => onRemove(server.id)}>Remove</li>
                </ul>
            </button>
        </footer>
    </article>
}