import { useChangelogs } from "../services/changelogs";

export function Changelogs() {
    const { changelog, markLastVersionAsSeen } = useChangelogs();

    return (
        <>
            <h1>Changelogs</h1>
            <section className="container" style={{ textAlign: 'right', marginBottom: '3rem' }}>
                <button type="button" onClick={markLastVersionAsSeen}>🗸 Mark as seen</button>
            </section>
            <section className="container">
                {changelog?.versions.map(version =>
                    <details key={version.version} open={!version.seen}>
                        <summary>{version.version}</summary>
                        <ul>
                            {version.changes.map((change, index) => <li key={index}>{change.message}</li>)}
                        </ul>
                    </details>
                )}
            </section>
        </>
    );
}
