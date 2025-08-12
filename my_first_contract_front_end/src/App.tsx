import "./App.css";
import { useEffect } from "react";
import { TonConnectButton } from "@tonconnect/ui-react";
import { useMainContract } from "./hooks/useMainContract";
import { useTonConnect } from "./hooks/useTonConnect";
import { Spinner } from "./components/Spinner";

function App() {
  const contractAddress = "kQBDThipEH9RCl3Y-G6ReaUJFprWg6YpxVN2wcVOiLLt1w6z";

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
    fetchContractData,
    isLoading,
  } = useMainContract(contractAddress);

  const { connected } = useTonConnect();

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchContractData().catch((error: unknown) =>
        console.error("Failed to fetch contract data", error),
      );
    }, 5000);

    return () => clearInterval(intervalId);
  }, [contractAddress, fetchContractData]);

  return (
    <div>
      <div className="ton-connect-button-wrapper">
        <TonConnectButton />
      </div>

      <div>
        <div className="Card">
          <b>Our contract address</b>
          <div className="Hint">
            {isLoading ? <Spinner /> : contract_address?.slice(0, 30) + "..."}
          </div>
          <b>Recent sender</b>
          <div className="Hint">
            {isLoading ? (
              <Spinner />
            ) : (
              recent_sender?.toString().slice(0, 30) + "..."
            )}
          </div>
          <b>Owner address</b>
          <div className="Hint">
            {isLoading ? (
              <Spinner />
            ) : (
              owner_address?.toString().slice(0, 30) + "..."
            )}
          </div>
          <b>Our contract balance</b>
          <div className="Hint">{isLoading ? <Spinner /> : balance}</div>
        </div>

        <div className="Card">
          <b>Counter value</b>
          <div className="Hint">{isLoading ? <Spinner /> : counter_value}</div>
        </div>
        {connected && (
          <a
            onClick={() => {
              void sendIncrement();
            }}
          >
            Increment
          </a>
        )}
      </div>
    </div>
  );
}

export default App;
