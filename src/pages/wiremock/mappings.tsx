import { MethodTag } from "../../components/method-tag";
import { RawJson } from "../../components/raw-json";
import { useWiremockMappings } from "../../services/wiremock";
import { PropsWithServerId } from "../../utils/router";

import "./mappings.css";

export function WiremockMappings({ serverId }: PropsWithServerId) {
  const mappings = useWiremockMappings(serverId);
  return (
    <>
      <h2>Mappings ({mappings.data?.meta.total})</h2>
      <section className="mappings">
        {mappings.data?.mappings.map((mapping) => (
          <details className="mapping-entry" key={mapping.id}>
            <summary>
              <MethodTag method={mapping.request.method} />{" "}
              {mapping.request.urlPattern ?? mapping.request.url}
            </summary>
            <RawJson label="Raw mapping" json={mapping} />
          </details>
        ))}
      </section>
      <RawJson label="Raw mappings" json={mappings.data} />
    </>
  );
}
