import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import {TonConnectUIProvider} from "@tonconnect/ui-react"

const manifestUrl = "https://raw.githubusercontent.com/ESm1th/ton_learning/refs/heads/blueprint/my_first_contract_front_end/public/manifest.json"

createRoot(document.getElementById("root")!).render(
  <TonConnectUIProvider manifestUrl={manifestUrl}>
    <App />
  </TonConnectUIProvider>,
);
