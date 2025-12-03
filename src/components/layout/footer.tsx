import { useAppInfos } from "../../services/app";

import './footer.css';

export function AppFooter() {
  const { data } = useAppInfos();
  return (
    <footer>
      <span>Made with ❤️ by <a href="https://github.com/kuroidoruido/easy-wiremock">Anthony PENA</a></span>
      <span>{data?.name} - v{data?.version}</span>
    </footer>
  );
}
