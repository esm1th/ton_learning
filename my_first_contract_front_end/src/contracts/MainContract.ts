import {
  Address,
  beginCell,
  Cell,
  type Contract,
  contractAddress,
  type ContractProvider,
  type Sender,
  SendMode,
} from "@ton/core";

export const contractTestnetAddress = "kQBQdE0Z-rASCXmRWi7ISN0We3guW0WuIbu40bpG_lx12iqf";

export interface MainContractConfig {
  number: number;
  address: Address;
  owner_address: Address;
};

export function mainContractConfigToCell(config: MainContractConfig) {
  return beginCell()
    .storeUint(config.number, 32)
    .storeAddress(config.address)
    .storeAddress(config.owner_address)
    .endCell();
}

export class MainContract implements Contract {
  readonly address: Address;
  readonly init?: { code: Cell; data: Cell };

  constructor(
    address: Address,
    init?: { code: Cell; data: Cell },
  ) {
    this.address = address;
    this.init = init;
  }

  static createFromConfig(
    config: MainContractConfig,
    code: Cell,
    workchain = 0,
  ) {
    const data = mainContractConfigToCell(config);
    const init = { code, data };
    const address = contractAddress(workchain, init);
    return new MainContract(address, init);
  }

  async sendDeploy(provider: ContractProvider, sender: Sender, value: bigint) {
    await provider.internal(sender, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().storeUint(2, 32).endCell(),
    });
  }

  async sendIncrement(
    provider: ContractProvider,
    sender: Sender,
    value: bigint,
  ) {
    const msg_body = beginCell()
      .storeUint(1, 32) // OP code
      .endCell();

    await provider.internal(sender, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: msg_body,
    });
  }

  async getData(provider: ContractProvider) {
    const { stack } = await provider.get("get_contract_storage_data", []);
    return {
      number: stack.readNumber(),
      recent_sender: stack.readAddress(),
      owner_address: stack.readAddress(),
    };
  }

  async getBalance(provider: ContractProvider) {
    const { stack } = await provider.get("balance", []);
    return {
      balance: stack.readNumber() / 1e9,
    };
  }

  async sendDeposit(provider: ContractProvider, sender: Sender, value: bigint) {
    const msg_body = beginCell()
      .storeUint(2, 32) // OP code for deposit
      .endCell();
    await provider.internal(sender, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: msg_body,
    });
  }

  async sendNoOpCodeDeposit(
    provider: ContractProvider,
    sender: Sender,
    value: bigint,
  ) {
    await provider.internal(sender, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().endCell(),
    });
  }

  async sendWithdrawalRequest(
    provider: ContractProvider,
    sender: Sender,
    value: bigint,
    amount: bigint,
  ) {
    await provider.internal(sender, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().storeUint(3, 32).storeCoins(amount).endCell(),
    });
  }
}
