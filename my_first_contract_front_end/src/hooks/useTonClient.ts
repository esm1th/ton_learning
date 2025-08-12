import { getHttpEndpoint } from "@orbs-network/ton-access";
import { TonClient } from "@ton/ton";
import { useAsyncInitialize } from "./useAsyncInitialize";

export function useTonClient(): TonClient | undefined {
  const client = useAsyncInitialize<TonClient | undefined>(async (): Promise<TonClient | undefined> => {
    try {
      const endpoint = await getHttpEndpoint({ network: "testnet" });
      return new TonClient({
        endpoint: endpoint,
      });
    } catch (err) {
      console.log(err);
      return undefined;
    }
  });
  return client;
}
