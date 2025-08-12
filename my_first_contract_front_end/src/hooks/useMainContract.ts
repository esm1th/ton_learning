import { useState } from "react";
import { useTonClient } from "./useTonClient";
import { useTonConnect } from "./useTonConnect";
import { MainContract } from "../contracts/MainContract";
import { Address, toNano, type OpenedContract } from "@ton/core";

interface MainContractData {
  contract_address: string;
  counter_value: number;
  recent_sender: Address;
  owner_address: Address;
  balance: number;
}

export function useMainContract(address: string) {
  const client = useTonClient();
  const { sender } = useTonConnect();

  const [mainContract, setMainContract] = useState<OpenedContract<MainContract> | null>(null);
  const [ contractData, setContractData ] = useState<MainContractData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchContractData = async () => {
    if (client) {
      setIsLoading(true);
      try {
        const parsedAddress = Address.parse(address);
        const contract = new MainContract(parsedAddress);
        
        console.log(`Fetching contract data ${parsedAddress.toString()} | ${address} ...`);
  
        const openedContract = client.open(contract);
        setMainContract(openedContract)
        
        const { number, recent_sender, owner_address } = await openedContract.getData();
        const { balance } = await openedContract.getBalance();
  
        setContractData({
          contract_address: openedContract.address.toString(),
          counter_value: number,
          recent_sender: recent_sender,
          owner_address: owner_address,
          balance: balance
        });
      } catch (error) {
        console.error("Failed to fetch contract data:", error);
      } finally {
        setIsLoading(false);
      }
    }
  }
  
  const sendIncrement = async () => {
    if (mainContract) {
      return mainContract.sendIncrement(sender, toNano("0.05"))
    }
  }
  
  return {
    ...contractData,
    fetchContractData,
    sendIncrement,
    isLoading,
  }
}
