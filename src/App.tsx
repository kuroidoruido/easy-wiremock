import "./App.css";
import { AppFooter } from "./components/layout/footer";
import { AppHeader } from "./components/layout/header";
import { AppRouting } from "./config/router";

export function App() {
  return (
    <>
      <AppHeader />
      <AppRouting />
      <AppFooter />
    </>
  );
}
