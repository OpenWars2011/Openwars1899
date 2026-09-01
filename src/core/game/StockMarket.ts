import { Gold } from "./Game";

export const STOCK_SYMBOLS = ["Aurora", "Borealis", "Cobalt", "Meridian", "Solara"] as const;
export type StockSymbol = (typeof STOCK_SYMBOLS)[number];

const BASE_PRICES: Record<StockSymbol, number> = {
  Aurora: 100_000,
  Borealis: 125_000,
  Cobalt: 150_000,
  Meridian: 175_000,
  Solara: 200_000,
};

export function stockPrice(tick: number, symbol: StockSymbol): Gold {
  const base = BASE_PRICES[symbol];
  const wave = Math.sin(tick / 180 + STOCK_SYMBOLS.indexOf(symbol) * 1.7);
  return BigInt(Math.max(10_000, Math.round(base * (1 + wave * 0.5))));
}