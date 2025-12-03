import { Router } from "../config/router";
import { Server } from "../services/servers";

import './server-card.css';

interface ServerCardProps {
    server: Server;
    onRemove(serverId: string): void;
}

export function ServerCard({ server, onRemove }: ServerCardProps) {
    const onActionClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    }
    return <article className="server-card"
              onClick={() => Router.push("Wiremock", { serverId: server.id })}>
        <main>
            <h3>{server.label}</h3>
            <p>{server.url}</p>
        </main>
        <footer>
            <button className="btn-dropdown" onClick={onActionClick}>
                ⠇
                <ul className="btn-dropdown-menu">
                    <li role="button" style={{ fontStyle: 'italic' }}>Edit (soon)</li>
                    <li role="button" onClick={() => onRemove(server.id)}>Remove</li>
                </ul>
            </button>
        </footer>
    </article>
}