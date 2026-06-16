import { isDefined } from "@anthonypena/fp";
import { MethodTag } from "../../components/method-tag";
import { ObjectAsTable } from "../../components/object-as-table";
import { RawJson } from "../../components/raw-json";
import { Mapping, useWiremockMappings } from "../../services/wiremock";
import { PropsWithServerId } from "../../utils/router";

import "./mappings.css";
import { Tag } from "../../components/tag.tsx";
import { useState } from "react";

type SortConfig = { label: string; comparator: (a: Mapping, b: Mapping) => number };
const SORT = {
  byDeclarationOrder: {
    label: "Default",
    comparator: (a, b) => a.index - b.index,
  } satisfies SortConfig,
  byRequestMatchedCount: {
    label: "Requests matched count",
    comparator: (a, b) => b.matchedBy.length - a.matchedBy.length,
  } satisfies SortConfig,
  byPath: {
    label: "URL Path",
    comparator: (a, b) => {
      if (a.request.displayUrlPath !== b.request.displayUrlPath) {
        return (a.request.displayUrlPath ?? "").localeCompare(b.request.displayUrlPath ?? "");
      }
      return (a.request.method ?? "").localeCompare(b.request.method ?? "");
    },
  } satisfies SortConfig,
  byMethod: {
    label: "Method",
    comparator: (a, b) => {
      if (a.request.method !== b.request.method) {
        return (a.request.method ?? "").localeCompare(b.request.method ?? "");
      }
      return (a.request.displayUrlPath ?? "").localeCompare(b.request.displayUrlPath ?? "");
    },
  } satisfies SortConfig,
} as const;
type SortType = keyof typeof SORT;

export function WiremockMappings({ serverId }: PropsWithServerId) {
  const { mappings, deleteOneMapping, deleteAllMappings } = useWiremockMappings(serverId);
  const [sortBy, setSortBy] = useState<SortType>("byDeclarationOrder");
  return (
    <>
      <div className="page-heading-row">
        <h2>Mappings ({mappings.data?.meta.total})</h2>
        <button type="button" className="danger" onClick={() => deleteAllMappings.mutate()}>
          🗑️ Delete all mappings
        </button>
      </div>
      <section className="filters">
        <label>
          Sort by:{" "}
          <select onChange={(e) => setSortBy(e.target.value as SortType)} value={sortBy}>
            {Object.entries(SORT).map(([key, { label }]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </section>
      <section className="mappings">
        {mappings.data?.mappings.toSorted(SORT[sortBy].comparator).map((mapping) => (
          <details className="mapping-entry" key={mapping.id}>
            <summary>
              <MethodTag method={mapping.request.method} />{" "}
              <span className="entry-url">{mapping.request.displayUrlPath}</span>
              <Tag
                tag={String(mapping.matchedBy.length)}
                title={`${mapping.matchedBy.length} requests matched this stub`}
              />
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
