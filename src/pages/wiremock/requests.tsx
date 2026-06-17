import { isDefined, isDefinedAndNotEmpty } from "@anthonypena/fp";
import { MethodTag } from "../../components/method-tag";
import { ObjectAsTable } from "../../components/object-as-table";
import { RawJson } from "../../components/raw-json";
import { useWiremockRequests, WRequest } from "../../services/wiremock";
import "./requests.css";
import { Tag } from "../../components/tag.tsx";
import { Link, useLinkProps } from "@swan-io/chicane";
import { Router } from "../../config/router.tsx";
import { PropsWithServerId } from "../../utils/router";
import { useState } from "react";

type SortConfig = { label: string; comparator: (a: WRequest, b: WRequest) => number };
const SORT = {
  byDeclarationOrder: {
    label: "Default",
    comparator: (a, b) => a.index - b.index,
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
  byStatus: {
    label: "Status",
    comparator: (a, b) => {
      return a.response.status - b.response.status;
    },
  } satisfies SortConfig,
} as const;
type SortType = keyof typeof SORT;

interface WiremockRequests extends PropsWithServerId {
  matchingStub?: string;
}

export function WiremockRequests({ serverId, matchingStub }: WiremockRequests) {
  const { requests, deleteAllRequests } = useWiremockRequests(serverId);
  const { onClick: reloadCurrentRouteWithoutFilters } = useLinkProps({ href: Router.WiremockRequests({ serverId }) });
  const [sortBy, setSortBy] = useState<SortType>("byDeclarationOrder");
  const [filters, setFilters] = useState({
    matchingStub,
    method: "All" as string,
    urlPath: "",
    status: "All" as "All" | number,
  });
  const filteredRequests = (requests.data?.requests ?? [])
    .filter((request) => {
      if (isDefinedAndNotEmpty(filters.matchingStub) && request.stubMapping?.id !== filters.matchingStub) {
        return false;
      }
      if (filters.method !== "All" && request.request.method !== filters.method) {
        return false;
      }
      if (filters.status !== "All" && request.response.status !== filters.status) {
        return false;
      }
      return request.request.displayUrlPath?.includes(filters.urlPath);
    })
    .toSorted(SORT[sortBy].comparator);
  const presentMethods =
    requests.data?.requests
      .map((request) => request.request.method)
      .filter(isDefined)
      .reduce((acc, method) => ({ ...acc, [method]: (acc[method] ?? 0) + 1 }), {} as Record<string, number>) ?? {};
  const presentStatuses =
    requests.data?.requests
      .map((request) => request.response.status)
      .filter(isDefined)
      .reduce((acc, status) => ({ ...acc, [status]: (acc[status] ?? 0) + 1 }), {} as Record<number, number>) ?? {};

  const onRemoveMatchingStubFilter = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    reloadCurrentRouteWithoutFilters(e);
    setFilters({ ...filters, matchingStub: undefined });
  };

  return (
    <>
      <div className="page-heading-row">
        <h2>Requests ({requests.data?.meta.total})</h2>
        <button type="button" className="danger" onClick={() => deleteAllRequests.mutate()}>
          🗑️ Delete all requests
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
        <select
          onChange={(e) =>
            setFilters({ ...filters, status: e.target.value === "All" ? "All" : Number.parseInt(e.target.value, 10) })
          }
          value={filters.status}
        >
          <option value="All">All</option>
          {Object.entries(presentStatuses).map(([status, count]) => (
            <option key={status} value={status}>
              {status} ({count})
            </option>
          ))}
        </select>
      </section>
      {isDefinedAndNotEmpty(matchingStub) && (
        <section className="filter">
          <Tag
            tag={`Matching stub: ${matchingStub}`}
            title="This request list is filtered by this stub mapping"
            onDismiss={onRemoveMatchingStubFilter}
          />
        </section>
      )}
      <section className="requests">
        {filteredRequests.map((request) => (
          <details className="request-entry" key={request.id}>
            <summary>
              <span>
                <MethodTag method={request.request.method} /> {request.request.displayUrlPath}
              </span>
              <span>
                {request.response.statusEmoji} {request.response.status}
              </span>
            </summary>
            <section>
              <h3>General Infos</h3>
              <ObjectAsTable
                json={{
                  id: request.id,
                  wasMatched: request.wasMatched,
                  ...(request.wasMatched
                    ? {
                        stubMappingId: (
                          <Link to={Router.WiremockMappings({ serverId, mappingId: request.stubMapping!.id! })}>
                            {request.stubMapping?.id}
                          </Link>
                        ),
                      }
                    : []),
                }}
              />
            </section>
            <section>
              <h3>Request</h3>
              <section>
                <h4>Headers</h4>
                <ObjectAsTable json={request.request.headers} />
              </section>
              <section>
                <h4>Body</h4>
                <ObjectAsTable
                  json={{
                    body: request.request.body,
                    bodyAsBase64: request.request.bodyAsBase64,
                  }}
                />
              </section>
            </section>
            <section>
              <h3>Response</h3>
              {isDefined(request.response.headers) && (
                <section>
                  <h4>Headers</h4>
                  <ObjectAsTable json={request.response.headers} />
                </section>
              )}
              <section>
                <h4>Body</h4>
                <ObjectAsTable
                  json={{
                    body: request.response.body,
                    bodyAsBase64: request.response.bodyAsBase64,
                  }}
                />
              </section>
            </section>
            <RawJson label="Raw request" json={request} />
          </details>
        ))}
      </section>
      <RawJson label="Raw requests" json={requests.data} />
    </>
  );
}
