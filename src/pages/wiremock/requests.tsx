import { PropsWithServerId } from "../../utils/router";

export function WiremockRequests({ serverId }: PropsWithServerId) {
  return (
    <>
      <h2>Requests {serverId}</h2>
    </>
  );
}
