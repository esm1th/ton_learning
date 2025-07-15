import { hex } from "../build/main.compile.json";
import {
  beginCell,
  contractAddress,
  Cell,
  StateInit,
  storeStateInit,
  toNano,
} from "@ton/ton";
import qs from "qs";
import qrcode from "qrcode-terminal";
import dotenv from "dotenv";

dotenv.config();

async function deployScript() {
  console.log("Deploying contract...");

  const isTestnet = process.env.TESTNET == "true";
  const codeCell = Cell.fromBoc(Buffer.from(hex, "hex"))[0];
  const dataCell = new Cell();

  const stateInit: StateInit = {
    code: codeCell,
    data: dataCell,
  };

  const stateInitBuilder = beginCell();
  const stateInitWriter = storeStateInit(stateInit)(stateInitBuilder);
  const stateInitCell = stateInitBuilder.endCell();

  const address = contractAddress(0, {
    code: codeCell,
    data: dataCell,
  });

  console.log(`Contract address: ${address.toString({ testOnly: isTestnet })}`);

  const tonkeeperDeploymentLink =
    "ton://transfer/" +
    address.toString({ testOnly: isTestnet }) +
    "?" +
    qs.stringify({
      text: "Deploy contract",
      amount: toNano(1).toString(10),
      init: stateInitCell.toBoc({ idx: false }).toString("base64"),
    });

  console.log(`Tonkeeper deployment link: ${tonkeeperDeploymentLink}`);

  qrcode.generate(tonkeeperDeploymentLink, { small: true }, (code) => {
    console.log(code);
  });
}

deployScript();
