import { useSyncExternalStore } from "react";
import { settings, formatMoney, CURRENCY_SYMBOL, type Currency } from "@/lib/storage";

function getSnapshot(): Currency {
  return settings.get().currency;
}

function getServerSnapshot(): Currency {
  return "SAR";
}

/**
 * Subscribe to the user's selected currency. Re-renders the component
 * whenever the currency changes (from the Settings page or another tab).
 */
export function useCurrency() {
  const currency = useSyncExternalStore(
    settings.subscribeCurrency,
    getSnapshot,
    getServerSnapshot,
  );

  return {
    currency,
    symbol: CURRENCY_SYMBOL[currency],
    format: (n: number) => formatMoney(n, currency),
    setCurrency: (c: Currency) => settings.setCurrency(c),
  };
}
