import { Link } from "@swan-io/chicane";
import { useAppInfos } from "../../services/app";

import "./footer.css";
import { Router } from "../../config/router";

export function AppFooter() {
  const { data } = useAppInfos();
  return (
    <footer>
      <span>
        Made with ❤️ by <a href="https://github.com/kuroidoruido/easy-wiremock">Anthony PENA</a>
      </span>
      <span>
        {data?.name} - <Link to={Router.Changelogs()}>v{data?.version}</Link>
      </span>
    </footer>
  );
}
