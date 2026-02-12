import { isDefined } from "@anthonypena/fp";
import { MethodTag } from "../../components/method-tag";
import { ObjectAsTable } from "../../components/object-as-table";
import { RawJson } from "../../components/raw-json";
import { useWiremockRequests } from "../../services/wiremock";
import { PropsWithServerId } from "../../utils/router";

import "./requests.css";
import { useState } from "react";

export function WiremockRequests({ serverId }: PropsWithServerId) {
  const { requests, deleteAllRequests } = useWiremockRequests(serverId);
  const [filters, setFilters] = useState({ method: "All" as string, status: "All" as "All" | number });
  const filteredRequests = (requests.data?.requests ?? []).filter((request) => {
    if (filters.method !== "All" && request.request.method !== filters.method) {
      return false;
    }
    if (filters.status !== "All" && request.response.status !== filters.status) {
      return false;
    }
    return true;
  });
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

  return (
    <>
      <div className="page-heading-row">
        <h2>Requests ({requests.data?.meta.total})</h2>
        <button type="button" className="danger" onClick={() => deleteAllRequests.mutate()}>
          🗑️ Delete all requests
        </button>
      </div>
      <section className="filters">
        <select onChange={(e) => setFilters({ ...filters, method: e.target.value })} value={filters.method}>
          <option value="All">All</option>
          {Object.entries(presentMethods).map(([method, count]) => (
            <option key={method} value={method}>
              {method} ({count})
            </option>
          ))}
        </select>
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
      <section className="requests">
        {filteredRequests.map((request) => (
          <details className="request-entry" key={request.id}>
            <summary>
              <span>
                <MethodTag method={request.request.method} /> {request.request.url ?? request.request.absoluteUrl}
              </span>
              <span>
                {request.wasMatched ? "✅ " : ""}
                {request.response.status}
              </span>
            </summary>
            <section>
              <h3>General Infos</h3>
              <ObjectAsTable
                json={{
                  id: request.id,
                  wasMatched: request.wasMatched,
                  ...(request.wasMatched ? { stubMappingId: request.stubMapping?.id } : []),
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
