import { useEffect, useState } from "react";
import { useTonClient } from "./useTonClient";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonConnect } from "./useTonConnect";
import { MainContract } from "../contracts/MainContract";
import { Address, toNano } from "@ton/core";

export function useMainContract(address: string) {
  const client = useTonClient();
  const { sender } = useTonConnect();
  const [ contractData, setContractData ] = useState<null | {
    counter_value: number;
    recent_sender: Address;
    owner_address: Address;
    balance: number;
  }>();

  const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time))

  const mainContract = useAsyncInitialize(() => {
    if (!client) return Promise.resolve(undefined);
    const contract = new MainContract(Address.parse(address));
    return Promise.resolve(client.open(contract));
  }, [client]);
  
  useEffect(() => {
    async function getValue() {
      if (!mainContract) return;
      setContractData(null);
      const { number, recent_sender, owner_address } = await mainContract.getData();
      const { balance } = await mainContract.getBalance();
      setContractData({ 
        counter_value: number,
        recent_sender: recent_sender,
        owner_address: owner_address,
        balance: balance
      });
      await sleep(5000);  // sleep 5 seconds and poll values again
      void getValue();
    }
    void getValue();
  }, [mainContract]);
  
  return {
    contract_address: mainContract?.address.toString(),
    ...contractData,
    sendIncrement: () => {
      return mainContract?.sendIncrement(sender, toNano("0.05"))
    }
  }
}
