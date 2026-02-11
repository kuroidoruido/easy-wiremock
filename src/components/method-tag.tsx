import { Method } from "../services/wiremock";

import "./method-tag.css";

export function MethodTag({ method }: { method: Method | undefined }) {
  return (
    <span className="method-tag-wrapper">
      <span className={"method-tag " + (method ?? "ANY")}>{method ?? "ANY"}</span>
    </span>
  );
}
