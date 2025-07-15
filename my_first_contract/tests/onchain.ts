import { Cell, contractAddress, toNano, Address } from "@ton/core";
import { hex } from "../build/main.compile.json";
import { getHttpV4Endpoint } from "@orbs-network/ton-access";
import { TonClient4 } from "@ton/ton";
import qs from "qs";
import qrcode from "qrcode-terminal";
import dotenv from "dotenv";

dotenv.config();

async function onChainTest() {
  const isTestnet = process.env.TESTNET == "true";
  const codeCell = Cell.fromBoc(Buffer.from(hex, "hex"))[0];
  const dataCell = new Cell();

  const address = contractAddress(0, { code: codeCell, data: dataCell });
  const endpoint = await getHttpV4Endpoint({ network: isTestnet ? "testnet" : "mainnet"}); 
  const client = new TonClient4({ endpoint });

  const latestBlock = await client.getLastBlock();
  const status = await client.getAccount(latestBlock.last.seqno, address);

  if (status.account.state.type !== "active") {
    console.log("Contract is not active");
    return;
  }

  const tonkeeperTransferLink =
    "ton://transfer/" +
    address.toString({ testOnly: isTestnet }) +
    "?" +
    qs.stringify({
      text: "Simple test transaction",
      amount: toNano(1).toString(10),
    });

  console.log(`Tonkeeper transfer link: ${tonkeeperTransferLink}`);

  qrcode.generate(tonkeeperTransferLink, { small: true }, (code) => {
    console.log(code);
  });

  let recent_sender_archive: Address;
  setInterval(async () => {
    const latestBlock = await client.getLastBlock();
    const { exitCode, result } = await client.runMethod(
      latestBlock.last.seqno,
      address,
      "get_the_latest_sender",
    );
    if (exitCode !== 0) {
      console.log("Running run method failed");
      return;
    }
    if (result[0].type !== "slice") {
      console.log("Unknown result type");
      return;
    }
    const most_recent_sender = result[0].cell.beginParse().loadAddress();
    if (
      most_recent_sender &&
      most_recent_sender.toString() !== recent_sender_archive?.toString()
    ) {
      const most_recent_address_friendly = most_recent_sender.toString({ testOnly: isTestnet });
      const most_recent_address_raw = Address.parse(most_recent_address_friendly).toString({ urlSafe: false, bounceable: false, testOnly: isTestnet});
      console.log(
        `New sender: ${most_recent_address_friendly}, ${most_recent_address_raw}`,
      );
      recent_sender_archive = most_recent_sender;
    }
  }, 2000);
}

onChainTest();
