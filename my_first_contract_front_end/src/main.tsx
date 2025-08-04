import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import {TonConnectUIProvider} from "@tonconnect/ui-react"

const manifestUrl = "https://esm1th.github.jo/ton_learning/my_first_contract_frontend/manifest.json"

createRoot(document.getElementById("root")!).render(
  <TonConnectUIProvider manifestUrl={manifestUrl}>
    <App />
  </TonConnectUIProvider>,
);
