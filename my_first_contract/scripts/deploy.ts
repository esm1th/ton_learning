import {
  address,
  toNano,
} from "@ton/ton";
import { MainContract } from "../wrappers/MainContract";
import { compile, NetworkProvider } from "@ton/blueprint";

export async function run(provider: NetworkProvider) {
  const myContract = MainContract.createFromConfig(
    {
      number: 0,
      address: address("0QBQdE0Z-rASCXmRWi7ISN0We3guW0WuIbu40bpG_lx12nda"),
      owner_address: address("0QBQdE0Z-rASCXmRWi7ISN0We3guW0WuIbu40bpG_lx12nda"),
    },
    await compile("MainContract"),
  )
  
  const openedContract = provider.open(myContract);
  openedContract.sendDeploy(provider.sender(), toNano(0.05));
  await provider.waitForDeploy(myContract.address);
}
