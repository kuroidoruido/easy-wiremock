import "./App.css";
import { AppFooter } from "./components/layout/footer";
import { AppHeader } from "./components/layout/header";
import { AppWarnings } from "./components/layout/warnings";
import { AppRouting } from "./config/router";

export function App() {
  return (
    <>
      <AppWarnings />
      <AppHeader />
      <AppRouting />
      <AppFooter />
    </>
  );
}
