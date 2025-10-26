declare global {
  interface Window {
    __menuAppInitialized?: boolean;
    __coffeeHouseAppInitialized?: boolean;
    cart?: unknown;
  }
}

export {};
