import "./object-as-table.css";

export function ObjectAsTable({ json }: { json: object | undefined }) {
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
  switch (typeof x) {
    case "boolean":
      return x ? "true" : "false";
    case "string":
      return x;
    default:
      return JSON.stringify(x);
  }
}
