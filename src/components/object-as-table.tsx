import React from "react";
import "./object-as-table.css";

export function ObjectAsTable({
  json,
}: {
  json: object | Record<string, string | boolean | number | JSX.Element | unknown> | undefined;
}) {
  return (
    <table className="object-as-table">
      <tbody>
        {Object.entries(json ?? {}).map(([k, v]) => (
          <tr key={k}>
            <th>{k}</th>
            <td>{formatValue(v)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function formatValue(x: unknown) {
  if (React.isValidElement(x)) {
    return x;
  }
  switch (typeof x) {
    case "boolean":
      return x ? "true" : "false";
    case "string":
      return x;
    default:
      return JSON.stringify(x);
  }
}
