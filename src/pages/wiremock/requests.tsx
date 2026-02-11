import { isDefined } from "@anthonypena/fp";
import { MethodTag } from "../../components/method-tag";
import { ObjectAsTable } from "../../components/object-as-table";
import { RawJson } from "../../components/raw-json";
import { useWiremockRequests } from "../../services/wiremock";
import { PropsWithServerId } from "../../utils/router";

import "./requests.css";

export function WiremockRequests({ serverId }: PropsWithServerId) {
  const { requests, deleteAllRequests } = useWiremockRequests(serverId);
  return (
    <>
      <div className="page-heading-row">
        <h2>Requests ({requests.data?.meta.total})</h2>
        <button type="button" className="danger" onClick={() => deleteAllRequests.mutate()}>
          🗑️ Delete all requests
        </button>
      </div>
      <section className="requests">
        {requests.data?.requests.map((request) => (
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
