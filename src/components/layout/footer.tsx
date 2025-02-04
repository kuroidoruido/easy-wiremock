import { useAppInfos } from "../../services/app";

export function AppFooter() {
  const { data } = useAppInfos();
  return (
    <footer>
      {data?.name} - v{data?.version}
    </footer>
  );
}
