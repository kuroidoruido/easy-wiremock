import { MethodTag } from "../../components/method-tag";
import { RawJson } from "../../components/raw-json";
import { useWiremockRequests } from "../../services/wiremock";
import { PropsWithServerId } from "../../utils/router";

import "./requests.css";

export function WiremockRequests({ serverId }: PropsWithServerId) {
  const requests = useWiremockRequests(serverId);
  return (
    <>
      <h2>Requests ({requests.data?.meta.total})</h2>
      <section className="requests">
        {requests.data?.requests.map((request) => (
          <details className="request-entry" key={request.id}>
            <summary>
              <MethodTag method={request.request.method} />{" "}
              {request.request.url ?? request.request.absoluteUrl}
            </summary>
            <RawJson label="Raw request" json={request} />
          </details>
        ))}
      </section>
      <RawJson label="Raw requests" json={requests.data} />
    </>
  );
}
