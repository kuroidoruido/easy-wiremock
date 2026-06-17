import { isDefined, isDefinedAndNotEmpty } from "@anthonypena/fp";
import { MethodTag } from "../../components/method-tag";
import { ObjectAsTable } from "../../components/object-as-table";
import { RawJson } from "../../components/raw-json";
import { Mapping, useWiremockMappings } from "../../services/wiremock";
import { PropsWithServerId } from "../../utils/router";
import { Tag } from "../../components/tag.tsx";
import { useState } from "react";
import { useLinkProps } from "@swan-io/chicane";
import { Router } from "../../config/router.tsx";

import "./mappings.css";

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

interface WiremockMappingsProps extends PropsWithServerId {
  mappingId?: string;
}

export function WiremockMappings({ serverId, mappingId }: WiremockMappingsProps) {
  const { mappings, deleteOneMapping, deleteAllMappings } = useWiremockMappings(serverId);
  const { onClick: reloadCurrentRouteWithoutFilters } = useLinkProps({ href: Router.WiremockRequests({ serverId }) });
  const [sortBy, setSortBy] = useState<SortType>("byDeclarationOrder");
  const [filters, setFilters] = useState({ id: mappingId, method: "All" as string, urlPath: "" });
  const filteredMappings = (mappings.data?.mappings ?? [])
    .filter((mapping) => {
      if (isDefinedAndNotEmpty(filters.id) && mapping.id !== filters.id) {
        return false;
      }
      if (filters.method !== "All" && mapping.request.method !== filters.method) {
        return false;
      }
      return mapping.request.displayUrlPath?.includes(filters.urlPath);
    })
    .toSorted(SORT[sortBy].comparator);
  const presentMethods =
    mappings.data?.mappings
      .map((request) => request.request.method)
      .filter(isDefined)
      .reduce((acc, method) => ({ ...acc, [method]: (acc[method] ?? 0) + 1 }), {} as Record<string, number>) ?? {};

  const onRemoveMapppingIdFilter = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    reloadCurrentRouteWithoutFilters(e);
    setFilters({ ...filters, id: undefined });
  };

  return (
    <>
      <div className="page-heading-row">
        <h2>Mappings ({mappings.data?.meta.total})</h2>
        <button type="button" className="danger" onClick={() => deleteAllMappings.mutate()}>
          🗑️ Delete all mappings
        </button>
      </div>
      <section className="sorts">
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
      <section className="filters">
        <select onChange={(e) => setFilters({ ...filters, method: e.target.value })} value={filters.method}>
          <option value="All">All</option>
          {Object.entries(presentMethods).map(([method, count]) => (
            <option key={method} value={method}>
              {method} ({count})
            </option>
          ))}
        </select>
        <input
          type="text"
          value={filters.urlPath}
          onChange={(e) => setFilters({ ...filters, urlPath: e.target.value })}
        />
      </section>
      {isDefinedAndNotEmpty(mappingId) && (
        <section className="filter">
          <Tag
            tag={`Only stub: ${mappingId}`}
            title="This mapping is filtered to show only this stub."
            onDismiss={onRemoveMapppingIdFilter}
          />
        </section>
      )}
      <section className="mappings">
        {filteredMappings.map((mapping) => (
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
              <div className="quick-actions">
                <button type="button" className="danger" onClick={() => deleteOneMapping.mutate(mapping.id)}>
                  🗑️ Delete
                </button>
                <ShowMatchedRequests serverId={serverId} stubId={mapping.id} />
              </div>
            </section>
            <section>
              <h3>General Infos</h3>
              <ObjectAsTable json={{ id: mapping.id }} />
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

interface ShowMatchedRequestsProps {
  serverId: string;
  stubId: string;
}

function ShowMatchedRequests({ serverId, stubId }: ShowMatchedRequestsProps) {
  const { onClick } = useLinkProps({ href: Router.WiremockRequests({ serverId, matchingStub: stubId }) });
  return (
    <button type="button" onClick={onClick}>
      Show matched requests
    </button>
  );
}
