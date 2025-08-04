import { useTonConnectUI } from "@tonconnect/ui-react";
import { type Sender, type SenderArguments } from "@ton/core";

export function useTonConnect(): { sender: Sender; connected: boolean } {
  const [tonConnectUi] = useTonConnectUI();
  return {
    sender: {
      send: async (args: SenderArguments) => {
        await tonConnectUi.sendTransaction({
          messages: [
            {
              address: args.to.toString(),
              amount: args.value.toString(),
              payload: args.body?.toBoc().toString("base64"),
            },
          ],
          validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes for user to approve
        });
      },
    },
    connected: tonConnectUi.connected,
  };
};
