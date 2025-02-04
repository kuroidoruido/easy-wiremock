import "./App.css";
import { useAppInfos } from "./services/app";

export function App() {
  const { data } = useAppInfos();
  return (
    <>
      <header>
        <h1>Easy Wiremock</h1>
      </header>
      <main></main>
      <footer>
        {data?.name} - v{data?.version}
      </footer>
    </>
  );
}
