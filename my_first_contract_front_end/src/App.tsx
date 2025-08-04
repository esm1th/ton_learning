import "./App.css";
import { TonConnectButton } from "@tonconnect/ui-react";
import { useMainContract } from "./hooks/useMainContract";
import { useTonConnect } from "./hooks/useTonConnect";

function App() {
  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

  if (!contractAddress) {
    throw new Error("VITE_CONTRACT_ADDRESS environment variable is not set");
  }
  const {
    contract_address,
    counter_value,
    recent_sender,
    owner_address,
    balance,
    sendIncrement,
  } = useMainContract(contractAddress);
  const { connected } = useTonConnect();
  return (
    <div>
      <div>
        <TonConnectButton />
      </div>
      <div>
        <div className="Card">
          <b>Our contract address</b>
          <div className="Hint">{contract_address?.slice(0, 30) + "..."}</div>
          <b>Recent sender</b>
          <div className="Hint">{recent_sender?.toString().slice(0, 30) + "..."}</div>
          <b>Owner address</b>
          <div className="Hint">{owner_address?.toString().slice(0, 30) + "..."}</div>
          <b>Our contract balance</b>
          <div className="Hint">{balance}</div>
        </div>

        <div className="Card">
          <b>Counter value</b>
          <div className="Hint">{counter_value ?? "Loading..."}</div>
        </div>
        { connected && (
          <a onClick={() => { void sendIncrement() }}>Increment</a>
        )}
      </div>
    </div>
  );
}

export default App;
