import "./warnings.css";

export function AppWarnings() {
  return (
    <section>
      <OldDomainMessage />
    </section>
  );
}

function OldDomainMessage() {
  if (location.hostname.includes("easy-wiremock.kuroidoruido.deno.net")) {
    return <></>;
  }
  return (
    <article className="top-warning">
      From July, the 14th 2026, you should migrate to the new URL of Easy Wiremock{" "}
      <a href="https://easy-wiremock.kuroidoruido.deno.net">https://easy-wiremock.kuroidoruido.deno.net</a>.
    </article>
  );
}
