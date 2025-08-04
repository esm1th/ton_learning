import { useEffect, useState } from "react";


export function useAsyncInitialize<T>(
  func: () => Promise<T | undefined>,
  deps: unknown[] = [],
): T | undefined {
  const [state, setState] = useState<T | undefined>(undefined);

  useEffect(() => {
    void (
      async () => {
        setState(await func());
      }
    )();
  }, [...deps]);

  return state;
}
