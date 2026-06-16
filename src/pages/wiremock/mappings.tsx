import { isDefined } from "@anthonypena/fp";
import { MethodTag } from "../../components/method-tag";
import { ObjectAsTable } from "../../components/object-as-table";
import { RawJson } from "../../components/raw-json";
import { useWiremockMappings } from "../../services/wiremock";
import { PropsWithServerId } from "../../utils/router";

import "./mappings.css";
import { Tag } from "../../components/tag.tsx";

export function WiremockMappings({ serverId }: PropsWithServerId) {
  const { mappings, deleteOneMapping, deleteAllMappings } = useWiremockMappings(serverId);
  return (
    <>
      <div className="page-heading-row">
        <h2>Mappings ({mappings.data?.meta.total})</h2>
        <button type="button" className="danger" onClick={() => deleteAllMappings.mutate()}>
          🗑️ Delete all mappings
        </button>
      </div>
      <section className="mappings">
        {mappings.data?.mappings.map((mapping) => (
          <details className="mapping-entry" key={mapping.id}>
            <summary>
              <MethodTag method={mapping.request.method} />{" "}
              <span className="entry-url">
                {mapping.request.urlPathPattern ??
                  mapping.request.urlPattern ??
                  mapping.request.urlPath ??
                  mapping.request.url}
              </span>
              <Tag tag={String(mapping.matchedBy.length)} title={`${mapping.matchedBy.length} requests matched this stub`} />
            </summary>
            <section>
              <h3>Quick actions</h3>
              <button className="danger" onClick={() => deleteOneMapping.mutate(mapping.id)}>
                🗑️ Delete
              </button>
            </section>
            <section>
              <h3>General Infos</h3>
              <ObjectAsTable
                json={{
                  id: mapping.id,
                }}
              />
            </section>
            {isDefined(mapping.metadata) && (
              <section>
                <h3>Metadata</h3>
                <ObjectAsTable json={mapping.metadata} />
              </section>
            )}
            <section>
              <h3>Request</h3>
              <ObjectAsTable json={mapping.request} />
            </section>
            <section>
              <h3>Response</h3>
              <ObjectAsTable json={mapping.response} />
            </section>
            <RawJson label="Raw mapping" json={mapping} />
          </details>
        ))}
      </section>
      <RawJson label="Raw mappings" json={mappings.data} />
    </>
  );
}
