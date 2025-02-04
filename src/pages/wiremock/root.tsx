import { useServer } from "../../services/servers";
import { useWiremockServerHealth } from "../../services/wiremock";
import { PropsWithServerId } from "../../utils/router";

export function WiremockServer({ serverId }: PropsWithServerId) {
  const server = useServer(serverId);
  const health = useWiremockServerHealth(serverId);
  return (
    <>
      <h2>{server?.label}</h2>
      <article>
        <header>Health</header>
        <main>
          <table>
            <tbody>
              {Object.entries(health.data ?? {}).map(([k, v]) => (
                <tr key={k}>
                  <th>{k}</th>
                  <td>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      </article>
    </>
  );
}
