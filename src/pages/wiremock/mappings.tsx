import { PropsWithServerId } from "../../utils/router";

export function WiremockMappings({ serverId }: PropsWithServerId) {
  return (
    <>
      <h2>Mappings {serverId}</h2>
    </>
  );
}
