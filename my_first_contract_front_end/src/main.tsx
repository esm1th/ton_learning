import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import {TonConnectUIProvider} from "@tonconnect/ui-react"

const manifestUrl = "https://esm1th.github.io/ton_learning/manifest.json"

createRoot(document.getElementById("root")!).render(
  <TonConnectUIProvider manifestUrl={manifestUrl}>
    <App />
  </TonConnectUIProvider>,
);
