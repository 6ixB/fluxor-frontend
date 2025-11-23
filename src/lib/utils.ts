import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { StoreApi, UseBoundStore } from "zustand";

const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

/*
  Usage: create selectors for a zustand store
  Example: 
    const useBearStore = createSelectors(useBearStoreBase)
    const bears = useBearStore.use.bears()
*/
type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never;

const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(
  _store: S,
) => {
  const store = _store as WithSelectors<typeof _store>;
  store.use = {};
  for (const k of Object.keys(store.getState())) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (store.use as any)[k] = () => store((s) => s[k as keyof typeof s]);
  }

  return store;
};

function printSplashScreen() {
  const style = `
    font-family: monospace;
    white-space: pre;
    display: block;
    overflow: hidden;
    line-height: 1.1;
  `;

  const banner = `
 ________ ___       ___  ___     ___    ___ ________  ________     
|\\  _____\\\\  \\     |\\  \\|\\  \\   |\\  \\  /  /|\\   __  \\|\\   __  \\    
\\ \\  \\__/\\ \\  \\    \\ \\  \\\\\\  \\  \\ \\  \\/  / | \\  \\|\\  \\ \\  \\|\\  \\   
 \\ \\   __\\\\ \\  \\    \\ \\  \\\\\\  \\  \\ \\    / / \\ \\  \\\\\\  \\ \\   _  _\\  
  \\ \\  \\_| \\ \\  \\____\\ \\  \\\\\\  \\  /     \\/   \\ \\  \\\\\\  \\ \\  \\\\  \\| 
   \\ \\__\\   \\ \\_______\\ \\_______\\/  /\\   \\    \\ \\_______\\ \\__\\\\ _\\ 
    \\|__|    \\|_______|\\|_______/__/ /\\ __\\    \\|_______|\\|__|\\|__|
                                |__|/ \\|__|                         


Greetings!

- Author https://github.com/6ixB
`;

  console.log(`%c${banner}`, style);
}

export { cn, createSelectors, printSplashScreen };
