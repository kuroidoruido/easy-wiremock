export function RawJson({ label, json }: { label: string; json: unknown }) {
  return (
    <details>
      <summary>{label}</summary>
      <pre>{JSON.stringify(json, undefined, 2)}</pre>
    </details>
  );
}
